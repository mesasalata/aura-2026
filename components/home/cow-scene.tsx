"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS2DObject, CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import type { MotionValue } from "motion/react";
import { asset } from "@/lib/utils";
import { CALL_BY_ID, COW_CALLS, splotchMarkup, type CowLandmark } from "@/components/home/cow-copy";

type Props = {
  progress: MotionValue<number>;
  reduce: boolean;
};

const MILK = 0xf6eee0;

function span(p: number, a: number, b: number) {
  if (b === a) return p >= b ? 1 : 0;
  return THREE.MathUtils.clamp((p - a) / (b - a), 0, 1);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function windowAlpha(p: number, [a, b, c, d]: readonly [number, number, number, number], reduce: boolean) {
  if (reduce) return 1;
  if (p <= a || p >= d) return 0;
  if (p < b) return smooth(span(p, a, b));
  if (p <= c) return 1;
  return 1 - smooth(span(p, c, d));
}

/** GLB empties the splotches parent to - they ride the model, not a copied point. */
const EMPTY: Record<CowLandmark, { name: string; offset?: [number, number, number] }> = {
  head: { name: "head" },
  milk: { name: "udder", offset: [0.12, 0.1, 0.08] },
  fet: { name: "udder", offset: [-0.12, -0.08, -0.06] },
  herd: { name: "body1" },
};

/** Stable opposite sides so neighbouring calls never share a hang. */
const HANG_SIDE: Record<CowLandmark, "1" | "-1"> = {
  head: "-1",
  milk: "1",
  fet: "-1",
  herd: "1",
};

const COVER_ROTS = [0, 10, -10, 16, -16, 8, -8, 24, -24, 90];

function bboxFallback(root: THREE.Object3D, id: CowLandmark) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const min = box.min;
  if (id === "head") return new THREE.Vector3(min.x + size.x * 0.5, min.y + size.y * 0.62, min.z + size.z * 0.92);
  if (id === "herd") return new THREE.Vector3(min.x + size.x * 0.5, min.y + size.y * 0.58, min.z + size.z * 0.55);
  return new THREE.Vector3(min.x + size.x * 0.52, min.y + size.y * 0.18, min.z + size.z * 0.22);
}

function pinToEmpty(root: THREE.Object3D, mark: THREE.Object3D, id: CowLandmark) {
  const spec = EMPTY[id];
  const empty = root.getObjectByName(spec.name);
  if (empty) {
    empty.add(mark);
    if (spec.offset) mark.position.set(...spec.offset);
    return;
  }
  root.add(mark);
  mark.position.copy(bboxFallback(root, id));
}

