// Oscar Saharoy 2023

export default `

precision mediump float;
uniform sampler2D originalTexture; 
uniform sampler2D depthTexture; 
uniform vec2 uMouse;
uniform vec2 uThreshold;

varying vec2 vUv;


vec2 mirrored(vec2 v) {
	vec2 m = mod(v,2.);
	return mix(m,2.0 - m, step(1.0 ,m));
}

void main() {
	vec4 depthMap = texture2D(depthTexture, mirrored(vUv));
	vec2 fake3d = vec2(vUv.x + (depthMap.r - 0.5) * uMouse.x / uThreshold.x, vUv.y + (depthMap.r - 0.5) * uMouse.y / uThreshold.y);

	gl_FragColor = texture2D(originalTexture,mirrored(fake3d));
}

`;
