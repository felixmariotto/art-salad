
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import UI from './UI.js';
import events from './events.js';
import controls from './controls.js';
import gameManager from './gameManager.js';
import files from './files.js';

import * as THREE from 'three';

//

scene.add( stage, UI.group, UI.loadingGroup );

//

/*
setTimeout( ()=> {
	UI.setTutorial();
	// gameManager.startTutorial();
	// gameManager.startPuzzle( 'seatedCupid' )
	// gameManager.startPuzzle( 'mexicoGraffiti' )
	// gameManager.startPuzzle( 'louviersCastle' )
	// gameManager.startPuzzle( 'doubleHeadSculpt' ) 
	// gameManager.startPuzzle( 'hydriaVase' )
	// gameManager.startPuzzle( 'pentecostRederos' )
}, 500 );
*/