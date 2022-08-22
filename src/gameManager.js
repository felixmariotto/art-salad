
import { scene, renderer, loopCallbacks } from './init.js';
import controls from './controls.js';
import files from './files.js';
import materials from './materials.js';
import PuzzleManager from './PuzzleManager.js';
import events from './events.js';

//

const gameManager = {
	startTutorial,
	startPuzzle,
	clear
}

//

events.on( 'parts-assembled', e => {

	if ( e.detail ) {

		// the puzzle is finished

		setTimeout( () => {

			if ( gameManager.isRunningTutorial ) {

				events.emit( 'tutorial-finished' );

				gameManager.isRunningTutorial = false;

			}

			gameManager.clear();

		}, 1000 );

	} else {

		// the puzzle is not finished yet

	}

} );

gameManager.startTutorial()

function startTutorial() {

	this.isRunningTutorial = true;
	
	this.startPuzzle( "seatedCupid" );

}

function startPuzzle( modelName ) {

	files.getModel( modelName ).then( model => {

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

export default gameManager