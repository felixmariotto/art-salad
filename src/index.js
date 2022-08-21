
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import Controls from './controls.js';
import files from './files.js';
import PuzzleManager from './PuzzleManager.js';
import materials from './materials.js';
import uiPanel from './uiPanel.js';
import events from './events.js';

import * as THREE from 'three';

//

const controls = Controls( renderer );
loopCallbacks.push( controls.update );

scene.add( stage, uiPanel.block, controls.group );

//

events.on( 'clicked-ui', e => {

	findButton( e.detail.element );

} );

function findButton( element ) {

	if ( element.buttonName ) {

		handleButtonClick( element.buttonName )

	} else if ( element.parent ) {

		findButton( element.parent );

	}

}

function handleButtonClick( buttonName ) {

	switch ( buttonName ) {

		case 'Puzzles':
			console.log('go to puzzles page');
			break

		case 'Tutorial' :
			console.log('start tutorial');
			break

		case 'Github' :
			console.log('go to Github');
			break

	}

}

/*
files.seatedCupid.then( model => {

	const puzzle = PuzzleManager( model );

	scene.add( puzzle.group );

	materials.initPuzzle( puzzle );

	puzzle.setShuffledState();

	controls.setPuzzle( puzzle );

} );
*/