
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import files from '../files.js';
import events from '../events.js';

import firaJSON from '../../assets/fonts/Fira.json';
import firaImage from '../../assets/fonts/Fira.png';
import sourceJSON from '../../assets/fonts/Source.json';
import sourceImage from '../../assets/fonts/Source.png';
import arrowLeftURL from '../../assets/UI-images/arrow-left.png';
import arrowRightURL from '../../assets/UI-images/arrow-right.png';

//

const PADDING_X = 0.04;
const PADDING_Y = 0.04;
const sectionsDivision = 0.72; // [ 0 - 1 ] division between left and right sections
const navigationHeight = 0.22; // [ 0 - 1 ] height of the navigation bar at the bottom of the left panel
const infoPadding = 0.03;
const descriptionCharLimit = 150;
const cellImgTxtDiv = 0.9; // [ 0 - 1 ] Y division between a cell image and the name of the puzzle right bellow

const textureLoader = new THREE.TextureLoader();

//

const browser = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING_X * 2,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: params.white,
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
	padding: 0.03,
	backgroundOpacity: 0
} );

const rightContainer = new ThreeMeshUI.Block( {
	width: browser.width * ( 1 - sectionsDivision ),
	height: browser.height,
	borderWidth: 0.005,
	backgroundOpacity: 0,
	padding: infoPadding,
} );

browser.add( leftContainer, rightContainer );

// create two rows inside the left container, to host the model cells

const rowOpt = {
	width: leftContainer.width - 2 * leftContainer.padding,
	height: ( leftContainer.height - 2 * leftContainer.padding ) * ( 1 - navigationHeight ) * 0.5,
	backgroundOpacity: 0,
	contentDirection: "row"
};

const cellRow1 = new ThreeMeshUI.Block( rowOpt );
const cellRow2 = new ThreeMeshUI.Block( rowOpt );

leftContainer.add( cellRow1, cellRow2 );

// model cells

const cellOpt = {
	width: rowOpt.width * ( 1 / 3 ),
	height: rowOpt.height,
	padding: 0.035,
	backgroundOpacity: 0
}

const cellHoveredOpt = {
	borderWidth: 0.005
}

const cellIdleOpt = {
	borderWidth: 0
}

const cellImgWidth = Math.min( cellOpt.width - 2 * cellOpt.padding, ( cellOpt.width - 2 * cellOpt.padding ) * cellImgTxtDiv );

const cellImgOpt = {
	width: cellImgWidth,
	height: cellImgWidth,
	borderWidth: 0,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	justifyContent: 'end',
	alignItems: 'end'
}

const cellTextContOpt = {
	width: cellOpt.width,
	height: ( cellOpt.height - cellOpt.padding * 2 ) * 0.1,
	borderWidth: 0,
	backgroundOpacity: 0,
	justifyContent: 'center',
	textAlign: 'center'
}

const cellPiecesInfoOpt = {
	width: 0.1,
	height: 0.07,
	backgroundColor: params.black,
	fontColor: params.white,
	backgroundOpacity: 1,
	justifyContent: 'center',
	textAlign: 'center'
}

const cells = [];
browser.cells = cells;

function Cell( id ) {

	const cell = new ThreeMeshUI.Block( cellOpt );
	const img = new ThreeMeshUI.Block( cellImgOpt );
	const textContainer = new ThreeMeshUI.Block( cellTextContOpt );
	const text = new ThreeMeshUI.Text( { fontSize: 0.045 } );
	const piecesInfoCell = new ThreeMeshUI.Block( cellPiecesInfoOpt );
	const piecesText = new ThreeMeshUI.Text( {} );

	cell.setupState( { state: 'hovered', attributes: cellHoveredOpt } );
	cell.setupState( { state: 'idle', attributes: cellIdleOpt } );

	cell.populate = function ( data ) {

		text.set( { content: data.artName } );
		piecesText.set( { content: String( data.piecesNumber ) } );

		textureLoader.load( files.modelImgs[ data.fileName ], texture => {

			img.set( { backgroundTexture: texture } );

		} )

	}

	cell.buttonName = 'browserCell-' + id;

	piecesInfoCell.add( piecesText );
	img.add( piecesInfoCell );
	textContainer.add( text );
	cell.add( img, textContainer );
	cells.push( cell );

	return cell

}

