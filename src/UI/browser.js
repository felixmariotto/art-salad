
/*
This is a page that gets added or removed to the main UI panel by the UI module.
This one is the most important page, it's a list of all the available puzzles.
*/

import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import params from './params.js';
import files from '../files/files.js';
import events from '../misc/events.js';

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
	// justifyContent: 'space-between'
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
	textAlign: 'center',
	offset: 0.001
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
	piecesInfoCell.setupState( { state: 'enabled', attributes: { backgroundOpacity: 1 } } );
	piecesInfoCell.setupState( { state: 'disabled', attributes: { backgroundOpacity: 0 } } );

	// must use this hack because synchroniusly loading texture make it possible to call
	// cell.emptyData before texture is loaded, which would make emptyData ignored.
	let mustDropTexture = false;

	cell.populate = function ( data ) {

		mustDropTexture = false;

		piecesInfoCell.setState( 'enabled' );

		text.set( { content: data.artName } );
		piecesText.set( { content: String( data.piecesNumber ), offset: 0.001 } );

		if ( files.modelThumbTextures[ data.fileName ] ) {

			img.set( { backgroundTexture: files.modelThumbTextures[ data.fileName ] } );

		} else {

			textureLoader.load( files.modelImgs[ data.fileName ], texture => {

				files.modelThumbTextures[ data.fileName ] = texture;

				if ( mustDropTexture ) return

				img.set( { backgroundTexture: texture } );

			} );

		}

	}

	cell.setDisabledState = function () {

		piecesInfoCell.setState( 'disabled' );

	}

	cell.emptyData = function () {

		mustDropTexture = true;

		img.set( { backgroundTexture: null } );
		text.set( { content: '' } );

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

//

const navButtonParams = {
	width: navigationBar.height * 0.4,
	height: navigationBar.height * 0.4,
	backgroundColor: params.black,
	backgroundOpacity: 1,
	margin: 0.02,
	justifyContent: 'center',
	textAlign: 'center'
};

const navButtonHoveredParams = {
	backgroundColor: params.mediumGrey,
	fontColor: params.white
}

const navButtonSeletedParams = {
	backgroundColor: params.black,
	fontColor: params.white
}

const navButtonIdleParams = {
	backgroundColor: params.white,
	fontColor: params.black
}

const navButtons = [];
browser.navButtons = navButtons;

function NavButton( number ) {

	const button = new ThreeMeshUI.Block( navButtonParams );
	button.setupState( { state: 'hovered', attributes: navButtonHoveredParams } );
	button.setupState( { state: 'selected', attributes: navButtonSeletedParams } );
	button.setupState( { state: 'idle', attributes: navButtonIdleParams } );

	const text = new ThreeMeshUI.Text( {
		content: String( number ),
		fontSize: 0.1,
		offset: 0
	} );

	button.buttonName = 'browserNav-' + number;
	button.add( text );
	navButtons.push( button );

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
} );

let mustDropInfoTexture = false;

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
startButton.isDisabled = true;

startButton.setupState( {
	state: 'hovered',
	attributes: {
		backgroundColor: params.mediumGrey,
		backgroundOpacity: 1
	}
} );

startButton.setupState( {
	state: 'idle',
	attributes: {
		backgroundColor: params.black,
		backgroundOpacity: 1
	}
} );

startButton.setupState( {
	state: 'disabled',
	attributes: {
		backgroundOpacity: 0
	}
} );

startButton.add( new ThreeMeshUI.Text( {
	content: "start puzzle",
	fontSize: 0.07,
	fontColor: params.white,
	offset: 0
} ) );

const infoContainer = new ThreeMeshUI.Block( {
	width: rightContainer.width - ( infoPadding * 2 ),
	height: ( rightContainer.height - infoImg.height - startButton.height ) * 0.83,
	borderWidth: 0,
	backgroundOpacity: 0,
	margin: infoPadding * 0.25
} );

infoContainer.text = new ThreeMeshUI.Text( { fontSize: 0.036 } );
infoContainer.add( infoContainer.text );
rightContainer.add( infoImg, infoContainer, startButton );

//////////////
// FUNCTIONS

