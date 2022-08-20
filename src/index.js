
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
loopCallbacks.push( controls.update );

scene.add( stage, uiPanel.block, controls.group );

//

/*
files.seatedCupid.then( model => {

	const puzzle = PuzzleManager( model );

	scene.add( puzzle.group );

	materials.initPuzzle( puzzle );

	puzzle.setShuffledState();

	controls.setPuzzle( puzzle );

} );
*/