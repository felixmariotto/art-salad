
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import doubleHeadSculpt from '../assets/double-head-sculpt.glb';
import paintedTrash from '../assets/painted-trash.glb';
import mexicoGraffiti from '../assets/mexico-graffiti.glb';
import louviersCastel from '../assets/louviers-castel.glb';
import seatedCupid from '../assets/seated-cupid.glb';
import hydriaVase from '../assets/hydria-vase.glb';

import museum from '../assets/museum.glb';

//

let worker, onFileReady;

const gltfLoader = new GLTFLoader();
const objectLoader = new THREE.ObjectLoader();

const modelURLs = {
	museum,
	doubleHeadSculpt,
	paintedTrash,
	mexicoGraffiti,
	louviersCastel,
	seatedCupid,
	hydriaVase
}

if ( typeof Worker !== 'undefined' ) {

	worker = new Worker( new URL('workers/worker.js', import.meta.url ) );

	worker.onmessage = function( e ) {

		const geometries = e.data.geometries;
		const texture = e.data.texture;
		const error = e.data.error;
		const isInProgress = e.data.isInProgress;

		if ( error ) console.log( error );

		if ( geometries ) {

			// create a new THREE.BufferGeometry from the shallow object sent by the worker

			geometries.forEach( ( shallowGeometry, i, array) => {

				const geometry = new THREE.BufferGeometry();
				geometry.isProcessed = true;

				if ( shallowGeometry.index ) {

					const index = new THREE.BufferAttribute(
						shallowGeometry.index.array,
						shallowGeometry.index.itemSize,
						false
					);

					geometry.setIndex( index );

				}

				for ( const attributeName of Object.keys( shallowGeometry.attributes ) ) {

					const shallowAttribute = shallowGeometry.attributes[ attributeName ];

					const attribute = new THREE.BufferAttribute(
						shallowAttribute.array,
						shallowAttribute.itemSize,
						false
					);

					geometry.setAttribute( attributeName, attribute );

				}

				array[i] = geometry;

			} );

			// recreate the material shared by all meshes of the puzzle

			const newTexture = new THREE.CanvasTexture(
				texture.source.data,
				texture.mapping,
				texture.wrapS,
				texture.wrapT,
				texture.magFilter,
				texture.minFilter,
				texture.format,
				texture.type,
				texture.anisotropy
			);

			console.log(  )

			const material = new THREE.MeshBasicMaterial( { map: newTexture } );

			// create meshes from the geometries

			const meshes = geometries.map( geometry => new THREE.Mesh( geometry, material ) );

			const group = new THREE.Group().add( ...meshes );

			//

			if ( onFileReady ) onFileReady( group );

		}

	}

}

const files = {
	getModel,
	getModelDirect
};

//

function getModel( modelName ) {

	return new Promise( (resolve, reject) => {

		const url = modelURLs[ modelName ];

		if ( !url ) reject( new Error('file url is not defined') )

		if ( worker ) {

			onFileReady = ( file ) => {

				resolve( file );

				onFileReady = undefined;

			}

			worker.postMessage( { url } );

		} else {

			reject( new Error('WebWorker not supported by this browser') );

		}
		/*
		else {

			gltfLoader.load( url, 

				function ( gltf ) {

					resolve(   gltf.scene );
    
				},
  
				// called while loading is progressing
				function ( xhr ) { 
   
					console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
				},
  
				// called when loading has err  ors
				function ( error  ) {
 
					reject( error )

				} 

			);

		}
		*/

	} );

}

// load a file without going through the webworker

function getModelDirect( modelName ) {

	return new Promise( (resolve, reject) => {

		const url = modelURLs[ modelName ];

		if ( !url ) reject( new Error('file url is not defined') )

		gltfLoader.load( url, 

			function ( gltf ) {

				resolve( gltf.scene );

			},

			// called while loading is progressing
			function ( xhr ) {

				//

			},

			// called when loading has errors
			function ( error ) {

				reject( error )

			}

		);

	} );

}

//

export default files