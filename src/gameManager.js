
import { scene, renderer, loopCallbacks } from './init.js';
import controls from './controls.js';
import files from './files.js';
import materials from './materials.js';
import PuzzleManager from './PuzzleManager.js';
import events from './events.js';

//

const puzzleManager = {
	startTutorial,
	startPuzzle,
	clear
}

//

events.on( 'parts-assembled', e => {

	if ( e.detail ) {

		// the puzzle is finished

		setTimeout( () => {

			if ( puzzleManager.isRunningTutorial ) {

				events.emit( 'tutorial-finished' );

				puzzleManager.isRunningTutorial = false;

			}

			puzzleManager.clear();

		}, 1000 );

	} else {

		// the puzzle is not finished yet

	}

} );

function startTutorial() {

	this.isRunningTutorial = true;
	
	this.startPuzzle( files.hydriaVase );

}

function startPuzzle( modelPromise ) {

	modelPromise.then( model => {

		this.currentPuzzle = PuzzleManager( model );

		scene.add( this.currentPuzzle.group );

		materials.initPuzzle( this.currentPuzzle );

		this.currentPuzzle.setShuffledState();

		controls.setPuzzle( this.currentPuzzle );

	} );

}

function clear() {

	controls.setPuzzle( null );

	scene.remove( this.currentPuzzle.group );

	this.currentPuzzle = null;

}

//

export default puzzleManager