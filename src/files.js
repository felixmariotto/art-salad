
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import museum from '../assets/museum.glb';

import doubleHeadSculpt from '../assets/puzzles/double-head-sculpt/double-head-sculpt.glb';
import paintedTrash from '../assets/puzzles/painted-trash/painted-trash.glb';
import mexicoGraffiti from '../assets/puzzles/mexico-graffiti/mexico-graffiti.glb';
import louviersCastel from '../assets/puzzles/louviers-castel/louviers-castel.glb';
import seatedCupid from '../assets/puzzles/seated-cupid/seated-cupid.glb';
import hydriaVase from '../assets/puzzles/hydria-vase/hydria-vase.glb';
import nTomoMask from '../assets/puzzles/n-tomo-mask/n-tomo-mask.glb';

import doubleHeadSculptInfo from '../assets/puzzles/double-head-sculpt/info.json';
import paintedTrashInfo from '../assets/puzzles/painted-trash/info.json';
import mexicoGraffitiInfo from '../assets/puzzles/mexico-graffiti/info.json';
import louviersCastelInfo from '../assets/puzzles/louviers-castel/info.json';
import seatedCupidInfo from '../assets/puzzles/seated-cupid/info.json';
import hydriaVaseInfo from '../assets/puzzles/hydria-vase/info.json';
import nTomoMaskInfo from '../assets/puzzles/n-tomo-mask/info.json';

const modelURLs = {
	museum,
	doubleHeadSculpt,
	paintedTrash,
	mexicoGraffiti,
	louviersCastel,
	seatedCupid,
	hydriaVase,
	nTomoMask
}

const modelInfos = {
	doubleHeadSculpt: doubleHeadSculptInfo,
	paintedTrash: paintedTrashInfo,
	mexicoGraffiti: mexicoGraffitiInfo,
	louviersCastel: louviersCastelInfo,
	seatedCupid: seatedCupidInfo,
	hydriaVase: hydriaVaseInfo,
	nTomoMask: nTomoMaskInfo
}

// Here we just make sure that every file has all the attributes it is supposed to have
// in order to display a rich documentation panel.

for ( let x in modelInfos ) {

	const info = modelInfos[ x ];

	if (
		!info.piecesNumber ||
		!info.fileName ||
		!info.artName ||
		!info.artAuthor ||
		!info.modelAuthor ||
		!info.tags ||
		!info.description
	) {
		console.warn( 'this file has a missing attribute : ', info )
	}

}

//

let worker, onFileReady;

const gltfLoader = new GLTFLoader();
const objectLoader = new THREE.ObjectLoader();

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

			newTexture.encoding = THREE.sRGBEncoding;

			const material = new THREE.MeshBasicMaterial( {
				map: newTexture,
				side: THREE.DoubleSide
			} );

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