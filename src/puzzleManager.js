
import * as THREE from 'three';

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

	console.log( 'puzzleModel', this.puzzleModel )

	this.group.add( this.puzzleModel );

	// here we have to scale the model to a standard size

	// then a pre-computation must be made :
	// each piece of the puzzle must get moved to its own object with center at center of bbox
	// then each piece center point related to the puzzle center must be recorded

}

//

export default PuzzleManager