
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import UI from './UI.js';
import events from './events.js';
import controls from './controls.js';
import gameManager from './gameManager.js';

import * as THREE from 'three';

//

scene.add( stage, UI.block, UI.loadingGroup );

//

/*
setTimeout( ()=> {
	UI.setTutorial();
	gameManager.startTutorial();
}, 1000 );
*/