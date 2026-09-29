import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
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

function skyDome(zenithHex: string): { mesh: THREE.Mesh; dispose: () => void } {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const zenith = new THREE.Color(zenithHex);
  const mid = zenith.clone().lerp(new THREE.Color('#d7e6f4'), 0.45);
  const horizon = zenith.clone().lerp(new THREE.Color('#f4e2c8'), 0.72);
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, `#${zenith.getHexString()}`);
    g.addColorStop(0.42, `#${mid.getHexString()}`);
    g.addColorStop(0.78, `#${horizon.getHexString()}`);
    g.addColorStop(1, '#c5d4b0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.SphereGeometry(360, 20, 12);
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
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    wrap.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const zenith = new THREE.Color(sky);
    const horizon = zenith.clone().lerp(new THREE.Color('#f4e2c8'), 0.62);
    scene.background = horizon;
    scene.fog = new THREE.Fog(horizon, 160, 440);
    const skyMesh = skyDome(sky);
    scene.add(skyMesh.mesh);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.15, 500);
    const hemi = new THREE.HemisphereLight(0xd6e6f5, look.ground, 0.82);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d8, 1.35);
    sun.position.set(48, 72, 28);
    sun.castShadow = true;
    sun.shadow.mapSize.set(512, 512);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 160;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.05;
    scene.add(sun);
    scene.add(sun.target);
    scene.add(new THREE.AmbientLight(0xffffff, 0.16));
    const fill = new THREE.PointLight(0xfff4e0, 0, 18, 1.4);
    scene.add(fill);

    const built = buildHouse(floor, look);
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
      sun.position.set(c.x + 26, Math.max(24, s.y + 36), c.z + 14);
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
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    });
    ro.observe(wrap);

    let hidden = document.hidden;
    const onVis = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (hidden) return;
      for (const lid of ceilings) lid.visible = walkRef.current;
      const camNow = camRef.current;
      const hideRoof = !walkRef.current && !!camNow && camNow.pitch > 0.78;
      for (const lid of roofs) lid.visible = !hideRoof;
      apply();
      renderer.render(scene, camera);
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
