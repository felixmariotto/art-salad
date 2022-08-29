
/*
This web worker is used to load and parse models out of the main thread,
to avoid rendering stutters which are really anoying in VR.
*/

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//

const gltfLoader = new GLTFLoader();

onmessage = function( e ) {

	const url = e.data.url;

	gltfLoader.load( url, 

		function ( gltf ) {

			// Messaging whole array buffers to the main thread would be very slow, instead we use transferable objects.
			// https://developer.chrome.com/blog/transferable-objects-lightning-fast/

			const [ geometries, arrayBuffers, texture, textureData ] = parseGeometry( gltf.scene );

			postMessage( { geometries, texture }, arrayBuffers, textureData );

		},

		// called while loading is progressing
		function ( xhr ) {

			postMessage( { isInProgress: true } )

		},

		// called when loading has errors
		function ( error ) {

			postMessage( { error } );

		}

	);

}

// get the gltf scene and return a merged geometry with groups

const vec3A = new THREE.Vector3();

// In meters. Length of the digonal of the model once resized.
// 1 meter is good because most people can move their hands one meter appart.
const STANDARD_PUZZLE_SIZE = 1;

function parseGeometry( imported ) {

	const group = new THREE.Group();

	// firstly we take all the meshes from the imported model, and place them in a new global Group.

	const toAdd = [];
	let texture;

	imported.traverse( obj => {

		if ( obj.geometry ) {

			obj.updateWorldMatrix( true, true );
			obj.geometry.applyMatrix4( obj.matrixWorld );

			const mesh = new THREE.Mesh(
				obj.geometry,
				obj.material
			)

			toAdd.push( mesh )

		}

		if ( obj.material ) texture = obj.material.map;

	} );

	group.add( ...toAdd );

	// then we compute the bounding box center point, and move the geometry to the center of the object.

	const bbox = new THREE.Box3();
	group.updateWorldMatrix( true );
	bbox.setFromObject( group, true );
	const translation = bbox.getCenter( vec3A ).negate();

	group.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.translate(
				translation.x,
				translation.y,
				translation.z
			)
		}

	} );

	// then we scale the geometry to a standard scale so that the user can grab all parts with their hands.

	const diagonalDist = bbox.min.distanceTo( bbox.max );
	const scaleFactor = STANDARD_PUZZLE_SIZE / diagonalDist;

	group.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.scale(
				scaleFactor,
				scaleFactor,
				scaleFactor
			)
		}

	} );

	// prepare a nice arrays to send to main thread

	const geometries = group.children.map( child => child.geometry );

	const arrayBuffers = [];

	geometries.forEach( geometry => {

		for ( const attributeName of Object.keys( geometry.attributes ) ) {

			arrayBuffers.push( geometry.attributes[ attributeName ].array.buffer )

		}

		if ( geometries.index ) {

			arrayBuffers.push( geometries.index );

		}

	} );

	// prepare texture for transfer

	const textureData = texture.source.data;

	//

	return [ geometries, arrayBuffers, texture, textureData ]

}
