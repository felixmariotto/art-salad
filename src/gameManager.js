
/*
Module responsible to start and end puzzles.
It's a kind of global manager that's responsible for telling to other modules
when and how to react to global game events.
*/

import { scene, renderer, loopCallbacks } from './misc/init.js';
import controls from './controls/controls.js';
import files from './files/files.js';
import materials from './puzzles/materials.js';
import PuzzleManager from './puzzles/puzzleManager.js';
import events from './misc/events.js';

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

				gameManager.clear();

			}

		}, 1000 );

	} else {

		// the puzzle is not finished yet

	}

} );

events.on( 'exit-puzzle-request', e => {

	gameManager.isRunningTutorial = false;

	gameManager.clear();

} );

function startTutorial() {

	this.isRunningTutorial = true;
	
	this.startPuzzle( "hydriaVase" );

}

function startPuzzle( modelName ) {

	return new Promise( resolve => {

		events.emit( 'start-loading' );

		files.getModel( modelName ).then( model => {

			this.currentPuzzle = PuzzleManager( model );

			scene.add( this.currentPuzzle.group );

			materials.initPuzzle( this.currentPuzzle );

			this.currentPuzzle.setShuffledState();

			controls.setPuzzle( this.currentPuzzle );

			events.emit( 'end-loading' );
			events.emit( 'start-puzzle' );

			resolve( this.currentPuzzle );

		} );

	} );

}

function clear() {

	controls.setPuzzle( null );

	scene.remove( this.currentPuzzle.group );

	this.currentPuzzle.clear();

	this.currentPuzzle = null;

}

//

export default gameManager