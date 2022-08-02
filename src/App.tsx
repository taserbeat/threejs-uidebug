import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

import "./App.css";

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

/**
 * UIデバッグ
 */
const gui = new GUI();

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(1, 1, 2);

// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ジオメトリを作ってみよう。
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

// マテリアル
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "red",
});

// メッシュ化
const boxMesh = new THREE.Mesh(boxGeometry, basicMaterial);
scene.add(boxMesh);

// デバッグ
// gui.add(boxMesh.position, "x", -3, 3, 0.01);
gui
  .add(boxMesh.position, "x", -3, 3, 0.01)
  .min(-3)
  .max(3)
  .step(0.01)
  .name("transformX");

gui
  .add(boxMesh.position, "y", -3, 3, 0.01)
  .min(-3)
  .max(3)
  .step(0.01)
  .name("transformY");

gui
  .add(boxMesh.position, "z", -3, 3, 0.01)
  .min(-3)
  .max(3)
  .step(0.01)
  .name("transformZ");

gui.add(boxMesh.rotation, "x", -3, 3, 0.01).name("rotationX");

gui.add(boxMesh, "visible");
gui.add(basicMaterial, "wireframe");

gui.addColor(basicMaterial, "color");

// ライト
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// マウス操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

const App = () => {
  const divRef = useRef<HTMLDivElement>(null);

  /** ブラウザのリサイズ時の処理 */
  const handleOnBrowserResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    return;
  };

  useEffect(() => {
    window.addEventListener("resize", handleOnBrowserResize);

    divRef.current?.appendChild(renderer.domElement);

    const updateRender = () => {
      controls.update();

      // レンダリング
      renderer.render(scene, camera);
      requestAnimationFrame(updateRender);
    };

    updateRender();

    return () => {
      divRef.current?.removeChild(renderer.domElement);
      removeEventListener("resize", handleOnBrowserResize);
    };
  }, []);

  return (
    <div className="App">
      <div className="scene" ref={divRef}></div>
    </div>
  );
};

export default App;
