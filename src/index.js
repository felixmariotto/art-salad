
import { scene } from './misc/init.js';
import stage from './misc/stage.js';
import UI from './UI.js';
import gameManager from './gameManager.js';

//

scene.add( stage, UI.group, UI.loadingGroup );

//

/*
setTimeout( ()=> {
	UI.setTutorial();
	gameManager.startTutorial();
	// gameManager.startPuzzle( 'seatedCupid' )
	// gameManager.startPuzzle( 'mexicoGraffiti' )
	// gameManager.startPuzzle( 'louviersCastle' )
	// gameManager.startPuzzle( 'doubleHeadSculpt' ) 
	// gameManager.startPuzzle( 'hydriaVase' )
	// gameManager.startPuzzle( 'pentecostRederos' )
}, 500 );
*/