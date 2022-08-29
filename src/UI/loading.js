
/*
Simple loading panel with a spinning icon to let the user know that the puzzle
model is loading.
*/

import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import params from './params.js';

import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';
import spinnerURL from '../../assets/UI-images/spinner.png';

//

const textureLoader = new THREE.TextureLoader();

const SCALE = 0.5;
const SPINNER_SCALE = 0.8;
const PADDING = 0.1;

const container = new ThreeMeshUI.Block( {
	width: 1.62 * SCALE,
	height: 1 * SCALE,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	borderRadius: 0.05,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
	justifyContent: 'space-evenly'
} );

const textContainer = new ThreeMeshUI.Block( {
	width: container.width,
	height: ( container.height - 2 * PADDING ) * 0.3,
	backgroundOpacity: 0,
	justifyContent: 'center',
	textAlign: 'center',
	offset: 0
} );

textContainer.add( new ThreeMeshUI.Text( {
	content: 'loading',
	fontSize: 0.1,
	fontColor: params.black
} ) );

const spinnerContainer = new ThreeMeshUI.Block( {
	width: container.width,
	height: ( container.height - 2 * PADDING ) * 0.7,
	backgroundOpacity: 0,
	offset: 0,
	justifyContent: 'center'
} );

const spinner = new ThreeMeshUI.Block( {
	width: spinnerContainer.height * SPINNER_SCALE,
	height: spinnerContainer.height * SPINNER_SCALE,
	backgroundColor: params.white
} );

spinnerContainer.add( spinner );

container.add( textContainer, spinnerContainer );

//

textureLoader.load( spinnerURL, texture => {

	spinner.set( { backgroundTexture: texture } );

} );

let counter = 0; // count is seconds
const interval = 0.1; // interval of spinning in seconds

container.animate = function ( frameSpeed ) {

	counter += ( 1 / 60 ) * frameSpeed;

	if ( counter > interval ) {

		counter = 0;

		spinner.rotation.z -= Math.PI / 4;

	}

}

//

export default container
