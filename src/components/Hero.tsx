import { useCallback } from "react";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";
import "./Hero.css";

export default function Hero() {
  const rotateHeroModel = useCallback((model: THREE.Object3D | null) => {
    if (!model) {
      return;
    }
    model.rotation.y += 0.01;
    model.rotation.x += 0.01;
    model.rotation.z += 0.01;
  }, []);

  const rotateWireframeModel = useCallback((model: THREE.Object3D | null) => {
    if (!model) {
      return;
    }
    model.rotation.z -= 0.01;
  }, []);

  const addHeroLights = useCallback((scene: THREE.Scene) => {
    const rectLight = new THREE.RectAreaLight(0xffffff, 12, 32, 18);
    rectLight.position.set(0, -13, 0);
    rectLight.lookAt(0, 0, 0);
    const rectLight2 = new THREE.RectAreaLight(0xffffff, 14, 32, 18);
    rectLight2.position.set(0, 13, 0);
    rectLight2.lookAt(0, 0, 0);
    scene.add(rectLight, rectLight2);
  }, []);

  const addWireframeLights = useCallback((scene: THREE.Scene) => {
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(15, 5, 5);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    ambientLight.position.set(15, 5, 5);
    scene.add(pointLight, ambientLight);
  }, []);

  return (
    <section className="hero" id="AboutMe_">
      <div className="canvas-stack">
        <div className="canvas-container canvas-container1">
          <SceneCanvas
            modelPath="/Car/scene.gltf"
            scale={5}
            includeTorus
            setupLights={addHeroLights}
            animateModel={rotateHeroModel}
          />
        </div>
        <div className="canvas-container canvas-container2">
          <SceneCanvas
            modelPath="/WireFrame/WireFrameFace_Omar.gltf"
            scale={2}
            setupLights={addWireframeLights}
            animateModel={rotateWireframeModel}
          />
        </div>
      </div>
        <div className="hero-copy">
          <p className="hero-kicker">3D Artist / Data Scientist / Developer</p>
          <h1>Charles Wilson</h1>
          <p className="hero-subcopy">
            If I had a single talent, it wouldn't be fun—so I create, analyze,
            and build experiences that make the world feel a little more human.
          </p>
        <div className="hero-links">
          <a className="hero-link" href="#Contact_">
            Let's connect
          </a>
          <a className="hero-link" href="mailto:Charles.ikwilson@gmail.com">
            Email Charles
          </a>
        </div>
      </div>
    </section>
  );
}
