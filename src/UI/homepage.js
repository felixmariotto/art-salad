
/*
This is a page that gets added or removed to the main UI panel by the UI module.
This is the homepage displayed first when the application is started.
*/

import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import params from './params.js';

import imageURL from '../../assets/UI-images/home-background.jpg';
import firaJSON from '../../assets/fonts/Fira.json';
import firaImage from '../../assets/fonts/Fira.png';
import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';

//


const HOMEPAGE_PADDING = 0.18;

const homePage = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: params.panelHeight - HOMEPAGE_PADDING * 2,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	fontColor: params.white,
	contentDirection: 'row',
	justifyContent: 'start',
	alignItems: 'start',
	borderRadius: 0
} );

//

const leftContainer = new ThreeMeshUI.Block( {
	width: homePage.width * 0.6,
	height: homePage.height,
	backgroundOpacity: 0,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
	contentDirection: 'column',
	justifyContent: 'end',
	alignItems: 'start',
	offset: 0
} );

homePage.add( leftContainer );

//

const titleContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: 0.26,
	backgroundOpacity: 0,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
	fontColor: params.darkGrey,
	alignItems: 'start',
	offset: 0.02
} );

const title = new ThreeMeshUI.Text( {
	content: 'Art Salad',
	fontSize: 0.2,
	letterSpacing: -0.02,
	offset: 0
} );

title.onAfterUpdate = function () {
	this.position.x -= 0.01;
}

titleContainer.add( title );
leftContainer.add( titleContainer );

//

const menuContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: 0.2,
	backgroundOpacity: 0,
	contentDirection: 'row',
	offset: 0.02
} );

const tutoBtn = Button( 'Tutorial' );
const puzzleBtn = Button( 'Puzzles' );

puzzleBtn.onAfterUpdate = function () {
	this.position.x += 0.1;
}

menuContainer.add( tutoBtn, puzzleBtn );
leftContainer.add( menuContainer );

function Button( title ) {

	const button = new ThreeMeshUI.Block( {
		height: 0.13,
		width: params.panelWidth * 0.2,
		backgroundColor: params.darkGrey,
		backgroundOpacity: 1,
		textAlign: 'center',
		justifyContent: 'center',
		borderRadius: 0.13 * 0.5
	} );

	const buttonText = new ThreeMeshUI.Text( {
		content: title,
		fontSize: 0.07,
		offset: 0
	} );

	button.buttonName = title;
	button.text = buttonText;

	button.add( buttonText );

	return button

}

new THREE.TextureLoader().load( imageURL, texture => {

	const imageWidth = params.panelWidth * 0.55 - HOMEPAGE_PADDING;

	const niceImage = new ThreeMeshUI.Block( {
		width: imageWidth,
		height: imageWidth,
		backgroundTexture: texture
	} );

	

	niceImage.onAfterUpdate = function () {
		niceImage.position.set(
			( params.panelWidth * 0.5 - HOMEPAGE_PADDING ) - imageWidth * 0.5,
			( params.panelHeight * 0.5 - HOMEPAGE_PADDING ) - imageWidth * 0.5,
			0.01
		);
	}

	homePage.add( niceImage );

} );

//

export default homePage