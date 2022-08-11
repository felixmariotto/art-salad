
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import puzzleModel from '../assets/test.glb';

//

const loader = new GLTFLoader();

function getFile( url ) {

	return new Promise( resolve => {

		loader.load( url, file => {

			resolve( file.scene );

		} );

	} );

}

//

export default {
	puzzleModel: getFile( puzzleModel )
}