
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import files from '../files.js';

import firaJSON from '../../assets/fonts/Fira.json';
import firaImage from '../../assets/fonts/Fira.png';
import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';

//

const PADDING = 0.035;

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

const title = new ThreeMeshUI.Block({
	width: infoPanel.width - PADDING * 2,
	height: 0.12,
	margin: PADDING * 0.5,
	backgroundOpacity: 0,
	justifyContent: 'center',
	textAlign: 'center',
	fontFamily: firaJSON,
	fontTexture: firaImage,
});

title.text = new ThreeMeshUI.Text({
	fontSize: 0.1,
	letterSpacing: -0.07,
});

title.add( title.text );

const topSection = new ThreeMeshUI.Block({
	width: title.width,
	height: infoPanel.height * 0.6,
	margin: PADDING * 0.5,
	backgroundOpacity: 0,
	contentDirection: 'row-reverse',
	offset: 0
});

let bottomHeight = ( infoPanel.height - infoPanel.padding * 2 );
bottomHeight -= ( title.height + title.margin * 2 );
bottomHeight -= ( topSection.height + topSection.margin * 2 ) + PADDING;

const bottomSection = new ThreeMeshUI.Block({
	width: title.width,
	height: bottomHeight,
	margin: PADDING * 0.5,
	backgroundOpacity: 0,
	contentDirection: 'row',
	offset: 0
});

infoPanel.add( title, topSection, bottomSection );

//

const image = new ThreeMeshUI.Block({
	width: topSection.height,
	height: topSection.height
});

const description = new ThreeMeshUI.Block({
	width: topSection.width - image.width - PADDING,
	height: topSection.height,
	margin: PADDING,
	backgroundOpacity: 0,
	bestFit: 'shrink'
});

description.text = new ThreeMeshUI.Text({
	fontSize: 0.05
});

description.add( description.text );

topSection.add( image, description );

//

const dataPanel = new ThreeMeshUI.Block({
	width: description.width,
	height: bottomSection.height,
	backgroundOpacity: 0
});

dataPanel.text = new ThreeMeshUI.Text({
	fontSize: 0.05
});

dataPanel.add( dataPanel.text );

bottomSection.add( dataPanel );

//

let previousTexture;

function setInfo( modelName ) {

	const info = files.modelInfos.find( inf => ( inf.fileName === modelName ) );

	title.text.set( { content: info.artName } );
	description.text.set( { content: info.description } );

	let dataText = '';
	dataText += 'Number of pieces: ' + info.piecesNumber + '\n';
	dataText += 'Artwork name: ' + info.artName + '\n';
	dataText += 'Artwork author: ' + info.artAuthor + '\n';
	dataText += '3D author: ' + info.modelAuthor + '\n';
	dataText += 'Tags: ' + info.tags.join(', ') + '\n';
	dataPanel.text.set({ content: dataText });

	image.set( { backgroundTexture: files.modelThumbTextures[ info.fileName ] } );

}

//

infoPanel.setInfo = setInfo;

//

export default infoPanel