import _ from 'lodash';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

console.log('script');

const renderer = new THREE.WebGLRenderer();

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

camera.position.set(0, 2, 5)
orbit.update();


// add box geometry
const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box)



function animate(){
 box.rotation.x += 5; //time/100
 box.rotation.y += 5; //time/100
 renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate);



// function component(){
//  const element = document.createElement('div');
//  element.innerHTML = _.join(['Hello', 'webpack'], '');
//  return element;
// }

// document.body.appendChild(component());