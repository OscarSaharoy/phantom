// Oscar Saharoy 2023

export default `

precision mediump float;
uniform sampler2D oldOriginalTexture; 
uniform sampler2D oldDepthTexture; 
uniform sampler2D originalTexture; 
uniform sampler2D depthTexture; 
uniform vec2 uMouse;
uniform float uOldDepthScale; 
uniform float uDepthScale; 
uniform float uTransitionTime; 

varying vec2 vUv;

vec2 mirrored(vec2 v) {
	vec2 m = mod(v,2.);
	return mix(m,2.0 - m, step(1.0 ,m));
}

void main() {
	
	float transition = pow(1. - exp( -4. * uTransitionTime * uTransitionTime ), 3.);
	float crazy = 5. / ( 1. + exp( 6. * pow(uTransitionTime - 1., 2.) ) );
	float crazyout = exp( uTransitionTime / 2. );
	float crazyin = exp( 1. - uTransitionTime / 2. );
	vec2 mouse = mix( uMouse, vec2(1), crazy );

	vec4 depthMap = uDepthScale * texture2D(depthTexture, mirrored(vUv)) + crazyin;
	vec4 oldDepthMap = uOldDepthScale * texture2D(oldDepthTexture, mirrored(vUv)) - crazyout;

	vec2 fake3d = vec2(vUv.x + (depthMap.r - 0.5) * mouse.x, vUv.y + (depthMap.r - 0.5) * mouse.y );
	vec2 oldFake3d = vec2(vUv.x + (oldDepthMap.r - 0.5) * mouse.x, vUv.y + (oldDepthMap.r - 0.5) * mouse.y );

	vec4 newLight = texture2D(originalTexture,mirrored(fake3d));
	vec4 oldLight = texture2D(oldOriginalTexture,mirrored(oldFake3d));

	vec4 light = mix( oldLight, newLight, transition );

	gl_FragColor = light;
}

`;
