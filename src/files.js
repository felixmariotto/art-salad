
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import puzzleModel from '../assets/test.glb';
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
	puzzleModel: getGLTF( puzzleModel ),
	museumModel: getGLTF( museumModel ),
	environmentMap: getTexture( environmentMap )
}