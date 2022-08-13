
/*
the PuzzleManager class represent a whole puzzle and its space.
*/

import * as THREE from 'three';
import PuzzlePiece from './PuzzlePiece.js';
import materials from './materials.js';

//

const vec3A = new THREE.Vector3();
const vec3B = new THREE.Vector3();

const STANDARD_PUZZLE_SIZE = 0.5;
const STANDARD_PUZZLE_POSITION = new THREE.Vector3( 0, 1, -1 );

const GRID_SIZE = 1.5;
const GRID_CENTER = new THREE.Vector3( 0, 1, -1 );

//

function PuzzleManager( puzzleModel ) {

	const puzzleManager = {
		init,
		precompute,
		setShuffledState,
		highlightPiece,
		group: new THREE.Group(),
	}

	puzzleManager.init( puzzleModel );
	puzzleManager.precompute();

	return puzzleManager

}

//

function init( puzzleModel ) {
	
	this.group = new THREE.Group();

	// firstly we take all the meshes from the imported model, and place them in a new global Group.

	const toAdd = [];

	puzzleModel.traverse( obj => {

		if ( obj.geometry ) {

			obj.updateWorldMatrix( true, false );
			obj.geometry.applyMatrix4( obj.matrixWorld )

			toAdd.push( obj )

		}

	} );

	this.group.add( ...toAdd );

	// then we compute the bounding box center point, and move the geometry to the center of the object.

	const bbox = new THREE.Box3();
	bbox.setFromObject( this.group, true );
	const translation = bbox.getCenter( vec3A ).negate();

	this.group.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.translate(
				translation.x,
				translation.y,
				translation.z
			)
		}

	} );

	// then we scale the geometry to a standard scale so that the user can grab all parts with their hands.

	const bboxS = bbox.getSize( vec3A );
	const average = ( bboxS.x + bboxS.y + bboxS.z ) / 3;
	const scaleFactor = STANDARD_PUZZLE_SIZE / average;

	this.group.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.scale(
				scaleFactor,
				scaleFactor,
				scaleFactor
			)
		}

	} );

}

//

function precompute() {


	this.pieces = [];
	for ( let i=this.group.children.length-1 ; i>-1 ; i-- ) {
		const newPiece = PuzzlePiece( this.group.children[i] );
		this.pieces.push( newPiece );
		this.group.add( newPiece );
	}

	this.piecesNumber = this.pieces.length;

}

//

function setShuffledState() {

	// firstly we compute the layout of the grid we must make

	const gridCellLength = Math.ceil( Math.sqrt( this.piecesNumber ) );
	const gridCellSize = GRID_SIZE / gridCellLength;
	const cursor = new THREE.Vector2();

	this.pieces.forEach( piece => {

		piece.computeBBOX();
		const center = piece.bbox.getCenter( vec3A );

		const targetCenter = vec3B.set(
			GRID_CENTER.x + ( GRID_SIZE * -0.5 ) + ( cursor.x * gridCellSize ) + ( gridCellSize * 0.5 ),
			GRID_CENTER.y + ( GRID_SIZE * 0.5 ) - ( cursor.y * gridCellSize ) - ( gridCellSize * 0.5 ),
			GRID_CENTER.z
		)

		const translation = targetCenter.sub( center );

		piece.position.copy( translation );

		cursor.x = cursor.x + 1;
		if ( cursor.x > gridCellLength - 1 ) {
			cursor.x = 0;
			cursor.y ++;
		}

		piece.computeBBOX();

	} );

}

// set the highlight material on one piece.
// this function is call with null as argument to unset highlight from all.

function highlightPiece( piece ) {

	if ( this.selectedPiece ) {

		materials.setHighlightShader( this.selectedPiece, false );

	}

	if ( piece ) {

		this.selectedPiece = piece;

		materials.setHighlightShader( piece, true );

	}

}

//

export default PuzzleManager