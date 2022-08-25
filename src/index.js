
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

/*
setTimeout( ()=> {
	uiPanel.setTutorial();
	gameManager.startTutorial();
}, 1000 );
*/