function animate( frameSpeed ) {

	navButtons.forEach( button => {
		if ( button.isSelected ) button.setState( 'selected' );
		else if ( button.isHovered ) button.setState( 'hovered' );
		else button.setState( 'idle' );
		button.isHovered = false;
	} );

	cells.forEach( ( cell, i ) => {
		let state = cell.isHovered ? 'hovered' : 'idle';
		if ( !this.currentChunk || !this.currentChunk[i] ) state = 'idle';
		cell.setState( state );
		cell.isHovered = false;
	} );

	arrows.forEach( arrow => {
		arrow.setState( arrow.isHovered ? 'hovered' : 'idle' );
		arrow.isHovered = false;
	} );

	if ( startButton.isDisabled ) startButton.setState( 'disabled' );
	else if ( startButton.isHovered ) startButton.setState( 'hovered' );
	else startButton.setState( 'idle' );
	startButton.isHovered = false;

}

//

function init() {

	// divide model info objects into arrays of length 4.

	this.chunks = [[]];

	files.modelInfos.forEach( ( info, i ) => {

		let lastChunk = this.chunks[ this.chunks.length - 1 ];

		if ( lastChunk.length == 6 ) {

			lastChunk = [];
			this.chunks.push( lastChunk );

		}

		lastChunk.push( info );

	} );

	this.populateNavigation();

	this.setChunk( 0 );

	this.populateInfo( 1 );
	this.populateInfo( 2 );
	this.populateInfo( null );

}

//

function populateInfo( id ) {

	if ( typeof id === 'number' ) {

		if ( !this.chunks || !this.currentChunk ) return

		mustDropInfoTexture = false;

		this.currentPuzzle = this.currentChunk[ id ];

		const description = this.currentPuzzle.description.length > descriptionCharLimit ?
			this.currentPuzzle.description.substring( 0, descriptionCharLimit ) + ' [...]' :
			this.currentPuzzle.description

		let dataText = '';
		dataText += 'Number of pieces: ' + this.currentPuzzle.piecesNumber + '\n';
		dataText += 'Artwork name: ' + this.currentPuzzle.artName + '\n';
		dataText += 'Artwork author: ' + this.currentPuzzle.artAuthor + '\n';
		dataText += '3D author: ' + this.currentPuzzle.modelAuthor + '\n';
		dataText += 'Tags: ' + this.currentPuzzle.tags.join(', ') + '\n';
		dataText += 'Description: ' + description;
		infoContainer.text.set( { content: dataText } );

		startButton.isDisabled = false;

		textureLoader.load( files.modelImgs[ this.currentPuzzle.fileName ], texture => {

			if ( mustDropInfoTexture ) return

			infoImg.set( { backgroundTexture: texture } );

		} );

	} else {

		mustDropInfoTexture = true;

		infoContainer.text.set( { content: '' } );

		startButton.isDisabled = true;

		infoImg.set( { backgroundTexture: null } );

	}

}

function setChunk( id ) {

	const currentID = this.chunks.indexOf( this.currentChunk );

	if ( typeof id == 'string' ) {

		if ( !this.currentChunk ) {

			console.error( new Error('setChunk argument is wrong') );
			return

		}

		switch ( id ) {

			case 'up' :
				id = Math.min( currentID + 1, this.chunks.length - 1 );
				break

			case 'down' :
				id = Math.max( currentID - 1, 0 );
				break

			default :
				console.error( new Error('setChunk argument is wrong') );
				break

		}

	};

	if ( currentID == id ) return

	this.currentChunk = this.chunks[ id ];

	cells.forEach( cell => {

		cell.emptyData();

		cell.setDisabledState();

	} );

	this.currentChunk.forEach( ( info, i ) => {

		cells[ i ].populate( info );

	} );

	navButtons.forEach( ( button, i ) => {
		if ( i == id ) button.isSelected = true;
		else button.isSelected = false;
	} );

}

function populateNavigation() {

	for ( let i = 0 ; i < this.chunks.length ; i++ ) {

		buttonsRow.add( NavButton( i + 1 ) );

	}

	buttonsRow.set( { width: null } );

}

//

browser.animate = animate;
browser.init = init;
browser.setChunk = setChunk;
browser.populateNavigation = populateNavigation;
browser.populateInfo = populateInfo;

browser.init();

//

export default browser