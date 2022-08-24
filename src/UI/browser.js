
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import files from '../files.js';

import firaJSON from '../../assets/fonts/Fira.json';
import firaImage from '../../assets/fonts/Fira.png';
import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';
import arrowLeftURL from '../../assets/UI-images/arrow-left.png';
import arrowRightURL from '../../assets/UI-images/arrow-right.png';

//

const PADDING_X = 0.04;
const PADDING_Y = 0.04;
const sectionsDivision = 0.65; // [ 0 - 1 ] division between left and right sections
const navigationHeight = 0.2; // [ 0 - 1 ] height of the navigation bar at the bottom of the left panel
const infoPadding = 0.05;
const descriptionCharLimit = 150;

const textureLoader = new THREE.TextureLoader();

//

const browser = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING_X * 2,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: new THREE.Color( 'red' ),// params.white,
	backgroundOpacity: 1,
	fontColor: params.black,
	fontFamily: sourceJSON,
	fontTexture: sourceImage,
	contentDirection: 'row'
} );

//

const leftContainer = new ThreeMeshUI.Block( {
	width: browser.width * sectionsDivision,
	height: browser.height,
	backgroundColor: new THREE.Color( 'blue' ),
	backgroundOpacity: 1
} );

const rightContainer = new ThreeMeshUI.Block( {
	width: browser.width * ( 1 - sectionsDivision ),
	height: browser.height,
	backgroundColor: new THREE.Color( 'green' ),
	backgroundOpacity: 1,
	padding: infoPadding,
} );

browser.add( leftContainer, rightContainer );

// create two rows inside the left container, to host the model cells

const rowOpt = {
	width: leftContainer.width,
	height: leftContainer.height * ( 1 - navigationHeight ) * 0.5,
	backgroundColor: new THREE.Color( 'yellow' ),
	backgroundOpacity: 1,
	contentDirection: "row"
};

const cellRow1 = new ThreeMeshUI.Block( rowOpt );
const cellRow2 = new ThreeMeshUI.Block( rowOpt );

leftContainer.add( cellRow1, cellRow2 );

// model cells

const cellOpt = {
	width: leftContainer.width * 0.5,
	height: rowOpt.height,
	padding: 0.035,
	backgroundColor: new THREE.Color( 'purple' ),
	backgroundOpacity: 1
}

const cellImgOpt = {
	width: Math.min( ( cellOpt.height - cellOpt.padding * 2 ) * 0.8, cellOpt.width ),
	height: ( cellOpt.height - cellOpt.padding * 2 ) * 0.8,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	justifyContent: 'end',
	alignItems: 'end'
}

const cellTextContOpt = {
	width: cellOpt.width,
	height: ( cellOpt.height - cellOpt.padding * 2 ) * 0.2,
	backgroundColor: new THREE.Color( 'orange' ),
	backgroundOpacity: 1,
	justifyContent: 'center',
	textAlign: 'center'
}

const cellPiecesInfoOpt = {
	width: 0.1,
	height: 0.07,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	justifyContent: 'center',
	textAlign: 'center'
}

const cells = [];

function Cell() {

	const cell = new ThreeMeshUI.Block( cellOpt );
	const img = new ThreeMeshUI.Block( cellImgOpt );
	const textContainer = new ThreeMeshUI.Block( cellTextContOpt );
	const text = new ThreeMeshUI.Text( {} );
	const piecesInfoCell = new ThreeMeshUI.Block( cellPiecesInfoOpt );
	const piecesText = new ThreeMeshUI.Text( {} );

	cell.populate = function ( data ) {

		text.set( { content: data.artName } );
		piecesText.set( { content: String( data.piecesNumber ) } );

		textureLoader.load( files.modelImgs[ data.fileName ], texture => {

			img.set( { backgroundTexture: texture } );

		} )

	}

	piecesInfoCell.add( piecesText );
	img.add( piecesInfoCell );
	textContainer.add( text );
	cell.add( img, textContainer );
	cells.push( cell );

	return cell

}

cellRow1.add( Cell(), Cell() );
cellRow2.add( Cell(), Cell() );

// create navigation bar

const navigationBar = new ThreeMeshUI.Block( {
	width: leftContainer.width,
	height: leftContainer.height * navigationHeight,
	backgroundColor: new THREE.Color( 'cyan' ),
	backgroundOpacity: 1,
	contentDirection: "row",
	justifyContent: "center"
} );

leftContainer.add( navigationBar );

const arrowParams = {
	width: navigationBar.height * 0.5,
	height: navigationBar.height * 0.5,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	margin: 0.02
}

