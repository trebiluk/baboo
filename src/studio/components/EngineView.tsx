import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import type { Floor } from '../types';
import type { FloorFinishId } from '../data/flooring';
import { buildHouse, stepWalk, type HouseLook } from '../lib/engine3d';

export type EngineHandle = {
  reset: () => void;
  walkBy: (steps: number) => void;
};

type Props = {
  floor: Floor;
  look: HouseLook;
  sky: string;
  walk: boolean;
};

type Cam = {
  yaw: number;
  pitch: number;
  dist: number;
  tx: number;
  ty: number;
  tz: number;
  eyeX: number;
  eyeZ: number;
  eyeYaw: number;
  eyePitch: number;
};

/** Where the sun sits: the shadows and the painted sun glow use the same direction (2.13.18). */
const SUN_DIR = new THREE.Vector3(26, 40, 14).normalize();

/**
 * A painted sky in the student's colour: deep at the top, warm at the horizon,
 * a soft sun glow where the light comes from, and a few clouds. Wrapped round a dome.
 */
function skyDome(zenithHex: string): { mesh: THREE.Mesh; dispose: () => void } {
  const W = 512;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const zenith = new THREE.Color(zenithHex);
  const mid = zenith.clone().lerp(new THREE.Color('#d6e7f6'), 0.45);
  const horizon = zenith.clone().lerp(new THREE.Color('#eef4f8'), 0.7);
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, `#${zenith.getHexString()}`);
    g.addColorStop(0.3, `#${mid.getHexString()}`);
    g.addColorStop(0.49, `#${horizon.getHexString()}`);
    g.addColorStop(0.52, '#d9e2c8');
    g.addColorStop(1, '#a9b894');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // sun glow: SphereGeometry maps u to atan2(z, -x) and v down from the top
    const phi = Math.atan2(SUN_DIR.z, -SUN_DIR.x);
    const sx = (((phi / (Math.PI * 2)) % 1) + 1) % 1 * W;
    const sy = (Math.acos(SUN_DIR.y) / Math.PI) * H;
    for (const dx of [-W, 0, W]) {
      const glow = ctx.createRadialGradient(sx + dx, sy, 0, sx + dx, sy, 90);
      glow.addColorStop(0, 'rgba(255,250,232,0.95)');
      glow.addColorStop(0.08, 'rgba(255,244,214,0.7)');
      glow.addColorStop(0.4, 'rgba(255,236,200,0.18)');
      glow.addColorStop(1, 'rgba(255,236,200,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }
    // soft clouds, fixed pattern so every visit looks the same
    let n = 97;
    const rnd = () => { n = (n * 9301 + 49297) % 233280; return n / 233280; };
    for (let i = 0; i < 26; i++) {
      const cx = rnd() * W;
      const cy = H * (0.14 + rnd() * 0.3);
      const rx = 18 + rnd() * 46;
      for (let k = 0; k < 5; k++) {
        const px = cx + (rnd() - 0.5) * rx * 1.6;
        const py = cy + (rnd() - 0.5) * 6;
        const r = rx * (0.35 + rnd() * 0.4);
        const cg = ctx.createRadialGradient(px, py, 0, px, py, r);
        cg.addColorStop(0, 'rgba(255,255,255,0.5)');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(1, 0.32);
        ctx.translate(-px, -py);
        ctx.fillStyle = cg;
        ctx.fillRect(px - r, py - r, r * 2, r * 2);
        ctx.restore();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  const geo = new THREE.SphereGeometry(360, 48, 24);
  const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false });
  return {
    mesh: new THREE.Mesh(geo, mat),
    dispose: () => {
      geo.dispose();
      mat.dispose();
      tex.dispose();
    },
  };
}

function forcedTier(): 'plain' | 'rich' | null {
  if (typeof location === 'undefined') return null;
  const v = new URLSearchParams(location.search).get('gfx');
  return v === 'plain' || v === 'rich' ? v : null;
}

function pickTier(width: number): 'plain' | 'rich' {
  const forced = forcedTier();
  if (forced) return forced;
  if (typeof navigator === 'undefined') return 'plain';
  const cores = navigator.hardwareConcurrency || 2;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (width < 1000 || cores < 6 || mem < 6) return 'plain';
  if (/CrOS/.test(navigator.userAgent) && cores < 8) return 'plain';
  return 'rich';
}

function fitCam(root: THREE.Object3D): Cam {
  const box = new THREE.Box3();
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || mesh.geometry?.type === 'CircleGeometry') return;
    box.expandByObject(mesh);
  });
  if (box.isEmpty()) {
    return { yaw: 0.7, pitch: 0.55, dist: 40, tx: 0, ty: 4, tz: 0, eyeX: -8, eyeZ: -12, eyeYaw: 0.4, eyePitch: 0 };
  }
  const c = box.getCenter(new THREE.Vector3());
  const s = box.getSize(new THREE.Vector3());
  const dist = Math.max(16, Math.max(s.x, s.z) * 0.98);
  return {
    yaw: 0.65,
    pitch: 0.48,
    dist,
    tx: c.x,
    ty: Math.max(3, s.y * 0.35),
    tz: c.z,
    eyeX: c.x,
    eyeZ: box.min.z - 6,
    eyeYaw: 0,
    eyePitch: -0.04,
  };
}

