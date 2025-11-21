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
  includeTorus?: boolean;
};

export default function SceneCanvas({
  modelPath,
  className = "",
  scale = 1,
  setupLights,
  animateModel,
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

    const baseLight = new THREE.PointLight(0xffffff, 1.5);
    baseLight.position.set(10, 20, 0);
    scene.add(baseLight);

    setupLights?.(scene);

    let torus: THREE.Mesh | null = null;
    if (includeTorus) {
      const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0xfc9803,
        wireframe: true,
      });
      const torusGeometry = new THREE.TorusGeometry(15.4, 3, 9, 100);
      torus = new THREE.Mesh(torusGeometry, torusMaterial);
      torus.position.set(0, 0, 0);
      scene.add(torus);
    }

    const loader = new GLTFLoader();
    let loadedModel: THREE.Object3D | null = null;

    loader.load(
      modelPath,
      (gltf) => {
        scene.add(gltf.scene);
        loadedModel = gltf.scene.children[0] ?? gltf.scene;
        if (loadedModel) {
          loadedModel.scale.setScalar(scale);
          loadedModel.position.set(0, 0, 0);
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
      if (torus) {
        torus.rotation.y += 0.01;
      }
      animateModel?.(loadedModel);
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
    <canvas
      ref={canvasRef}
      className={`scene-canvas ${className}`.trim()}
    />
  );
}

