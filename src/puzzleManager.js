
/*
the PuzzleManager class represent a whole puzzle and its space.
*/

import * as THREE from 'three';

//

const vec3 = new THREE.Vector3();

const STANDARD_SIZE = 0.5;

//

function PuzzleManager( puzzleModel ) {

	const puzzleManager = {
		puzzleModel,
		init,
		group: new THREE.Group()
	}

	puzzleManager.init();

	return puzzleManager

}

function init() {

	const cleanModel = new THREE.Group();
	this.group.add( cleanModel );

	// firstly we take all the meshes from the imported model, and place them in a new global Group.

	const toAdd = [];

	this.puzzleModel.traverse( obj => {

		if ( obj.geometry ) {

			obj.updateWorldMatrix( true, false );
			obj.geometry.applyMatrix4( obj.matrixWorld )

			toAdd.push( obj )

		}

	} );

	cleanModel.add( ...toAdd );

	// then we compute the bounding box center point, and move the geometry to the center of the object.

	const bbox = new THREE.Box3();
	bbox.setFromObject( cleanModel, true );
	const translation = bbox.getCenter( vec3 ).negate();

	cleanModel.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.translate(
				translation.x,
				translation.y,
				translation.z
			)
		}

	} );

	// then we scale the geometry to a standard scale so that the user can grab all parts with their hands.

	const bboxS = bbox.getSize( vec3 );
	const average = ( bboxS.x + bboxS.y + bboxS.z ) / 3;
	const scaleFactor = STANDARD_SIZE / average;

	cleanModel.traverse( obj => {

		if ( obj.geometry ) {
			obj.geometry.scale(
				scaleFactor,
				scaleFactor,
				scaleFactor
			)
		}

	} );

	// then a pre-computation must be made :
	// each piece of the puzzle must get moved to its own object with center at center of bbox
	// then each piece center point related to the puzzle center must be recorded

}

//

export default PuzzleManager