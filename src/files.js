
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import doubleHeadSculpt from '../assets/double-head-sculpt.glb';
import paintedTrash from '../assets/painted-trash.glb';
import mexicoGraffiti from '../assets/mexico-graffiti.glb';
import louviersCastel from '../assets/louviers-castel.glb';
import seatedCupid from '../assets/seated-cupid.glb';
import hydriaVase from '../assets/hydria-vase.glb';

import museumModel from '../assets/museum.glb';
import environmentMap from '../assets/environment_map.jpg';

//

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

function getGLTF( url ) {

	return new Promise( resolve => {

		gltfLoader.load( url, file => {

			resolve( file.scene );

		} );

	} );

}

function getTexture( url ) {

	return new Promise( resolve => {

		textureLoader.load( url, file => {

			resolve( file  );

		} );

	} );

}

//

export default {
	doubleHeadSculpt: getGLTF( doubleHeadSculpt ),
	paintedTrash: getGLTF( paintedTrash ),
	mexicoGraffiti: getGLTF( mexicoGraffiti ),
	louviersCastel: getGLTF( louviersCastel ),
	seatedCupid: getGLTF( seatedCupid ),
	hydriaVase: getGLTF( hydriaVase ),

	museumModel: getGLTF( museumModel ),
	environmentMap: getTexture( environmentMap )
}