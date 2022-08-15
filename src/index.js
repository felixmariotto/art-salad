
import { scene, renderer, loopCallbacks } from './init.js';
import stage from './stage.js';
import Controls from './controls.js';
import files from './files.js';
import PuzzleManager from './PuzzleManager.js';
import materials from './materials.js';

//

scene.add( stage );

const controls = Controls( renderer );

scene.add( controls.group );

files.puzzleModel.then( model => {

	const puzzle = PuzzleManager( model );
	scene.add( puzzle.group );
	materials.initPuzzle( puzzle );

	puzzle.setShuffledState();

	controls.setPuzzle( puzzle );
	loopCallbacks.push( controls.update );

} );