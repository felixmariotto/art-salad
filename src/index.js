
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import Controls from './controls.js';
import files from './files.js';
import PuzzleManager from './PuzzleManager.js';
import materials from './materials.js';
import uiPanel from './uiPanel.js';

import * as THREE from 'three';

//

const controls = Controls( renderer );

scene.add( stage, uiPanel, controls.group );

//

files.seatedCupid.then( model => {

	const puzzle = PuzzleManager( model );
	scene.add( puzzle.group );
	materials.initPuzzle( puzzle );

	puzzle.setShuffledState();

	controls.setPuzzle( puzzle );
	loopCallbacks.push( controls.update );

} );