export const EngineView = forwardRef<EngineHandle, Props>(function EngineView({ floor, look, sky, walk }, ref) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const walkRef = useRef(walk);
  const camRef = useRef<Cam | null>(null);
  const floorRef = useRef(floor);
  walkRef.current = walk;
  floorRef.current = floor;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const renderer = new THREE.WebGLRenderer({
      antialias: (wrap.clientWidth || 800) >= 900,
      powerPreference: 'default',
    });
    const narrow = (wrap.clientWidth || 800) < 1000;
    renderer.setPixelRatio(Math.min(narrow ? 1 : 1.25, window.devicePixelRatio || 1));
    renderer.setSize(wrap.clientWidth || 800, wrap.clientHeight || 480);
    let tier = pickTier(wrap.clientWidth || 800);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const zenith = new THREE.Color(sky);
    const horizon = zenith.clone().lerp(new THREE.Color('#eef4f8'), 0.7);
    scene.background = horizon;
    scene.fog = new THREE.Fog(horizon, 220, 520);
    const skyMesh = skyDome(sky);
    scene.add(skyMesh.mesh);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.15, 500);
    const hemi = new THREE.HemisphereLight(0xd6e6f5, look.ground, 0.82);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xffefd2, 2.1);
    sun.position.set(48, 72, 28);
    sun.castShadow = true;
    sun.shadow.mapSize.set(tier === 'rich' ? 2048 : 512, tier === 'rich' ? 2048 : 512);
    sun.shadow.radius = 3;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 160;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    scene.add(sun);
    scene.add(sun.target);
    scene.add(new THREE.AmbientLight(0xffffff, tier === 'rich' ? 0.08 : 0.16));
    // Light and reflections from the sky the student picked: glass, floors and metal pick it up.
    // Only on bigger machines: it costs a lot per pixel on a Chromebook (2.13.18).
    let envRT: THREE.WebGLRenderTarget | null = null;
    if (tier === 'rich') {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      const envSky = skyDome(sky);
      envScene.add(envSky.mesh);
      envRT = pmrem.fromScene(envScene, 0.04);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.85;
      hemi.intensity = 0.7;
      envSky.dispose();
      pmrem.dispose();
    }
    const fill = new THREE.PointLight(0xfff4e0, 0, 18, 1.4);
    scene.add(fill);

    const built = buildHouse(floor, { ...look, rich: tier === 'rich' });
    scene.add(built.root);
    const ceilings: THREE.Object3D[] = [];
    const roofs: THREE.Object3D[] = [];
    const shade = new THREE.Box3();
    built.root.traverse((obj) => {
      if (obj.name === 'ceiling') ceilings.push(obj);
      if (obj.name === 'roof') roofs.push(obj);
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || mesh.geometry?.type === 'CircleGeometry' || obj.name === 'ceiling') return;
      shade.expandByObject(mesh);
    });
    if (!shade.isEmpty()) {
      const c = shade.getCenter(new THREE.Vector3());
      const s = shade.getSize(new THREE.Vector3());
      const span = Math.min(64, Math.max(s.x, s.z) * 0.62 + 8);
      const reach = Math.max(48, s.y + 44);
      sun.position.set(c.x + SUN_DIR.x * reach, c.y + SUN_DIR.y * reach, c.z + SUN_DIR.z * reach);
      sun.target.position.set(c.x, c.y, c.z);
      const cam = sun.shadow.camera;
      cam.left = -span;
      cam.right = span;
      cam.top = span;
      cam.bottom = -span;
      cam.updateProjectionMatrix();
    }
    for (const lid of ceilings) lid.visible = walkRef.current;
    camRef.current = fitCam(built.root);
    const home = { ...camRef.current };

    const desiredPos = new THREE.Vector3();
    const desiredLook = new THREE.Vector3();
    const smoothLook = new THREE.Vector3();
    let snap = true;
    const apply = () => {
      const cam = camRef.current;
      if (!cam) return;
      if (walkRef.current) {
        desiredPos.set(cam.eyeX, 5.2, cam.eyeZ);
        desiredLook.set(
          cam.eyeX + Math.sin(cam.eyeYaw) * Math.cos(cam.eyePitch),
          5.2 + Math.sin(cam.eyePitch),
          cam.eyeZ + Math.cos(cam.eyeYaw) * Math.cos(cam.eyePitch),
        );
        fill.position.copy(desiredPos);
        fill.intensity = 0.9;
      } else {
        const cy = cam.ty + cam.dist * Math.sin(cam.pitch);
        const flat = cam.dist * Math.cos(cam.pitch);
        desiredPos.set(cam.tx + flat * Math.sin(cam.yaw), cy, cam.tz + flat * Math.cos(cam.yaw));
        desiredLook.set(cam.tx, cam.ty, cam.tz);
        fill.intensity = 0;
      }
      if (snap) {
        camera.position.copy(desiredPos);
        smoothLook.copy(desiredLook);
        snap = false;
      } else {
        camera.position.lerp(desiredPos, 0.34);
        smoothLook.lerp(desiredLook, 0.34);
      }
      camera.lookAt(smoothLook);
    };

    let drag: { x: number; y: number; yaw: number; pitch: number; pan: boolean; tx: number; tz: number } | null = null;
    const down = (e: PointerEvent) => {
      const cam = camRef.current;
      if (!cam) return;
      renderer.domElement.setPointerCapture(e.pointerId);
      drag = {
        x: e.clientX,
        y: e.clientY,
        yaw: walkRef.current ? cam.eyeYaw : cam.yaw,
        pitch: walkRef.current ? cam.eyePitch : cam.pitch,
        pan: e.shiftKey || e.button === 1,
        tx: cam.tx,
        tz: cam.tz,
      };
    };
    const move = (e: PointerEvent) => {
      const cam = camRef.current;
      if (!drag || !cam) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (walkRef.current) {
        cam.eyeYaw = drag.yaw - dx * 0.007;
        cam.eyePitch = Math.max(-0.45, Math.min(0.55, drag.pitch - dy * 0.004));
      } else if (drag.pan) {
        const k = cam.dist * 0.0022;
        cam.tx = drag.tx - dx * k;
        cam.tz = drag.tz - dy * k;
      } else {
        cam.yaw = drag.yaw - dx * 0.007;
        cam.pitch = Math.max(0.12, Math.min(1.15, drag.pitch + dy * 0.004));
      }
    };
    const up = () => { drag = null; };
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const cam = camRef.current;
      if (!cam) return;
      if (walkRef.current) {
        const steps = -Math.sign(e.deltaY) * 1.6;
        const next = stepWalk(floorRef.current, cam.eyeX, cam.eyeZ, cam.eyeYaw, steps);
        cam.eyeX = next.x;
        cam.eyeZ = next.z;
        return;
      }
      const factor = e.deltaY > 0 ? 1.08 : 0.92;
      cam.dist = Math.max(8, Math.min(180, cam.dist * factor));
    };
    renderer.domElement.addEventListener('pointerdown', down);
    renderer.domElement.addEventListener('pointermove', move);
    renderer.domElement.addEventListener('pointerup', up);
    renderer.domElement.addEventListener('pointercancel', up);
    renderer.domElement.addEventListener('wheel', wheel, { passive: false });

    const reset = () => {
      camRef.current = { ...home };
      snap = true;
    };
    (wrap as HTMLDivElement & { __babooReset?: () => void }).__babooReset = reset;

    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth || 800;
      const h = wrap.clientHeight || 480;
      renderer.setSize(w, h, false);
      composer?.setSize(w, h);
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    });
    ro.observe(wrap);

    let hidden = document.hidden;
    const onVis = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    let composer: EffectComposer | null = null;
    const makeComposer = () => {
      const w = wrap.clientWidth || 800;
      const h = wrap.clientHeight || 480;
      const c = new EffectComposer(renderer);
      c.addPass(new RenderPass(scene, camera));
      const ao = new GTAOPass(scene, camera, w, h);
      ao.blendIntensity = 0.85;
      c.addPass(ao);
      c.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.22, 0.4, 0.9));
      c.addPass(new OutputPass());
      c.setSize(w, h);
      return c;
    };
    if (tier === 'rich') {
      try {
        composer = makeComposer();
      } catch {
        composer = null;
        tier = 'plain';
      }
    }
    // Watch the first seconds: if frames are slow, step down so drawing stays smooth on Chromebooks.
    // Step 1 drops corner shading and glow. Step 2 uses smaller shadows and fewer pixels (2.13.18).
    let watchFrames = 0;
    let watchStart = 0;
    let stepped = 0;
    const watch = (now: number) => {
      if (stepped >= 2 || forcedTier()) return;
      watchFrames += 1;
      if (watchFrames === 8) watchStart = now;
      if (watchFrames <= 8 || now - watchStart < 1500) return;
      const avg = (now - watchStart) / (watchFrames - 8);
      if (avg > 40 && composer) {
        composer.dispose();
        composer = null;
        tier = 'plain';
        stepped = 1;
      } else if (avg > 55) {
        sun.shadow.mapSize.set(512, 512);
        sun.shadow.map?.dispose();
        sun.shadow.map = null;
        renderer.setPixelRatio(Math.min(1, window.devicePixelRatio || 1) * 0.8);
        renderer.setSize(wrap.clientWidth || 800, wrap.clientHeight || 480, false);
        stepped = 2;
      } else {
        stepped = 2;
      }
      watchFrames = 0;
    };

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (hidden) return;
      for (const lid of ceilings) lid.visible = walkRef.current;
      const camNow = camRef.current;
      const hideRoof = !walkRef.current && !!camNow && camNow.pitch > 0.78;
      for (const lid of roofs) lid.visible = !hideRoof;
      apply();
      watch(performance.now());
      if (composer) composer.render();
      else renderer.render(scene, camera);
    };
    loop();

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(frame);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', down);
      renderer.domElement.removeEventListener('pointermove', move);
      renderer.domElement.removeEventListener('pointerup', up);
      renderer.domElement.removeEventListener('pointercancel', up);
      renderer.domElement.removeEventListener('wheel', wheel);
      built.dispose();
      composer?.dispose();
      envRT?.dispose();
      skyMesh.dispose();
      hemi.dispose();
      sun.dispose();
      fill.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [floor, look, sky]);

  useEffect(() => {
    const wrap = wrapRef.current as (HTMLDivElement & { __babooReset?: () => void }) | null;
    wrap?.__babooReset?.();
  }, [walk]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      const wrap = wrapRef.current as (HTMLDivElement & { __babooReset?: () => void }) | null;
      wrap?.__babooReset?.();
    },
    walkBy: (steps: number) => {
      const cam = camRef.current;
      if (!cam) return;
      const next = stepWalk(floorRef.current, cam.eyeX, cam.eyeZ, cam.eyeYaw, steps);
      cam.eyeX = next.x;
      cam.eyeZ = next.z;
    },
  }), []);

  return <div ref={wrapRef} className="engine-view" data-aw3d-engine="webgl" />;
});
