
/*
the PuzzleManager class represent a whole puzzle and its space.
It manages the puzzlePieces and the puzzleParts.
A puzzlePiece is one of the many pieces in which the model was originally divided.
A puzzlePart represent one of the assembled parts of the puzzle. At the begining each
piece is in one part, and when the player assemble two parts together they are merged into
one part containing two pieces.
*/

import * as THREE from 'three';
import PuzzlePiece from './PuzzlePiece.js';
import PuzzlePart from './PuzzlePart.js';
import materials from './materials.js';
import events from './events.js';

//

const vec3A = new THREE.Vector3();
const vec3B = new THREE.Vector3();

const STANDARD_PUZZLE_SIZE = 0.5;
const STANDARD_PUZZLE_POSITION = new THREE.Vector3( 0, 1, -1 );

const GRID_SIZE = 1.5;
const GRID_CENTER = new THREE.Vector3( 0, 1, -1.3 );

//

function PuzzleManager( puzzleModel ) {

	const puzzleManager = {
		init,
		precompute,
		setShuffledState,
		findPossibleMerging,
		pieces: [],
		parts: [],
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

	for ( let i=this.group.children.length-1 ; i>-1 ; i-- ) {

		const newPiece = PuzzlePiece( this.group.children[i] );
		const newPart = PuzzlePart( newPiece );

		this.pieces.push( newPiece );
		this.parts.push( newPart );

		this.group.add( newPart );
		
	}

}

// move the parts into a grid pattern in front of the player

function setShuffledState() {

	const gridCellLength = Math.ceil( Math.sqrt( this.parts.length ) );
	const gridCellSize = GRID_SIZE / gridCellLength;
	const cursor = new THREE.Vector2();

	this.parts.forEach( part => {

		part.rotation.set(
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
		);

		part.computeBBOX();
		const center = part.bbox.getCenter( vec3A );

		const targetCenter = vec3B.set(
			GRID_CENTER.x + ( GRID_SIZE * -0.5 ) + ( cursor.x * gridCellSize ) + ( gridCellSize * 0.5 ),
			GRID_CENTER.y + ( GRID_SIZE * 0.5 ) - ( cursor.y * gridCellSize ) - ( gridCellSize * 0.5 ),
			GRID_CENTER.z
		)

		const translation = targetCenter.sub( center );
		part.position.copy( translation );

		cursor.x = cursor.x + 1;
		if ( cursor.x > gridCellLength - 1 ) {
			cursor.x = 0;
			cursor.y ++;
		}

		part.computeChildrenBBOX();

	} );

}

/*
Here we test if any part can be merged with the passed part.
In order to do this, we detach the parts from whatever parent they were attached to ( possibly the controller ),
and attach them to the world, so their position and rotation can be compared in the same space.
*/

function findPossibleMerging( part ) {

	const partParent = part.parent;

	this.group.attach( part );

	let smallestDist = Infinity;

	this.parts.forEach( oppositePart => {

		if (
			part == oppositePart ||
			!part.children.length ||
			!oppositePart.children.length
		) return

		const oppositePartParent = oppositePart.parent;

		this.group.attach( oppositePart );

		if (
			part.position.distanceTo( oppositePart.position ) < 0.07 &&
			part.quaternion.angleTo( oppositePart.quaternion ) < 0.5
		) {

			// in here we do the actual merging of one part into the passed part.

			for ( let i=oppositePart.children.length -1 ; i>-1 ; i-- ) {

				const child = oppositePart.children[i];

				part.add( child );

			}

			const isFinished = ( part.children.length === this.pieces.length );

			events.emit( 'parts-assembled', isFinished );

		}

		oppositePartParent.attach( oppositePart );

	} );

	partParent.attach( part );

}

//

export default PuzzleManager