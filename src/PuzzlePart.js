
/*
A puzzle part is a group encapsulating one or more puzzle pieces.
The goal of the game is to merge all the parts together.
*/

import * as THREE from 'three';

//

export default function PuzzlePart( /* component(s) */ ) {

	const part = new THREE.Group();
	part.isPart = true;
	part.distanceToController = distanceToController;
	part.computeBBOX = computeBBOX;

	// we let PuzzlePart argument quite free, so here we sort everything up.

	for ( const id of Object.keys( arguments ) ) {

		part.add( arguments[ id ] );

	}

	return part

}

// In order to look for the smallest distance between a controller and a puzzle part,
// we must be careful about computation cost and proceed by steps.
// The first step is an intersection test between the controller and each piece bounding box.
// If the bbox test pass, then we check the actual mesh.

function distanceToController( controller, handRadius ) {

	let minDist = Infinity;

	this.traverse( child => {

		if (
			child.isPiece &&
			child.bbox.distanceToPoint( controller.position ) < handRadius
		) {

			const dist = child.distanceToPoint( controller.position );

			if ( dist < minDist ) {

				minDist = dist

			}

		}

	} );

	return minDist;

}

//

function computeBBOX() {

	this.traverse( child => {

		if ( child.isPiece ) child.computeBBOX();

	} );

}
