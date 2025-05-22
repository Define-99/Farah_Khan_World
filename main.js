import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('threeCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2, 1.5, 3);
camera.lookAt(0, 0, 0);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const dirLight = new THREE.DirectionalLight(0xffffff, 4);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Environment map
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
let idleRotation = 0;
let scrollAngle = 0;
let scrollOffsetCaptured = false;
let scrollOffset = 0;

// Load diamond
const loader = new GLTFLoader();
loader.load('./glb/diamond.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(0.5, 0.5, 0.5);
  scene.add(model);
});

// Receive scroll progress from Shopify
window.addEventListener('message', (event) => {
  if (event.data?.type === 'scrollProgress') {
    const progress = event.data.value;

    if (!scrollOffsetCaptured) {
      scrollOffset = idleRotation;
      scrollOffsetCaptured = true;
    }

    scrollAngle = progress * Math.PI * 2 + scrollOffset;
  }
});

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    idleRotation += 0.002;
    model.rotation.y = scrollAngle + idleRotation;
  }

  renderer.render(scene, camera);
}
animate();

// Responsive canvas
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