const arrowLeft = new ThreeMeshUI.Block( arrowParams );
const arrowRight = new ThreeMeshUI.Block( arrowParams );

const buttonsRow = new ThreeMeshUI.Block( {
	width: 0.1,
	height: navigationBar.height * 0.5,
	backgroundOpacity: 0,
	contentDirection: 'row',
	justifyContent: 'space-evenly'
} );

navigationBar.add( arrowLeft, buttonsRow, arrowRight );

textureLoader.load( arrowLeftURL, texture => {

	arrowLeft.set( { backgroundTexture: texture } );

} );

textureLoader.load( arrowRightURL, texture => {

	arrowRight.set( { backgroundTexture: texture } );

} );

function NavButton( number ) {

	const button = new ThreeMeshUI.Block( {
		width: navigationBar.height * 0.5,
		height: navigationBar.height * 0.5,
		backgroundColor: new THREE.Color('blue'),
		backgroundOpacity: 1,
		margin: 0.02,
		justifyContent: 'center',
		textAlign: 'center'
	} );

	const text = new ThreeMeshUI.Text( {
		content: String( number ),
		fontSize: 0.1,
		fontColor: new THREE.Color('white')
	} );

	button.add( text );

	return button

}

// Right container layout, it's an information panel

const infoImg = new ThreeMeshUI.Block( {
	width: rightContainer.width - ( infoPadding * 7 ),
	height: rightContainer.width - ( infoPadding * 7 ),
	backgroundColor: params.white,
	backgroundOpacity: 1,
	margin: infoPadding * 0.5
} )

const startButton = new ThreeMeshUI.Block( {
	width: rightContainer.width - ( infoPadding * 7 ),
	height: 0.15,
	backgroundColor: new THREE.Color('yellow'),
	backgroundOpacity: 1,
	margin: infoPadding * 0.5,
	justifyContent: 'center',
	textAlign: 'center'
} );

startButton.add( new ThreeMeshUI.Text( {
	content: "start puzzle",
	fontSize: 0.08
} ) );

const infoPieces = InfoLine();
const infoName = InfoLine();
const infoAuth = InfoLine();
const info3DAuth = InfoLine();
const infoTags = InfoLine();
const infoDesc = InfoLine( true );

rightContainer.add(
	infoImg,
	infoPieces,
	infoName,
	infoAuth,
	info3DAuth,
	infoTags,
	infoDesc,
	startButton
);

function InfoLine( tall ) {

	const line = new ThreeMeshUI.Block( {
		width: rightContainer.width - ( infoPadding * 2 ),
		height: tall ? 0.2 : 0.05,
		backgroundColor: new THREE.Color( 'grey' ),
		backgroundOpacity: 1,
		margin: infoPadding * 0.25,
		justifyContent: tall ? undefined : 'center'
	} );

	const text = new ThreeMeshUI.Text( { fontSize: 0.03, content: 'blabla' } );

	line.userData.text = text

	line.add( text );

	return line

}

//

function populateInfo( data ) {

	const description = data.description.length > descriptionCharLimit ?
		data.description.substring( 0, descriptionCharLimit ) + ' [...]' :
		data.description

	infoPieces.userData.text.set( { content: "Number of pieces : " + String( data.piecesNumber ) } );
	infoName.userData.text.set( { content: "Name : " + data.artName } );
	infoAuth.userData.text.set( { content: "Author : " + data.artAuthor } );
	info3DAuth.userData.text.set( { content: "3D Author : " + data.modelAuthor } );
	infoTags.userData.text.set( { content: "Tags : " + data.tags.join() } );
	infoDesc.userData.text.set( { content: "Description : " + description } );

	textureLoader.load( files.modelImgs[ data.fileName ], texture => {

		infoImg.set( { backgroundTexture: texture } );

	} );

}

function populateCells( chunk ) {

	cells.forEach( ( cell, i ) => {

		cell.populate( chunk[ i ] );

	} );

}

function populateNavigation( chunks ) {

	for ( let i=0 ; i<chunks.length ; i++ ) {

		buttonsRow.add( NavButton( i + 1 ) );

	}

	buttonsRow.set( { width: null } );

}

//

browser.init = function () {

	// divide model info objects into arrays of length 4.

	const chunks = [[]];

	files.modelInfos.forEach( (info, i) => {

		let lastChunk = chunks[ chunks.length - 1 ];

		if ( lastChunk.length == 4 ) {

			lastChunk = [];
			chunks.push( lastChunk );

		}

		lastChunk.push( info );

	} );

	populateCells( chunks[ 0 ] );
	populateNavigation( chunks );
	populateInfo( chunks[ 0 ][ 0 ] );

}

browser.init();

//

export default browser