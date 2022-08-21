
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import imageURL from '../../assets/home-background.jpg';

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




/*
const DIM_HIGH = 1.6;
const MIN_HIGH = 1.1;
const DIM_LOW = 0.25;

const justificationLegend = [
	{ id: 'start', color: 0xff9900 },
	{ id: 'end', color: 0xff0099 },
	{ id: 'center', color: 0x00ff99 },
	{ id: "space-between", color: 0x99ff00 },
	{ id: "space-around", color: 0x9900ff },
	{ id: "space-evenly", color: 0x0099ff }
];

const homePage = makeTextPanel( 'column' );

function makeTextPanel( contentDirection ) {

	const container = new ThreeMeshUI.Block( {
		height: DIM_HIGH + 0.2,
		width: DIM_HIGH + 0.2,
		contentDirection: contentDirection,
		justifyContent: 'center',
		backgroundOpacity: 1,
		backgroundColor: new THREE.Color( 'grey' ),
		hiddenOverflow: true
	} );

	container.position.set( 0, 1, -1.8 );
	container.rotation.x = - 0.55;

	for ( let i = 0; i < justificationLegend.length; i ++ ) {

		const color = new THREE.Color( justificationLegend[ i ].color );
		const id = justificationLegend[ i ].id;
		const panel = buildJustifiedPanel( id, color, contentDirection === 'column' ? 'row' : 'column' );

		container.add( panel );
	}

	return container;
}

function buildJustifiedPanel( id, color, contentDirection ) {

	const panel = new ThreeMeshUI.Block( {
		width: contentDirection === 'row' ? DIM_HIGH : DIM_LOW,
		height: contentDirection === 'row' ? DIM_LOW : DIM_HIGH,
		contentDirection: contentDirection,
		justifyContent: id,
		backgroundOpacity: 0.5,
		padding: 0.02,
		margin: 0.01,
		offset:0.0001
	} );

	for ( let i = 0; i < 5; i ++ ) {

		const blockText = new ThreeMeshUI.Block( {
			width: 0.125,
			height: 0.125,
			margin: 0.01,
			borderRadius: 0.02,
			backgroundColor: color,
			justifyContent: 'center',
			alignItems: 'center',
			offset:0.001
		} );

		panel.add( blockText );

	}

	return panel;
}
*/














//

export default homePage