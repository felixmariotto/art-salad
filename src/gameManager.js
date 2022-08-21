
import { scene, renderer, loopCallbacks } from './init.js';
import controls from './controls.js';
import files from './files.js';
import materials from './materials.js';
import PuzzleManager from './PuzzleManager.js';

//

const puzzleManager = {
	startTutorial
}

//

function startTutorial() {
	
	startPuzzle( files.hydriaVase );

}

function startPuzzle( modelPromise ) {

	modelPromise.then( model => {

		const puzzle = PuzzleManager( model );

		scene.add( puzzle.group );

		materials.initPuzzle( puzzle );

		puzzle.setShuffledState();

		controls.setPuzzle( puzzle );

	} );

}

//

export default puzzleManager