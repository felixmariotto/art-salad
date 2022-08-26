
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import files from '../files.js';

import firaJSON from '../../assets/fonts/Fira.json';
import firaImage from '../../assets/fonts/Fira.png';
import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';

//

const PADDING = 0.05;

const textureLoader = new THREE.TextureLoader();

//

const infoPanel = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING,
	height: params.panelHeight - PADDING,
	padding: PADDING * 0.5,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	fontColor: params.black,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
} );

const titleContainer = new ThreeMeshUI.Block({
	width: infoPanel.width - PADDING * 2,
	height: 0.15,
	margin: PADDING * 0.5,
	backgroundColor: new THREE.Color('green')
});

const topSection = new ThreeMeshUI.Block({
	width: titleContainer.width,
	height: infoPanel.height * 0.45,
	margin: PADDING * 0.5,
	backgroundColor: new THREE.Color('orange')
});

let bottomHeight = ( infoPanel.height - infoPanel.padding * 2 );
bottomHeight -= ( titleContainer.height + titleContainer.margin * 2 );
bottomHeight -= ( topSection.height + topSection.margin * 2 ) + PADDING;

const bottomSection = new ThreeMeshUI.Block({
	width: titleContainer.width,
	height: bottomHeight,
	margin: PADDING * 0.5,
	backgroundColor: new THREE.Color('blue')
});

infoPanel.add( titleContainer, topSection, bottomSection )

//

function setInfo( modelName ) {

	const info = files.modelInfos.find( inf => ( inf.fileName === modelName ) );

	console.log( info )

}

//

infoPanel.setInfo = setInfo;

//

export default infoPanel