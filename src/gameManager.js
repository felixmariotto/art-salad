
import { scene, renderer, loopCallbacks } from './init.js';
import controls from './controls.js';
import files from './files.js';
import materials from './materials.js';
import PuzzleManager from './PuzzleManager.js';
import events from './events.js';

//

const puzzleManager = {
	startTutorial
}

//

events.on( 'parts-assembled', e => {

	if ( e.detail ) {

		// the puzzle is finished

	} else {

		// the puzzle is not finished yet

	}

} );

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