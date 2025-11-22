import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./SceneCanvas.css";

type SceneCanvasProps = {
  modelPath: string;
  className?: string;
  scale?: number;
  setupLights?: (scene: THREE.Scene) => void;
  animateModel?: (model: THREE.Object3D | null) => void;
  animateModel2?: (model: THREE.Object3D | null) => void;
  includeTorus?: boolean;
};

export default function SceneCanvas({
  modelPath,
  className = "",
  scale = 1,
  setupLights,
  animateModel,
  animateModel2,
  includeTorus = false,
}: SceneCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      74,
      container.clientWidth / container.clientHeight || 1,
      0.1,
      500
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    scene.add(camera);

    camera.position.setZ(30);
    camera.position.setX(0);

    setupLights?.(scene);

    const loader = new GLTFLoader();
    let loadedModel: THREE.Object3D | null = null;
    let loadedModel2: THREE.Object3D | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        loadedModel = gltf.scene.children[0] ?? gltf.scene;
        if (loadedModel) {
          loadedModel.scale.set(scale, scale, scale);
          loadedModel.position.set(0, 0, 0);
        }
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        loadedModel2 = gltf.scene.children[0] ?? gltf.scene;
        if (loadedModel2) {
          loadedModel2.position.set(0, -8, 0);
          loadedModel2.scale.set(7, 7, 7);
        }
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      animateModel?.(loadedModel);
      animateModel2?.(loadedModel2);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.clear();
    };
  }, [animateModel, modelPath, scale, setupLights, includeTorus]);

  return (
    <canvas ref={canvasRef} className={`scene-canvas ${className}`.trim()} />
  );
}
