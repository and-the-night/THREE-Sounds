import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js";

import getStarfield from "./getStarfield.js";

// import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.y = 2;

// Get Phone Orientation
if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", function (event) {
    const alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0;
    const beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
    const gamma = event.gamma ? THREE.MathUtils.degToRad(event.gamma) : 0;

    camera.rotation.set(beta, alpha, 0);

    document.getElementById("alpha").innerHTML = alpha;
    document.getElementById("beta").innerHTML = beta;
    document.getElementById("gamma").innerHTML = gamma;
  });
} else {
  console.log("DeviceOrientationEvent is not supported");
}

if (window.DeviceMotionEvent) {
  window.addEventListener("devicemotion", function (event) {
    const acceleration = event.accelerationIncludingGravity;
    if (acceleration) {
      camera.position.x += acceleration.x * 0.01;
      camera.position.y += acceleration.y * 0.01;
      camera.position.z += acceleration.z * 0.01;

      document.getElementById("accX").innerHTML = acceleration.x;
      document.getElementById("accY").innerHTML = acceleration.y;
      document.getElementById("accZ").innerHTML = acceleration.z;
    }
  });
} else {
  console.log("DeviceMotionEvent is not supported");
}

// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.lookSpeed = 0.01;
// controls.movementSpeed = 5;
// controls.noFly = true;
// controls.lookVertical = false;

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

scene.add(camera);

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create the PositionalAudio object (passing in the listener)
const sound = new THREE.PositionalAudio(listener);

// load a sound and set it as the PositionalAudio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("Club_Butterfly-BASS.wav", function (buffer) {
  sound.setBuffer(buffer);
  sound.setRefDistance(20);
  sound.play();
  sound.setLoop(true);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(50, 0, 50);
scene.add(cube);

cube.add(sound);

const sound2 = new THREE.PositionalAudio(listener);

const audioLoader2 = new THREE.AudioLoader();
audioLoader2.load("Club_Butterfly-HH.wav", function (buffer) {
  sound2.setBuffer(buffer);
  sound2.setRefDistance(20);
  sound2.play();
  sound2.setLoop(true);
});

const geometry2 = new THREE.BoxGeometry();
const material2 = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube2 = new THREE.Mesh(geometry2, material2);
cube2.position.set(-50, 0, -50);
scene.add(cube2);

cube.add(sound2);

for (let i = 0; i < 30; i++) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({
    color: Math.random() * 0xffffff,
  });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(
    Math.random() * 50 - 25,
    Math.random() * 5,
    Math.random() * 50 - 25
  );

  scene.add(cube);
}

const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // camera.rotation.y += 0.01;
  // controls.update(0.1); // update controls

  // cube.position.z += 0.01;
}

animate();