function copyInsideBlob(path: SVGPathElement, side: number, rotDeg: number, tw: number, th: number) {
  if (side < 8 || tw < 4 || th < 4) return false;
  const k = 100 / side;
  const rad = (-rotDeg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  for (let i = 0; i <= 4; i++) {
    for (let j = 0; j <= 4; j++) {
      const hx = (i / 4 - 0.5) * tw;
      const hy = (j / 4 - 0.5) * th;
      const vx = 50 + (hx * c - hy * s) * k;
      const vy = 50 + (hx * s + hy * c) * k;
      if (!path.isPointInFill(new DOMPoint(vx, vy))) return false;
    }
  }
  return true;
}

/** Uniform scale + rotate the blob so it covers the copy. Never stretch. */
function coverSplotch(el: HTMLElement) {
  const fill = el.querySelector(".cow-splotch-fill") as SVGSVGElement | null;
  const path = fill?.querySelector("path");
  const copy = el.querySelector(".cow-splotch-copy") as HTMLElement | null;
  if (!fill || !path || !copy) return;
  const tw = copy.offsetWidth;
  const th = copy.offsetHeight;
  if (tw < 4 || th < 4) return;
  const minSide = Math.hypot(tw, th);
  let bestSide = minSide * 2.5;
  let bestRot = 0;
  for (const rot of COVER_ROTS) {
    let lo = minSide;
    let hi = minSide * 2.8;
    let ok = Number.POSITIVE_INFINITY;
    for (let n = 0; n < 9; n++) {
      const mid = (lo + hi) / 2;
      if (copyInsideBlob(path, mid, rot, tw, th)) {
        ok = mid;
        hi = mid;
      } else {
        lo = mid;
      }
    }
    if (ok < bestSide) {
      bestSide = ok;
      bestRot = rot;
    }
  }
  fill.style.width = `${bestSide}px`;
  fill.style.height = `${bestSide}px`;
  fill.style.rotate = `${bestRot}deg`;
}

function overlapAmount(a: DOMRect, b: DOMRect, gap: number) {
  const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return { ox: ox + gap, oy: oy + gap, hits: ox > -gap && oy > -gap };
}

function separateSplotches(items: { id: CowLandmark; el: HTMLElement }[]) {
  const live = items.filter((s) => s.el.style.visibility !== "hidden");
  for (const s of live) {
    s.el.dataset.hang = HANG_SIDE[s.id];
    s.el.style.setProperty("--nudge-x", "0px");
    s.el.style.setProperty("--nudge-y", "0px");
  }
  const gap = 18;
  for (let pass = 0; pass < 8; pass++) {
    let moved = false;
    for (let i = 0; i < live.length; i++) {
      for (let j = i + 1; j < live.length; j++) {
        const ha = live[i].el.querySelector(".cow-splotch-hang") as HTMLElement | null;
        const hb = live[j].el.querySelector(".cow-splotch-hang") as HTMLElement | null;
        if (!ha || !hb) continue;
        const { ox, oy, hits } = overlapAmount(ha.getBoundingClientRect(), hb.getBoundingClientRect(), gap);
        if (!hits) continue;
        const ny = parseFloat(live[j].el.style.getPropertyValue("--nudge-y")) || 0;
        const nx = parseFloat(live[j].el.style.getPropertyValue("--nudge-x")) || 0;
        const ra = ha.getBoundingClientRect();
        const rb = hb.getBoundingClientRect();
        const dy = (rb.top + rb.bottom) / 2 - (ra.top + ra.bottom) / 2;
        const dx = (rb.left + rb.right) / 2 - (ra.left + ra.right) / 2;
        if (oy <= ox) {
          const sign = dy === 0 ? (j % 2 === 0 ? -1 : 1) : dy > 0 ? 1 : -1;
          live[j].el.style.setProperty("--nudge-y", `${ny + sign * oy}px`);
        } else {
          const sign = dx === 0 ? 1 : dx > 0 ? 1 : -1;
          live[j].el.style.setProperty("--nudge-x", `${nx + sign * ox}px`);
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
}

function cappedPixelRatio() {
  const dpr = window.devicePixelRatio || 1;
  const cap = window.innerWidth < 768 ? 1 : 1.5;
  return Math.min(dpr, cap);
}

export default function CowScene({ progress, reduce }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let dead = false;
    let frame = 0;
    let looping = false;
    let onScreen = true;
    let pageVisible = document.visibilityState !== "hidden";
    let modelReady = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setClearColor(MILK, 1);
    renderer.setPixelRatio(cappedPixelRatio());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "absolute inset-0 h-full w-full";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const labels = new CSS2DRenderer();
    labels.domElement.className = "cow-splotch-layer pointer-events-none absolute inset-0";
    host.appendChild(labels.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(MILK);

    const camera = new THREE.PerspectiveCamera(36, 1, 0.08, 40);
    const pivot = new THREE.Group();
    scene.add(pivot);

    scene.add(new THREE.HemisphereLight(0xfff6ea, 0xc4b49a, 1.35));
    const key = new THREE.DirectionalLight(0xfff4e6, 1.15);
    key.position.set(2.4, 4.2, 3.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe8f4f6, 0.45);
    fill.position.set(-3, 1.4, -1.5);
    scene.add(fill);

    const marks: Record<CowLandmark, THREE.Object3D> = {
      head: new THREE.Object3D(),
      milk: new THREE.Object3D(),
      fet: new THREE.Object3D(),
      herd: new THREE.Object3D(),
    };

    const splotches: { id: CowLandmark; object: CSS2DObject; el: HTMLElement }[] = [];
    const coverWatchers: ResizeObserver[] = [];
    const camFwd = new THREE.Vector3();
    const labelWorld = new THREE.Vector3();
    const toLabel = new THREE.Vector3();

    const fullPos = new THREE.Vector3();
    const closePos = new THREE.Vector3();
    const fullTarget = new THREE.Vector3(0, 0.04, 0);
    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();
    const udderWorld = new THREE.Vector3();

    const fit = (root: THREE.Object3D) => {
      const raw = new THREE.Box3().setFromObject(root);
      const rawSize = raw.getSize(new THREE.Vector3());
      const s = 1.85 / Math.max(rawSize.x, rawSize.y, rawSize.z, 0.0001);
      root.scale.setScalar(s);
      root.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(root);
      root.position.sub(box.getCenter(new THREE.Vector3()));
      root.updateMatrixWorld(true);
      for (const key of Object.keys(marks) as CowLandmark[]) {
        pinToEmpty(root, marks[key], key);
      }
      if (!reduce) {
        for (const call of COW_CALLS) {
          const wrap = document.createElement("div");
          wrap.innerHTML = splotchMarkup(call);
          const el = wrap.firstElementChild as HTMLElement;
          const obj = new CSS2DObject(el);
          marks[call.id].add(obj);
          splotches.push({ id: call.id, object: obj, el });
          const copy = el.querySelector(".cow-splotch-copy");
          if (copy) {
            const cro = new ResizeObserver(() => coverSplotch(el));
            cro.observe(copy);
            coverWatchers.push(cro);
          }
          requestAnimationFrame(() => coverSplotch(el));
        }
      }
      const fitted = new THREE.Box3().setFromObject(root);
      const size = fitted.getSize(new THREE.Vector3());
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const aspect = Math.max(0.5, camera.aspect || 1);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const distY = (size.y * 0.62) / Math.tan(vFov / 2);
      const distX = (size.x * 0.58) / Math.tan(hFov / 2);
      fullPos.set(Math.max(2.2, distX, distY), fitted.getCenter(new THREE.Vector3()).y + 0.04, 0);
      root.scale.multiplyScalar(0.67);
      root.updateMatrixWorld(true);
    };

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(cappedPixelRatio());
      renderer.setSize(w, h, false);
      labels.setSize(w, h);
    };

    const draw = () => {
      const p = progress.get();
      const yaw = THREE.MathUtils.lerp(Math.PI / 2, 0, smooth(span(p, 0.05, 0.26)));
      pivot.rotation.y = yaw;
      pivot.updateMatrixWorld(true);
      marks.fet.getWorldPosition(udderWorld);

      const zoomIn = smooth(span(p, 0.38, 0.56));
      const zoomOut = smooth(span(p, 0.72, 0.9));
      const zoom = zoomIn * (1 - zoomOut);

      closePos.set(udderWorld.x + 1.4, udderWorld.y + 0.0, 0.0);
      camPos.copy(fullPos).lerp(closePos, zoom);
      camTarget.copy(fullTarget).lerp(udderWorld, zoom);
      camera.position.copy(camPos);
      camera.lookAt(camTarget);
      camera.updateMatrixWorld(true);
      camera.getWorldDirection(camFwd);
      const distFull = Math.max(1, fullPos.length());

      for (const splotch of splotches) {
        const call = CALL_BY_ID[splotch.id];
        let alpha = windowAlpha(p, call.show, reduce);
        splotch.object.getWorldPosition(labelWorld);
        toLabel.copy(labelWorld).sub(camera.position).normalize();
        const facing = camFwd.dot(toLabel);
        if (facing < 0.12) alpha *= Math.max(0, (facing + 0.05) / 0.17);
        const depth = THREE.MathUtils.clamp(distFull / Math.max(0.8, camera.position.distanceTo(labelWorld)), 0.78, 1.16);
        splotch.el.style.setProperty("--depth", depth.toFixed(3));
        splotch.el.style.opacity = alpha.toFixed(3);
        splotch.el.style.visibility = alpha < 0.03 ? "hidden" : "visible";
      }

      renderer.render(scene, camera);
      labels.render(scene, camera);
      separateSplotches(splotches);
    };

    const stopLoop = () => {
      looping = false;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const tick = () => {
      if (dead || !looping) return;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (dead || !modelReady || !onScreen || !pageVisible || looping) return;
      looping = true;
      frame = requestAnimationFrame(tick);
    };

    const syncLoop = () => {
      if (onScreen && pageVisible && modelReady) startLoop();
      else stopLoop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry?.isIntersecting ?? false;
        syncLoop();
      },
      { root: null, threshold: 0, rootMargin: "80px 0px" },
    );
    io.observe(host);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      syncLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const loader = new GLTFLoader();
    loader.load(
      asset("/art/cow.glb"),
      (gltf) => {
        if (dead) {
          gltf.scene.traverse((obj) => {
            const mesh = obj as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const m of mats) m.dispose();
          });
          return;
        }
        gltf.scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) {
            mesh.frustumCulled = false;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          }
        });
        fit(gltf.scene);
        pivot.add(gltf.scene);
        modelReady = true;
        draw();
        syncLoop();
      },
    );

    return () => {
      dead = true;
      stopLoop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ro.disconnect();
      for (const w of coverWatchers) w.disconnect();
      for (const s of splotches) s.el.remove();
      pivot.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          const std = m as THREE.MeshStandardMaterial;
          std.map?.dispose();
          m.dispose();
        }
      });
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
      labels.domElement.remove();
    };
  }, [progress, reduce]);

  return <div ref={hostRef} className="pointer-events-none absolute inset-0" />;
}
