
import * as THREE from 'three';

//

//////////////////
// Lines helpers
//////////////////

const material = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	alphaMap: new THREE.CanvasTexture( generateRayTexture() ),
	transparent: true
} );

const geometry = new THREE.BoxBufferGeometry( 0.004, 0.004, 0.5 );

geometry.translate( 0, 0, -0.15 );

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

/////////////////
// Point helper
/////////////////

const spriteMaterial = new THREE.SpriteMaterial( {
	map: new THREE.CanvasTexture( generatePointerTexture() ),
	sizeAttenuation: false,
	depthTest: false
} );

const pointer = new THREE.Sprite( spriteMaterial );

pointer.scale.set( 0.015, 0.015, 1 );
pointer.renderOrder = Infinity;

//////////////////////////////
// CANVAS TEXTURE GENERATION
//////////////////////////////

// Generate the texture needed to make the intersection ray fade away

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

//

export default {
	linesHelper,
	pointer
}
