
import { scene } from './misc/init.js';
import stage from './misc/stage.js';
import UI from './UI.js';
import gameManager from './gameManager.js';

import ghIconURL from '../assets/UI-images/github-icon.png';

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

const ghLink = document.createElement('A');
ghLink.href = 'https://github.com/felixmariotto/art-salad';
ghLink.target = '_blank';

ghLink.style.position = 'absolute';
ghLink.style.right = '15px';
ghLink.style.bottom = '15px';
ghLink.style.width = '44px';
ghLink.style.height = '44px';
ghLink.style.backgroundColor = 'white';
ghLink.style.backgroundImage = `url(${ ghIconURL })`;
ghLink.style.backgroundSize = 'contain';
ghLink.style.borderRadius = '26px';
ghLink.style.borderWidth = '4px';
ghLink.style.borderStyle = 'solid';
ghLink.style.borderColor = 'white';

document.body.appendChild( ghLink );