
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import uiPanel from './uiPanel.js';
import events from './events.js';
import controls from './controls.js';
import gameManager from './gameManager.js';

import * as THREE from 'three';

//

scene.add( stage, uiPanel.block );

//

events.on( 'clicked-ui', e => {

	findButton( e.detail.element );

} );

events.on( 'tutorial-finished', e => {

	uiPanel.setHomepage();

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
			uiPanel.setTutorial();
			gameManager.startTutorial();
			break

		case 'Github' :
			console.log('go to Github');
			break

	}

}


setTimeout( ()=> {
	uiPanel.setTutorial();
	gameManager.startTutorial();
}, 1000 );

