
/*
A puzzle part is a group encapsulating one or more puzzle pieces.
The goal of the game is to merge all the parts together.
*/

import * as THREE from 'three';

//

export default function PuzzlePart( /* component(s) */ ) {

	const part = new THREE.Group();
	part.isPart = true;

	// we let PuzzlePart argument quite free, so here we sort everything up.

	for ( const id of Object.keys( arguments ) ) {

		console.log( arguments[ id ] );

	}

}