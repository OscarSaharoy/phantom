// Oscar Saharoy 2023

import * as THREE from "./three.module.js";
import fragShader from "../glsl/frag.glsl.js";
import vertShader from "../glsl/vert.glsl.js";


let stateIndex = 0;
const states = [
	{
		imagePath: "./imgs/phantom.png",
		depthMapPath: "./imgs/phantom-depth.png",
		title: "Oscar's Journey - an AI story.",
		description: "Please use the arrows to navigate, and tap/click and drag to look around the images!",
		depthScale: 1,
	},
	{
		imagePath: "./imgs/workinghard.png",
		depthMapPath: "./imgs/workinghard-depth.png",
		title: "The Grind",
		description: "Oscar works hard on his project - can he get it done?",
		depthScale: 2,
	},
	{
		imagePath: "./imgs/submitting.png",
		depthMapPath: "./imgs/submitting-depth.png",
		title: "Submission",
		description: "Oscar completed the task! He submits it with a smile.",
		depthScale: 2,
	},
	{
		imagePath: "./imgs/recieving2.png",
		depthMapPath: "./imgs/recieving2-depth.png",
		title: "First Impression at Phantom HQ",
		description: "\"Now just what the hell is this, Doris?\"",
		depthScale: 2,
	},
	{
		imagePath: "./imgs/convincing.png",
		depthMapPath: "./imgs/convincing-depth.png",
		title: "Doris Tries to win Jim Over",
		description: "\"I know his project turned out weird, but just give him a chance, Jim!\"",
		depthScale: 2,
	},
	{
		imagePath: "./imgs/thinking.png",
		depthMapPath: "./imgs/thinking-depth.png",
		title: "Jim's Contemplation",
		description: "\"That kid Oscar has some funky ideas... we could use that.\"",
		depthScale: 2,
	},
	{
		imagePath: "./imgs/phonecall.png",
		depthMapPath: "./imgs/phonecall-depth.png",
		title: "The Phone Call",
		description: "\"Oscar, you got the job!\" Oscar is over the moon.",
		depthScale: 3,
	},
	{
		imagePath: "./imgs/celebration.png",
		depthMapPath: "./imgs/celebration-depth.png",
		title: "The Rave",
		description: "Time to hit the disco to celebrate.",
		depthScale: 4,
	},
	{
		imagePath: "./imgs/lunch.png",
		depthMapPath: "./imgs/lunch-depth.png",
		title: "Lunch with the Team",
		description: "The first lunch with the whole team is amazing. Oscar manages to look past the facial deformities and has a great time.",
		depthScale: 4,
	},
	{
		imagePath: "./imgs/besttocome.png",
		depthMapPath: "./imgs/besttocome-depth.png",
		title: "The Future",
		description: "The possibilities for the things the team will build together are limitless; the best is still to come!",
		depthScale: 6,
	},
];



const canvas   = document.querySelector('canvas');
const scene    = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
const textureLoader = new THREE.TextureLoader();

const title = document.getElementById( "title" );
const description = document.getElementById( "description" );
const leftArrow = document.getElementById( "left" );
const rightArrow = document.getElementById( "right" );


const camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 2 );
camera.position.z = 1;
scene.add( camera );


const planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
const planeMaterial = new THREE.ShaderMaterial({
	uniforms: {
		oldOriginalTexture: { value: null },
		oldDepthTexture: { value: null },
		originalTexture: { value: null },
		depthTexture: { value: null },
		uMouse: { value: new THREE.Vector2(0, 0) },
		uDepthScale: { value: 1 },
		uOldDepthScale: { value: 1 },
		uTransitionTime: { value: 0 },
	},
	fragmentShader: fragShader,
	vertexShader: vertShader
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add( plane );


function loadImages( state ) {

	state.image = textureLoader.load( state.imagePath );
	state.depthMap = textureLoader.load( state.depthMapPath );
}

states.forEach( loadImages );


function setState( state ) {

	planeMaterial.uniforms.oldOriginalTexture.value = planeMaterial.uniforms.originalTexture.value;
	planeMaterial.uniforms.oldDepthTexture.value = planeMaterial.uniforms.depthTexture.value;
	planeMaterial.uniforms.uOldDepthScale.value = planeMaterial.uniforms.uDepthScale.value;

	planeMaterial.uniforms.originalTexture.value = state.image;
	planeMaterial.uniforms.depthTexture.value = state.depthMap;
	planeMaterial.uniforms.uDepthScale.value = state.depthScale;

	planeMaterial.uniforms.uTransitionTime.value =
		planeMaterial.uniforms.uTransitionTime.value > 2 ? 0 :
		planeMaterial.uniforms.uTransitionTime.value;

	console.log(planeMaterial.uniforms);

	title.textContent = state.title;
	description.textContent = state.description;

	leftArrow.style.visibility  = stateIndex == 0 ? "hidden" : "visible";
	rightArrow.style.visibility = stateIndex == states.length - 1 ? "hidden" : "visible";
}

setState( states[stateIndex] );

leftArrow.onclick  = () => setState( states[--stateIndex] );
rightArrow.onclick = () => setState( states[++stateIndex] );




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

