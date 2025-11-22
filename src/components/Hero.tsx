import { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import SceneCanvas from "./SceneCanvas";
import "./Hero.css";

export default function Hero() {
  const [nameText, setNameText] = useState("Charles Wilson");

  useEffect(() => {
    const interval = setInterval(() => {
      setNameText((prev) =>
        prev === "Charles Wilson" ? "Q.Wrld" : "Charles Wilson"
      );
    }, 8000); // Switch every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const rotateHeroModel = useCallback((model: THREE.Object3D | null) => {
    if (!model) {
      return;
    }
    model.rotation.y += 0.01;
    model.rotation.x += 0.01;
    model.rotation.z += 0.01;
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

  return (
    <section className="hero" id="AboutMe_">
      <div className="canvas-stack">
        <div className="canvas-container canvas-container1">
          <SceneCanvas
            modelPath="https://drive.google.com/file/d/125oRKxusOcHH7wZjMPeU8EfmgNy0c2pX/view?usp=drive_link"
            scale={5}
            includeTorus
            setupLights={addHeroLights}
            animateModel={rotateHeroModel}
          />
        </div>
      </div>
      <div className="hero-copy">
        <p className="hero-kicker">3D Artist / Data Scientist / Developer</p>
        <h1 className="animated-name">{nameText}</h1>
        <p className="hero-subcopy">
          If I had a single talent, it wouldn't be fun—so I create, analyze, and
          build experiences that make the world feel a little more human.
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
