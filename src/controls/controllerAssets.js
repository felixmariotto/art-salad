
/*
Here we create from scratch de 3D assets needed for the controllers :
- a straight line (actually a thin box) to show the player in which direction they are pointing.
- a white point (a sprite) to show were the selection line interacts with world objects
- the spheres representing player's hands.
*/

import * as THREE from 'three';

// RAY BOX

const material = new THREE.MeshBasicMaterial( {
	color: new THREE.Color("grey"),
	alphaMap: new THREE.CanvasTexture( generateRayTexture() ),
	transparent: true
} );

const geometry = new THREE.BoxBufferGeometry( 0.004, 0.004, 0.5 );

geometry.translate( 0, 0, -0.15 );

// we are going to map a gradient texture on this thin box, so it looks like it fades away
// in the distance. We need a particular UV mapping for this, se we manually set UVs bellow.

const uvAttribute = geometry.attributes.uv;

for ( let i = 0; i < uvAttribute.count; i++ ) {

	let u = uvAttribute.getX( i );
	let v = uvAttribute.getY( i );

	[ u, v ] = ( () => {

		switch ( i ) {

			case 0 :
				return [ 1, 1 ];
			case 1 :
				return [ 0, 0 ];
			case 2 :
				return [ 1, 1 ];
			case 3 :
				return [ 0, 0 ];
			case 4 :
				return [ 0, 0 ];
			case 5 :
				return [ 1, 1 ];
			case 6 :
				return [ 0, 0 ];
			case 7 :
				return [ 1, 1 ];
			case 8 :
				return [ 0, 0 ];
			case 9 :
				return [ 0, 0 ];
			case 10 :
				return [ 1, 1 ];
			case 11 :
				return [ 1, 1 ];
			case 12 :
				return [ 1, 1 ];
			case 13 :
				return [ 1, 1 ];
			case 14 :
				return [ 0, 0 ];
			case 15 :
				return [ 0, 0 ];
			default :
				return [ 0, 0 ];

		}

	} )();

	uvAttribute.setXY( i, u, v );

}

const linesHelper = new THREE.Mesh( geometry, material );
linesHelper.renderOrder = Infinity;

// POINT SPRITE

const spriteMaterial = new THREE.SpriteMaterial( {
	map: new THREE.CanvasTexture( generatePointerTexture() ),
	sizeAttenuation: false,
	depthTest: false
} );

const pointer = new THREE.Sprite( spriteMaterial );

pointer.scale.set( 0.015, 0.015, 1 );
pointer.renderOrder = Infinity;

// CANVAS TEXTURE GENERATION

// Instead of loading the basic texture we need for the ray, we create it with canvas API.

function generateRayTexture() {

	const canvas = document.createElement( 'canvas' );
	canvas.width = 64;
	canvas.height = 64;

	const ctx = canvas.getContext( '2d' );

	const gradient = ctx.createLinearGradient( 0, 0, 64, 0 );
	gradient.addColorStop( 0, 'black' );
	gradient.addColorStop( 1, 'white' );

	ctx.fillStyle = gradient;
	ctx.fillRect( 0, 0, 64, 64 );

	return canvas;

}

// Generate the texture of the point helper sprite

function generatePointerTexture() {

	const canvas = document.createElement( 'canvas' );
	canvas.width = 64;
	canvas.height = 64;

	const ctx = canvas.getContext( '2d' );

	ctx.beginPath();
	ctx.arc( 32, 32, 29, 0, 2 * Math.PI );
	ctx.lineWidth = 5;
	ctx.stroke();
	ctx.fillStyle = 'white';
	ctx.fill();

	return canvas;

}

// HAND

// The material is just a fresnel shader, which makes all but the edge of the sphere transparent.
// This way players can clearly see the piece when they grab them.

const vertexShader = `
	varying vec3 vPositionW;
	varying vec3 vNormalW;

	void main() {
		vPositionW = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ).xyz );
		vNormalW = normalize( normalMatrix * normal );
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`;

const fragmentShader = `
	varying vec3 vPositionW;
	varying vec3 vNormalW;

	uniform float alpha;

	void main() {   
		float fresnelTerm = ( 1.0 - - min( dot( vPositionW, normalize( vNormalW ) ), 0.0 ) );    
		gl_FragColor = vec4( vec3( .7 ), 1.0 * alpha ) * vec4( fresnelTerm );
	}
`;

// When the user grabs a piece we tweak this value, so the piece is even more apparent and the
// hand mesh even less "in the way".

const uniforms = {
	alpha: { value: 1.0 }
}

const handMaterial = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	transparent: true
});

function Hand( radius ) {

	const geometry = new THREE.IcosahedronGeometry( radius, 5 );

	const mesh = new THREE.Mesh( geometry, handMaterial );

	mesh.isHand = true;

	return mesh

}

//

export default {
	linesHelper,
	pointer,
	Hand
}
