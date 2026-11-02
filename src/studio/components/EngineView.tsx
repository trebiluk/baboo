import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { peekFor } from '../data/objectPeek';
import type { Floor } from '../types';
import type { FloorFinishId } from '../data/flooring';
import { buildHouse, stepWalk, type HouseLook } from '../lib/engine3d';

export type EngineHandle = {
  reset: () => void;
  walkBy: (steps: number) => void;
  /** Turn: walking, the eye turns; orbiting, the camera goes round the house. -1 left, 1 right. */
  turn: (dir: -1 | 1) => void;
  /** Camera presets for the orbit view (2.13.21). */
  preset: (kind: 'front' | 'top') => void;
};

/** Where the orbit camera was, per floor, so leaving 3D and coming back keeps your place (2.13.21). */
let savedCam: { floorId: string; cam: Cam } | null = null;

type Props = {
  floor: Floor;
  look: HouseLook;
  sky: string;
  walk: boolean;
  /** Plan point to look at on opening (what was selected in 2D). */
  focus?: { x: number; y: number } | null;
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

/**
 * Real furniture: the Kenney CC0 models Baboo already ships (public/objects/kenney, no outside site) replace the
 * block shapes in 3D. They come "unlit", so they get lit materials here to take the sun, lamps and shadows (2.13.22).
 */
const modelCache = new Map<string, Promise<THREE.Object3D | null>>();
const litCache = new Map<string, THREE.MeshStandardMaterial>();
function litFor(old: THREE.MeshBasicMaterial): THREE.MeshStandardMaterial {
  const color = old.color ?? new THREE.Color('#cccccc');
  const key = `${old.map?.uuid ?? '-'}|${color.getHexString()}`;
  let lit = litCache.get(key);
  if (!lit) {
    lit = new THREE.MeshStandardMaterial({ color, map: old.map ?? null, roughness: 0.62, metalness: 0.05 });
    litCache.set(key, lit);
  }
  return lit;
}
/**
 * A model arrives as several small parts. Bake them into one mesh per material, so a room of chairs costs a few
 * draws instead of dozens: this is what keeps the Mansion smooth on a school laptop (2.13.23).
 */
function flattenModel(scene: THREE.Object3D): THREE.Object3D {
  scene.updateMatrixWorld(true);
  const byMat = new Map<THREE.Material, THREE.BufferGeometry[]>();
  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const lit = litFor(m.material as THREE.MeshBasicMaterial);
    let g = m.geometry.clone().applyMatrix4(m.matrixWorld);
    if (g.index) g = g.toNonIndexed();
    if (!g.getAttribute('normal')) g.computeVertexNormals();
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    const list = byMat.get(lit) ?? [];
    list.push(g);
    byMat.set(lit, list);
  });
  const out = new THREE.Group();
  for (const [lit, geos] of byMat) {
    const merged = mergeGeometries(geos, false);
    if (!merged) return scene;
    const mesh = new THREE.Mesh(merged, lit);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    out.add(mesh);
  }
  return out;
}
function loadModel(url: string): Promise<THREE.Object3D | null> {
  const hit = modelCache.get(url);
  if (hit) return hit;
  const p = new GLTFLoader().loadAsync(url).then((gltf) => {
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.material = litFor(m.material as THREE.MeshBasicMaterial);
      m.castShadow = true;
      m.receiveShadow = true;
      if (!m.geometry.getAttribute('normal')) m.geometry.computeVertexNormals();
    });
    try { return flattenModel(gltf.scene); } catch { return gltf.scene as THREE.Object3D; }
  }).catch(() => null);
  modelCache.set(url, p);
  return p;
}

/** Swap each block-built piece for its model, fitted to the piece's width and depth on the plan. */
async function dressFurniture(root: THREE.Object3D, alive: () => boolean, shadows: boolean) {
  const groups: THREE.Group[] = [];
  root.traverse((o) => { if ((o as THREE.Group).userData?.furn) groups.push(o as THREE.Group); });
  for (const g of groups) {
    const info = g.userData.furn as { catalogId: string; w: number; h: number };
    const url = peekFor(info.catalogId)?.kenney;
    if (!url) continue;
    const src = await loadModel(url);
    if (!src || !alive()) return;
    const model = src.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    if (size.x < 1e-3 || size.z < 1e-3) continue;
    // a model that is long the other way turns a quarter, so its long side follows the piece's long side
    const turn = (size.x >= size.z) !== (info.w >= info.h) && Math.abs(size.x - size.z) > 0.15 * Math.max(size.x, size.z);
    const mx = turn ? size.z : size.x;
    const mz = turn ? size.x : size.z;
    const sx = info.w / mx;
    const sz = info.h / mz;
    const sy = (sx + sz) / 2;
    const holder = new THREE.Group();
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x, -box.min.y, -center.z);
    const spin = new THREE.Group();
    spin.add(model);
    if (turn) spin.rotation.y = Math.PI / 2;
    holder.add(spin);
    holder.scale.set(sx, sy, sz);
    if (!shadows) holder.traverse((o) => { (o as THREE.Mesh).castShadow = false; });
    for (const child of [...g.children]) g.remove(child);
    g.add(holder);
  }
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

