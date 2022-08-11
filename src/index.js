
import { scene, renderer } from './init.js';
import stage from './stage.js';
import Controls from './controls.js';
import files from './files.js';

//

scene.add( stage );

const controls = Controls( renderer );

scene.add( controls.group );

files.puzzleModel.then( model => {

	scene.add( model );
	
} );