import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

type ModelViewerProps = {
  src: string;
  label: string;
  /** Called once the model is on screen, so the poster can fade out. */
  onReady?: () => void;
};

const SPIN = 0.2; // radians per second, a slow turn
const START_ANGLE = 0.6;

/**
 * One model, turning slowly, that visitors can drag (or arrow-key) to spin.
 * Renders only while on screen, and holds still for reduced motion.
 */
export default function ModelViewer({ src, label, onReady }: ModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) onReady?.();
  }, [ready, onReady]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // No WebGL: the poster image stays.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 6, 4);
    scene.add(key);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const pivot = new THREE.Group();
    pivot.rotation.y = START_ANGLE;
    scene.add(pivot);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let disposed = false;
    let loaded = false;
    let dragging = false;
    let velocity = 0; // from drags, decays back to the slow spin
    let lastX = 0;
    let frame = 0;
    let last = performance.now();

    let halfHeight = 1;
    let turnRadius = 1;
    // Only redraw when something changed (matters when the model holds still).
    let needsRender = true;

    const render = () => {
      renderer.render(scene, camera);
      needsRender = false;
    };

    // Fit the whole model, at any angle of its turn, inside the frame.
    const frameModel = () => {
      const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const tanH = tanV * camera.aspect;
      const distance = Math.max(halfHeight / tanV, turnRadius / tanH) * 1.04 + turnRadius * 0.55;
      camera.position.set(0, halfHeight * 0.42, distance);
      camera.lookAt(0, 0, 0);
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (loaded) {
        frameModel();
        render();
      }
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible || !loaded || document.hidden) return;
      if (!dragging) {
        velocity *= Math.pow(0.04, dt); // ease out after a flick
        if (Math.abs(velocity) < 0.001) velocity = 0;
        const step = (reduceMotion ? 0 : SPIN) * dt + velocity * dt;
        if (step !== 0) {
          pivot.rotation.y += step;
          needsRender = true;
        }
      }
      if (needsRender) render();
    };

    new GLTFLoader().load(
      src,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(box.getCenter(new THREE.Vector3()));
        pivot.add(model);
        halfHeight = size.y / 2;
        // The widest the model gets while turning: a corner of its footprint.
        turnRadius = Math.hypot(size.x, size.z) / 2;
        loaded = true;
        resize();
        render();
        setReady(true);
      },
      undefined,
      (error) => console.error("Model failed to load", error)
    );

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      velocity = 0;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      pivot.rotation.y += dx * 0.01;
      velocity = dx * 0.6;
      needsRender = true;
    };
    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      pivot.rotation.y += event.key === "ArrowLeft" ? -0.3 : 0.3;
      render();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(container);

    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const material of materials) {
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture) value.dispose();
          }
          material.dispose();
        }
      });
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      className={`model-canvas${ready ? " is-ready" : ""}`}
      role="img"
      aria-label={label}
      tabIndex={0}
    />
  );
}
