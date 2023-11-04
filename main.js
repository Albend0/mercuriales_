import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.update();

const controls1 = new FlyControls(camera, renderer.domElement);
controls1.domElement = renderer.domElement;
controls1.movementSpeed = 100;
controls1.rollSpeed = Math.PI / 24;
controls1.autoForward = false;
controls1.dragToLook = true;

camera.position.set(0.03, 3.18, 7.00);
camera.rotation.set(0.08, 0, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const loader = new GLTFLoader().setPath('public/');
loader.load('mercuriales.gltf', (gltf) => {
    const mesh = gltf.scene;

    mesh.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    mesh.position.set(0, 0, 0);
    mesh.scale.set(0.04, 0.04, 0.04);
    scene.add(mesh);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const cameraCoordinatesElement = document.getElementById('camera-coordinates');
const cameraRotationElement = document.getElementById('camera-rotation');

function animate() {
    requestAnimationFrame(animate);
    controls1.update(0.001);
    renderer.render(scene, camera);
}

animate();