function fitCam(root: THREE.Object3D, aspect = 1.6): Cam {
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
  // A tall phone screen sees less side to side: step back so the whole house fits across (2.13.26).
  const narrow = aspect < 1.2 ? Math.pow(1.2 / Math.max(0.35, aspect), 0.9) : 1;
  const dist = Math.min(180, Math.max(16, Math.max(s.x, s.z) * 0.98 * narrow));
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

export const EngineView = forwardRef<EngineHandle, Props>(function EngineView({ floor, look, sky, walk, focus }, ref) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const walkRef = useRef(walk);
  const camRef = useRef<Cam | null>(null);
  const floorRef = useRef(floor);
  const focusRef = useRef(focus ?? null);
  walkRef.current = walk;
  floorRef.current = floor;
  focusRef.current = focus ?? null;

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
    let alive = true;
    // when the models land, check speed again (they add work after the first check)
    let recheck: (() => void) | null = null;
    if (look.showFurn) void dressFurniture(built.root, () => alive, tier === 'rich').then(() => { recheck?.(); renderer.shadowMap.needsUpdate = true; });
    // Warm light from lamps and chandeliers: brighter when you walk in. Fewer on small machines (2.13.22).
    const lampLights: THREE.PointLight[] = [];
    for (const at of built.lights.slice(0, tier === 'rich' ? 6 : 2)) {
      const l = new THREE.PointLight(0xffd59a, 0, 26, 1.6);
      l.position.copy(at);
      scene.add(l);
      lampLights.push(l);
    }
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
    const fitted = fitCam(built.root, (wrap.clientWidth || 800) / Math.max(1, wrap.clientHeight || 480));
    const home = { ...fitted };
    // Open where you left off, or aimed at what you picked in 2D; otherwise the whole house.
    const f = focusRef.current;
    // Aim from high enough that the roof lifts off and you look down into the room it is in, not into an
    // outside wall (2.13.23: a low aim used to park the camera among the porch posts).
    if (f) camRef.current = { ...fitted, tx: f.x, tz: f.y, ty: 2, dist: Math.max(24, Math.min(fitted.dist * 0.75, 34)), pitch: 1.0 };
    else if (savedCam && savedCam.floorId === floor.id) camRef.current = { ...savedCam.cam };
    else camRef.current = fitted;

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
        hemi.groundColor.set(0xe9dcc6); // indoors: warm bounce, not lawn green
      } else {
        const cy = cam.ty + cam.dist * Math.sin(cam.pitch);
        const flat = cam.dist * Math.cos(cam.pitch);
        desiredPos.set(cam.tx + flat * Math.sin(cam.yaw), cy, cam.tz + flat * Math.cos(cam.yaw));
        desiredLook.set(cam.tx, cam.ty, cam.tz);
        fill.intensity = 0;
        hemi.groundColor.set(look.ground);
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
    // Two fingers: pinch zooms the outside view, and in a walk, spreading your fingers walks forward (2.13.26).
    const touches = new Map<number, { x: number; y: number }>();
    let pinch: { d: number; dist: number; walked: number } | null = null;
    const spread = () => {
      const [a, b] = [...touches.values()];
      return Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
    };
    const down = (e: PointerEvent) => {
      const cam = camRef.current;
      if (!cam) return;
      renderer.domElement.setPointerCapture(e.pointerId);
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touches.size === 2) {
        drag = null;
        pinch = { d: spread(), dist: cam.dist, walked: 0 };
        return;
      }
      if (touches.size > 2) return;
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
      if (touches.has(e.pointerId)) touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && cam && touches.size === 2) {
        const ratio = spread() / pinch.d;
        if (walkRef.current) {
          // every 12% of spread is one step forward (pinching in walks back)
          const want = Math.round(Math.log(ratio) / Math.log(1.12));
          if (want !== pinch.walked) {
            const next = stepWalk(floorRef.current, cam.eyeX, cam.eyeZ, cam.eyeYaw, (want - pinch.walked) * 1.4);
            cam.eyeX = next.x;
            cam.eyeZ = next.z;
            pinch.walked = want;
          }
        } else {
          cam.dist = Math.max(8, Math.min(180, pinch.dist / ratio));
        }
        return;
      }
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
    const up = (e: PointerEvent) => {
      touches.delete(e.pointerId);
      if (touches.size < 2) pinch = null;
      drag = null;
    };
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

    // Keys: walking, arrows or W A S D step and turn; orbiting, arrows go round and tilt, + and - zoom (2.13.21).
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.altKey || e.ctrlKey || e.metaKey) return;
      const cam = camRef.current;
      if (!cam) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      let used = true;
      if (walkRef.current) {
        if (k === 'ArrowUp' || k === 'w' || k === 'ArrowDown' || k === 's') {
          const next = stepWalk(floorRef.current, cam.eyeX, cam.eyeZ, cam.eyeYaw, (k === 'ArrowUp' || k === 'w') ? 1.2 : -1.2);
          cam.eyeX = next.x;
          cam.eyeZ = next.z;
        } else if (k === 'ArrowLeft' || k === 'a') cam.eyeYaw += 0.14;
        else if (k === 'ArrowRight' || k === 'd') cam.eyeYaw -= 0.14;
        else used = false;
      } else if (k === 'ArrowLeft') cam.yaw -= 0.14;
      else if (k === 'ArrowRight') cam.yaw += 0.14;
      else if (k === 'ArrowUp') cam.pitch = Math.min(1.15, cam.pitch + 0.06);
      else if (k === 'ArrowDown') cam.pitch = Math.max(0.12, cam.pitch - 0.06);
      else if (k === '+' || k === '=') cam.dist = Math.max(8, cam.dist * 0.9);
      else if (k === '-' || k === '_') cam.dist = Math.min(180, cam.dist * 1.1);
      else used = false;
      if (used) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);

    const reset = () => {
      camRef.current = { ...home };
      snap = true;
    };
    const preset = (kind: 'front' | 'top') => {
      const cam = camRef.current;
      if (!cam) return;
      if (kind === 'top') camRef.current = { ...cam, tx: home.tx, tz: home.tz, pitch: 1.15, yaw: Math.PI, dist: home.dist * 1.05 };
      else camRef.current = { ...cam, tx: home.tx, tz: home.tz, pitch: 0.32, yaw: Math.PI, dist: home.dist * 0.95 };
    };
    const turn = (dir: -1 | 1) => {
      const cam = camRef.current;
      if (!cam) return;
      if (walkRef.current) cam.eyeYaw -= dir * 0.35;
      else cam.yaw += dir * (Math.PI / 4);
    };
    (wrap as HTMLDivElement & { __babooPreset?: typeof preset; __babooTurn?: typeof turn }).__babooPreset = preset;
    (wrap as HTMLDivElement & { __babooPreset?: typeof preset; __babooTurn?: typeof turn }).__babooTurn = turn;
    // How much the last frame drew, for speed checks (draw calls and triangles).
    (wrap as HTMLDivElement & { __babooDraws?: () => { calls: number; tris: number } }).__babooDraws = () => ({ calls: renderer.info.render.calls, tris: renderer.info.render.triangles });
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
    let reduced = false; // step 2 done: nothing left to drop
    let watching = true;
    recheck = () => {
      if (reduced) return;
      watchFrames = 0;
      watching = true;
    };
    const watch = (now: number) => {
      if (!watching || reduced || forcedTier()) return;
      watchFrames += 1;
      if (watchFrames === 8) watchStart = now;
      if (watchFrames <= 8 || now - watchStart < 1500) return;
      const avg = (now - watchStart) / (watchFrames - 8);
      watchFrames = 0;
      if (avg > 40 && composer) {
        composer.dispose();
        composer = null;
        tier = 'plain';
        return; // keep watching: step 2 may still be needed
      }
      if (avg > 55) {
        sun.shadow.mapSize.set(512, 512);
        sun.shadow.map?.dispose();
        sun.shadow.map = null;
        renderer.setPixelRatio(Math.min(1, window.devicePixelRatio || 1) * 0.8);
        renderer.setSize(wrap.clientWidth || 800, wrap.clientHeight || 480, false);
        reduced = true;
      }
      watching = false;
    };

    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (hidden) return;
      for (const lid of ceilings) lid.visible = walkRef.current;
      // lamp lights only when you are inside walking; from outside the glowing shades are enough
      for (const l of lampLights) {
        l.visible = walkRef.current;
        l.intensity = 9;
      }
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
      window.removeEventListener('keydown', onKey);
      alive = false;
      for (const l of lampLights) { scene.remove(l); l.dispose(); }
      if (camRef.current && !walkRef.current) savedCam = { floorId: floor.id, cam: { ...camRef.current } };
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

  // Switching between orbit and walking starts that mode fresh; the first render keeps the saved or aimed camera.
  const walkSeen = useRef(walk);
  useEffect(() => {
    if (walkSeen.current === walk) return;
    walkSeen.current = walk;
    const wrap = wrapRef.current as (HTMLDivElement & { __babooReset?: () => void }) | null;
    wrap?.__babooReset?.();
  }, [walk]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      const wrap = wrapRef.current as (HTMLDivElement & { __babooReset?: () => void }) | null;
      wrap?.__babooReset?.();
    },
    turn: (dir: -1 | 1) => {
      const wrap = wrapRef.current as (HTMLDivElement & { __babooTurn?: (d: -1 | 1) => void }) | null;
      wrap?.__babooTurn?.(dir);
    },
    preset: (kind: 'front' | 'top') => {
      const wrap = wrapRef.current as (HTMLDivElement & { __babooPreset?: (k: 'front' | 'top') => void }) | null;
      wrap?.__babooPreset?.(kind);
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
