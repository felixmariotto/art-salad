
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';

import FiraJSON from '../../assets/fonts/Fira.json';
import FiraImage from '../../assets/fonts/Fira.png';
import SourceJSON from '../../assets/fonts/Source.json';
import SourceImage from '../../assets/fonts/Source.png';

//

const PADDING_X = 0.04;
const PADDING_Y = 0.04;
const division = 0.7; // [ 0 - 1 ] division between left and right sections

const textureLoader = new THREE.TextureLoader();

//

const browser = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING_X * 2,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: new THREE.Color( 'red' ),// params.white,
	backgroundOpacity: 1,
	fontColor: params.black,
	fontFamily: SourceJSON,
	fontTexture: SourceImage,
	contentDirection: 'row'
} );

//

const leftContainer = new ThreeMeshUI.Block( {
	width: ( params.panelWidth - PADDING_X * 2 ) * division,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: new THREE.Color( 'blue' ),
	backgroundOpacity: 1
} );

browser.add( leftContainer );

//

const rightContainer = new ThreeMeshUI.Block( {
	width: ( params.panelWidth - PADDING_X * 2 ) * ( 1 - division ),
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: new THREE.Color( 'green' ),
	backgroundOpacity: 1
} );

browser.add( rightContainer );

//

export default browser