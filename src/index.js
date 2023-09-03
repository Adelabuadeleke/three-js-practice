import _ from 'lodash';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui'

import star from '../src/img/nebula.jpg'
import nebula from '../src/img/star.jpg'

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
// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
// directionalLight.castShadow = true;
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)

// // adjust shodow camera display
// directionalLight.shadow.camera.bottom = -12

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper)


// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper);

// spotlight lighting
const  spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper)

// fog
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200)
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01)

// setting clear bg
// renderer.setClearColor(0xFFEA00)
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(nebula);
// const CubeTextureLoader = new THREE.CubeTextureLoader()
// scene.background = CubeTextureLoader.load([
//  nebula, 
//  nebula,
//  nebula, 
//  nebula,
//  nebula, 
//  nebula,

// ]);

// box 2
const box2Geometry = new THREE.BoxGeometry(4,4,4);

const box2Material = new THREE.MeshBasicMaterial({
 // color: 0x00FF00
 // map:textureLoader.load(nebula)
});
const boxMultiMaterial = [
 new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
 new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
 new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
 new THREE.MeshBasicMaterial({map: textureLoader.load(star)}),
 new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
 new THREE.MeshBasicMaterial({map: textureLoader.load(star)})

]

const box2 = new THREE.Mesh(box2Geometry, boxMultiMaterial);
scene.add(box2)
box2.position.set(0, 15, 10)
box2.material.map = textureLoader.load(nebula)

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color:0xFFFFFF,
  wireframe: true
});

const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);




const gui = new dat.GUI()

const options = {
 sphereColor: '#ffea00',
 wireframe: false,
 speed:0.01,
 angle:0.2,
 penumbra: 0,
 intensity: 1
}

gui.addColor(options, 'sphereColor').onChange(function(e){
 sphere.material.color.set(e)
})

gui.add(options, 'wireframe').onChange(function(e){
 sphere.material.wireframe = e;
})

gui.add(options, 'speed', 0, 0.1)

gui.add(options, 'angle', 0, 1)
gui.add(options, 'penumbra', 0, 1)
gui.add(options, 'intensity', 0, 1)


let step = 0;
// let speed = 0.01;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove', function(e){
 mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1; 
 mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1; 
})

const raycaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = 'theBox';

  

function animate(time){
  const lastPointZ = plane2.geometry.attributes.position.array.length - 1;

 box.rotation.x += time / 1000000; //time/100
 box.rotation.y += time / 1000000; //time/100

 step += options.speed;
 sphere.position.y = 10 * Math.abs(Math.abs(Math.sin(step)))

 spotLight.angle = options.angle;
 spotLight.penumbra = options.penumbra;
 spotLight.intensity = options.intensity;
 sLightHelper.update()

 raycaster.setFromCamera(mousePosition, camera);
 const intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects)
 for(let i = 0; i < intersects.length; i++){
  if(intersects[i].object.id === sphereId)
   intersects[i].object.material.color.set(0xFF0000)

  if(intersects[i].object.name === 'theBox'){
    intersects[i].object.x += time / 1000; //time/100
    intersects[i].object.y += time / 1000; //time/100
  }
 }

  //  changing waves animation
  plane2.geometry.attributes.position.array[0] = 10 * Math.random()
  plane2.geometry.attributes.position.array[1] = 10 * Math.random()
  plane2.geometry.attributes.position.array[2] = 10 * Math.random()
  plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random()
  plane2.geometry.attributes.position.needsUpdate = true;

 renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);



// function component(){
//  const element = document.createElement('div');
//  element.innerHTML = _.join(['Hello', 'webpack'], '');
//  return element;
// }

// document.body.appendChild(component());