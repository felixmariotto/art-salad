
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//

const gltfLoader = new GLTFLoader();

onmessage = function( e ) {

	const url = e.data.url;

	gltfLoader.load( url, 

		function ( gltf ) {

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
const vec3B = new THREE.Vector3();

const STANDARD_PUZZLE_SIZE = 0.5;
const STANDARD_PUZZLE_POSITION = new THREE.Vector3( 0, 1, -1 );

function parseGeometry( imported ) {

	const group = new THREE.Group();

	// firstly we take all the meshes from the imported model, and place them in a new global Group.

	const toAdd = [];
	let texture;

	imported.traverse( obj => {

		if ( obj.geometry ) {

			obj.updateWorldMatrix( true, false );
			obj.geometry.applyMatrix4( obj.matrixWorld )

			toAdd.push( obj )

		}

		if ( obj.material ) texture = obj.material.map;

	} );

	group.add( ...toAdd );

	// then we compute the bounding box center point, and move the geometry to the center of the object.

	const bbox = new THREE.Box3();
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

	const bboxS = bbox.getSize( vec3A );
	const average = ( bboxS.x + bboxS.y + bboxS.z ) / 3;
	const scaleFactor = STANDARD_PUZZLE_SIZE / average;

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

