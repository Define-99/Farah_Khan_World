import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('threeCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(2, 1.5, 3);
camera.lookAt(0, 0, 0);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Env map
const envLoader = new THREE.CubeTextureLoader();
const envMap = envLoader.load([
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/posx.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/negx.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/posy.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/negy.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/posz.jpg',
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/cube/Bridge2/negz.jpg'
]);
scene.environment = envMap;

let model = null;

const loader = new GLTFLoader();
loader.load(
  './glb/diamond.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    scene.add(model);
  },
  (xhr) => {
    console.log(`Loading model: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error('An error happened loading the model:', error);
  }
);

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
