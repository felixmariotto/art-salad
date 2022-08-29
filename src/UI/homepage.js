
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
	contentDirection: "column-reverse",
	justifyContent: "start"
} );

//

const lowerContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: params.panelHeight * 0.4,
	backgroundOpacity: 0,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
	justifyContent: "space-between"
} );

homePage.add( lowerContainer );

//

const titleContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: 0.3,
	backgroundOpacity: 0,
	fontFamily: firaJSON,
	fontTexture: firaImage,
	fontColor: params.darkGrey,
	alignItems: 'start'
} );

const title = new ThreeMeshUI.Text( {
	content: 'Open Museum',
	fontSize: 0.28,
	letterSpacing: -0.1,
	offset: 0
} );

titleContainer.add( title );
lowerContainer.add( titleContainer );

//

const menuContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: 0.2,
	backgroundOpacity: 0,
	contentDirection: 'row',
	justifyContent: 'space-between',
	// alignItems: 'start'
} );

homePage.ghButton = Button( 'Github' );
menuContainer.add( Button( 'Tutorial' ), Button( 'Puzzles' ), homePage.ghButton )
lowerContainer.add( menuContainer );

function Button( title ) {

	const button = new ThreeMeshUI.Block( {
		height: 0.15,
		width: params.panelWidth * 0.25,
		backgroundColor: params.darkGrey,
		backgroundOpacity: 1,
		textAlign: 'center',
		justifyContent: 'center'
	} );

	const buttonText = new ThreeMeshUI.Text( {
		content: title,
		fontSize: 0.08,
		offset: 0
	} );

	button.buttonName = title;
	button.text = buttonText;

	button.add( buttonText );

	return button

}

new THREE.TextureLoader().load( imageURL, texture => {

	const imageWidth = params.panelWidth * 0.4 - HOMEPAGE_PADDING;

	const niceImage = new ThreeMeshUI.Block( {
		width: imageWidth,
		height: imageWidth,
		backgroundTexture: texture
	} );

	niceImage.autoLayout = false;
	niceImage.position.x = ( params.panelWidth * 0.5 - HOMEPAGE_PADDING ) - imageWidth * 0.5;
	niceImage.position.y = ( params.panelHeight * 0.5 - HOMEPAGE_PADDING ) - imageWidth * 0.5

	homePage.add( niceImage );

} );

//

export default homePage