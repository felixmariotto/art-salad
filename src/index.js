
import { scene, renderer } from './init.js';
import stage from './stage.js';
import Controls from './controls.js';
import files from './files.js';
import PuzzleManager from './puzzleManager.js';
import materials from './materials.js';

//

scene.add( stage );

const controls = Controls( renderer );

scene.add( controls.group );

files.puzzleModel.then( model => {

	materials.makeBackgroundGrey( model );

	const puzzleManager = PuzzleManager( model );
	scene.add( puzzleManager.group );

} );