cellRow1.add( Cell(1), Cell(2), Cell(3) );
cellRow2.add( Cell(4), Cell(5), Cell(6) );

// create navigation bar

const navigationBar = new ThreeMeshUI.Block( {
	width: leftContainer.width,
	height: leftContainer.height * navigationHeight,
	backgroundOpacity: 0,
	contentDirection: "row",
	justifyContent: "center"
} );

leftContainer.add( navigationBar );

const arrowParams = {
	width: navigationBar.height * 0.4,
	height: navigationBar.height * 0.4,
	margin: 0.02
}

const arrowHoveredParams = { 
	width: navigationBar.height * 0.5,
	height: navigationBar.height * 0.5,
};

const arrowIdleParams = { 
	width: navigationBar.height * 0.4,
	height: navigationBar.height * 0.4,
};

const arrowLeft = new ThreeMeshUI.Block( arrowParams );
const arrowRight = new ThreeMeshUI.Block( arrowParams );
arrowLeft.buttonName = 'arrowLeft';
arrowRight.buttonName = 'arrowRight';

const arrows = [ arrowLeft, arrowRight ];

arrows.forEach( arrow => {

	arrow.setupState( { state: 'hovered', attributes: arrowHoveredParams } );
	arrow.setupState( { state: 'idle', attributes: arrowIdleParams } );

} );

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
		width: navigationBar.height * 0.4,
		height: navigationBar.height * 0.4,
		backgroundColor: params.black,
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

	button.buttonName = 'browserNav-' + number;

	button.add( text );

	return button

}

// Right container layout, it's an information panel

const infoImg = new ThreeMeshUI.Block( {
	width: rightContainer.width - ( infoPadding * 7 ),
	height: rightContainer.width - ( infoPadding * 7 ),
	borderWidth: 0,
	backgroundColor: params.white,
	backgroundOpacity: 1,
	margin: infoPadding * 0.5
} )

const startButton = new ThreeMeshUI.Block( {
	width: rightContainer.width - ( infoPadding * 7 ),
	height: 0.15,
	borderWidth: 0,
	borderRadius: 0.05,
	backgroundColor: params.black,
	backgroundOpacity: 1,
	margin: infoPadding * 0.5,
	justifyContent: 'center',
	textAlign: 'center'
} );

startButton.buttonName = 'startPuzzle';

startButton.setupState( {
	state: 'hovered',
	attributes: {
		backgroundColor: params.mediumGrey
	}
} );

startButton.setupState( {
	state: 'idle',
	attributes: {
		backgroundColor: params.black
	}
} );

startButton.add( new ThreeMeshUI.Text( {
	content: "start puzzle",
	fontSize: 0.07,
	fontColor: params.white
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
		height: tall ? 0.3 : 0.05,
		borderWidth: 0,
		backgroundOpacity: 0,
		margin: infoPadding * 0.25,
		justifyContent: tall ? undefined : 'center'
	} );

	const text = new ThreeMeshUI.Text( { fontSize: 0.033 } );

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

browser.frameUpdate = function ( frameSpeed ) {

	cells.forEach( cell => {
		cell.setState( cell.isHovered ? 'hovered' : 'idle' );
		cell.isHovered = false;
	} );

	arrows.forEach( arrow => {
		arrow.setState( arrow.isHovered ? 'hovered' : 'idle' );
		arrow.isHovered = false;
	} );

	startButton.setState( startButton.isHovered ? 'hovered' : 'idle' );
	startButton.isHovered = false;

}

browser.init = function () {

	// divide model info objects into arrays of length 4.

	const chunks = [[]];

	files.modelInfos.forEach( (info, i) => {

		let lastChunk = chunks[ chunks.length - 1 ];

		if ( lastChunk.length == 6 ) {

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