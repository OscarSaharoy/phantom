// Oscar Saharoy 2023

import * as THREE from "./three.module.js";
import fragShader from "../glsl/frag.glsl.js";
import vertShader from "../glsl/vert.glsl.js";



// Main Settings
const settings = {
  originalImagePath: './imgs/dog-photo.jpg',
  depthImagePath: './imgs/dog-depth-map.webp',
}

// Image Details
let originalImage = null
let depthImage = null

const images = [];
const depthMaps = [];
let imageIndex = 0;


const canvas   = document.querySelector('canvas');
const scene    = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ canvas: canvas })


const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 2 );
camera.position.z = 1;
scene.add( camera );


const planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
const planeMaterial = new THREE.ShaderMaterial({
	uniforms: {
		originalTexture: { value: originalImage },
		depthTexture: { value: depthImage },
		uMouse: { value: new THREE.Vector2(0, 0) },
		uTransitionTime: { value: 0 },
	},
	fragmentShader: fragShader,
	vertexShader: vertShader
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add( plane );


const textureLoader = new THREE.TextureLoader();

const loadImages = () => {

	if(originalImage !== null || depthImage !== null)
	{
		originalImage.dispose()
		depthImage.dispose()
	}
	depthImage = textureLoader.load(settings.depthImagePath)

	originalImage = textureLoader.load( settings.originalImagePath, function ( tex ) {

		planeMaterial.uniforms.originalTexture.value = originalImage;
		planeMaterial.uniforms.depthTexture.value = depthImage;
	} );
	
}
loadImages()



function resizeRendererToDisplaySize( renderer ) {

    const width  = canvas.clientWidth;
    const height = canvas.clientHeight;
	const dpr    = window.devicePixelRatio || 1;

    renderer.setSize( width*dpr, height*dpr, false );
}

new ResizeObserver( () => resizeRendererToDisplaySize(renderer) ).observe( canvas );



const cursor = {
  x: 0,
  y: 0,
  lerpX: 0,
  lerpY: 0,
};

window.addEventListener('pointermove', event => {
	cursor.x = (event.clientX - window.innerWidth /2) / canvas.clientWidth;
	cursor.y = (event.clientY - window.innerHeight/2) / canvas.clientHeight;
});

window.addEventListener('pointerout', event => {
	cursor.x = 0;
	cursor.y = 0;
});



( function renderloop( millis, oldMillis ) {

	window.requestAnimationFrame( newMillis => renderloop(newMillis, millis) );

	const deltaTime = ( millis - oldMillis ) / 1000;
	const parallaxX = Math.tanh( cursor.x*3) * 0.02;
	const parallaxY = Math.tanh(-cursor.y*3) * 0.02;
	cursor.lerpX += ( parallaxX - cursor.lerpX ) * 5 * deltaTime;
	cursor.lerpY += ( parallaxY - cursor.lerpY ) * 5 * deltaTime;

	planeMaterial.uniforms.uMouse.value = new THREE.Vector2( cursor.lerpX, cursor.lerpY );
	planeMaterial.uniforms.uTransitionTime.value += deltaTime;

	renderer.render( scene, camera );

} )(0, 0);

