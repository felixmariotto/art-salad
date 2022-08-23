
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import params from './params.js';
import files from '../files.js';

import FiraJSON from '../../assets/fonts/Fira.json';
import FiraImage from '../../assets/fonts/Fira.png';
import SourceJSON from '../../assets/fonts/Source.json';
import SourceImage from '../../assets/fonts/Source.png';

//

const PADDING_X = 0.04;
const PADDING_Y = 0.04;
const sectionsDivision = 0.65; // [ 0 - 1 ] division between left and right sections
const navigationHeight = 0.2; // [ 0 - 1 ] height of the navigation bar at the bottom of the left panel

const textureLoader = new THREE.TextureLoader();

//

const browser = new ThreeMeshUI.Block( {
	width: params.panelWidth - PADDING_X * 2,
	height: params.panelHeight - PADDING_Y * 2,
	backgroundColor: new THREE.Color( 'red' ),// params.white,
	backgroundOpacity: 1,
	fontColor: params.black,
	fontFamily: SourceJSON,
	fontTexture: SourceImage,
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
	backgroundOpacity: 1
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
	backgroundColor: new THREE.Color( 'purple' ),
	backgroundOpacity: 1
}

const cellImgOpt = {
	width: Math.min( cellOpt.height * 0.8, cellOpt.width ),
	height: cellOpt.height * 0.8,
	backgroundColor: new THREE.Color( 'red' ),
	backgroundOpacity: 1
}

const cellText = {
	width: cellOpt.width,
	height: cellOpt.height * 0.2,
	backgroundColor: new THREE.Color( 'orange' ),
	backgroundOpacity: 1
}

function Cell() {

	const cell = new ThreeMeshUI.Block( cellOpt );
	const img = new ThreeMeshUI.Block( cellImgOpt );
	const text = new ThreeMeshUI.Block( cellText );

	cell.add( img, text );

	return cell

}

cellRow1.add( Cell(), Cell() );
cellRow2.add( Cell(), Cell() );

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



	console.log( chunks )

}

browser.init();

//

export default browser