
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';

import FiraJSON from '../../assets/fonts/Fira.json';
import FiraImage from '../../assets/fonts/Fira.png';
import SourceJSON from '../../assets/fonts/Source.json';
import SourceImage from '../../assets/fonts/Source.png';

import joystickURL from '../../assets/UI-images/joystick.jpg';
import triggerURL from '../../assets/UI-images/trigger-button.jpg';
import squeezeURL from '../../assets/UI-images/squeeze-button.jpg';

//

const PADDING_X = 0.40;
const PADDING_Y = 0.08;

const data = [
	{
		text: '1. Push the trigger button of your controller to enable "ray mode". The "ray mode" allows you to highlight puzzle pieces far away from you.',
		imageURL: triggerURL
	},
	{
		text: "2. Push the squeeze button of your controller to grip a puzzle piece while it is highlighted.",
		imageURL: squeezeURL
	},
	{
		text: "3. Push the joystick up or down to attract or repel a puzzle piece while it is gripped.",
		imageURL: joystickURL
	},
	{
		text: "4. Assemble the puzzle pieces together by bringing them closer. When two pieces are close enough or their final position, they will automatically merge."
	}
]

const textureLoader = new THREE.TextureLoader();

//

const tutorial = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING_X * 2,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	// fontColor: params.white,
	// contentDirection: "column-reverse",
	fontFamily: SourceJSON,
	fontTexture: SourceImage,
	justifyContent: "space-between"
} );

//

data.forEach( lineData => {

	const line = new ThreeMeshUI.Block( {
		width: params.panelWidth - PADDING_X * 2,
		height: ( params.panelHeight - PADDING_Y * 2 ) * 0.23,
		backgroundOpacity: 0,
		contentDirection: 'row',
		justifyContent: 'space-between'
	} );

	const lineHeight = ( params.panelHeight - PADDING_Y * 2 ) * 0.23;

	const textContainer = new ThreeMeshUI.Block( {
		width: ( params.panelWidth - PADDING_X * 2 ) - lineHeight,
		height: lineHeight,
		backgroundOpacity: 0,
		justifyContent: 'center'
	} );

	const text = new ThreeMeshUI.Text( {
		content: lineData.text
	} );

	const imageContainer = new ThreeMeshUI.Block( {
		width: ( params.panelHeight - PADDING_Y * 2 ) * 0.23,
		height: ( params.panelHeight - PADDING_Y * 2 ) * 0.23,
		backgroundColor: params.white,
		backgroundOpacity: 1,
	} );

	textContainer.add( text );
	line.add( textContainer, imageContainer );

	if ( lineData.imageURL ) {

		textureLoader.load( lineData.imageURL, texture => {

			imageContainer.set( {
				backgroundTexture: texture
			} );

		} );

	}

	tutorial.add( line );

} );

/*

new THREE.TextureLoader().load( imageURL, texture => {

	const imageWidth = params.panelWidth * 0.4 - TUTORIAL_PADDING;

	const niceImage = new ThreeMeshUI.Block( {
		width: imageWidth,
		height: imageWidth,
		backgroundTexture: texture
	} );

	niceImage.autoLayout = false;
	niceImage.position.x = ( params.panelWidth * 0.5 - TUTORIAL_PADDING ) - imageWidth * 0.5;
	niceImage.position.y = ( params.panelHeight * 0.5 - TUTORIAL_PADDING ) - imageWidth * 0.5

	tutorial.add( niceImage );

} );

*/

export default tutorial