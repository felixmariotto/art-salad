
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import imageURL from '../../assets/UI-images/home-background.jpg';

import FiraJSON from '../../assets/fonts/Fira.json';
import FiraImage from '../../assets/fonts/Fira.png';
import SourceJSON from '../../assets/fonts/Source.json';
import SourceImage from '../../assets/fonts/Source.png';

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
	fontFamily: SourceJSON,
	fontTexture: SourceImage,
	justifyContent: "space-between"
} );

homePage.add( lowerContainer );

//

const titleContainer = new ThreeMeshUI.Block( {
	width: params.panelWidth - HOMEPAGE_PADDING * 2,
	height: 0.3,
	backgroundOpacity: 0,
	fontFamily: FiraJSON,
	fontTexture: FiraImage,
	fontColor: params.darkGrey,
	alignItems: 'start'
} );

const title = new ThreeMeshUI.Text( {
	content: 'Open Museum',
	fontSize: 0.28,
	letterSpacing: -0.1
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

menuContainer.add( Button( 'Tutorial' ), Button( 'Puzzles' ), Button( 'Github' ) )
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

	button.buttonName = title;

	const buttonText = new ThreeMeshUI.Text( {
		content: title,
		fontSize: 0.08
	} );

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