import _ from 'lodash';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

console.log('script');

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.shadowMap.type = THREE.BasicShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
 75,
 window.innerWidth/window.innerHeight,
 0.1,
 1000
);

const orbit  = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30)
orbit.update();


// add box geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box)


// add plane geometry
const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
 color: 0xFFFFFF,
 side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
// plane receives shadow


// grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// add sphere geometry
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
 color:0x0000FF
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true;
scene.add(sphere)

sphere.position.set(-10, 10, 10)
// sphere cast shadow



// add lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// directional light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
directionalLight.castShadow = true;
scene.add(directionalLight)
directionalLight.position.set(-30, 50, 0)

// adjust shodow camera display
directionalLight.shadow.camera.bottom = -12

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper)


const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dLightShadowHelper);

// spotlight lighting
// const  spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true;

// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper)

const gui = new dat.GUI()

const options = {
 sphereColor: '#ffea00',
 wireframe: false,
 speed:0.01
}

gui.addColor(options, 'sphereColor').onChange(function(e){
 sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange(function(e){
 sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1)


let step = 0;
// let speed = 0.01;

function animate(time){
 box.rotation.x += time / 1000000; //time/100
 box.rotation.y += time / 1000000; //time/100

 step += options.speed;
 sphere.position.y = 10 * Math.abs(Math.abs(Math.sin(step)))

 renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);



// function component(){
//  const element = document.createElement('div');
//  element.innerHTML = _.join(['Hello', 'webpack'], '');
//  return element;
// }

// document.body.appendChild(component());