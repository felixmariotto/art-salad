
import { loopCallbacks } from './init.js';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import gameManager from './gameManager.js';
import events from './events.js';

import params from './UI/params.js';
import homepage from './UI/homepage.js';
import tutorial from './UI/tutorial.js';
import browser from './UI/browser.js';
import infoPanel from './UI/info.js';

//

const TRANSLATION_SPEED = 0.03;
const ANGLE_SPEED = 0.03;

const CENTRE_POS = new THREE.Vector3( 0, 1, -1.8 );
const CENTRE_QUAT = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, 0, 0 ) );
const RIGHT_POS = new THREE.Vector3( 2.5, 1, 0 );
const RIGHT_QUAT = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, -Math.PI * 0.5, 0 ) );
const vec3 = new THREE.Vector3();
const quat = new THREE.Quaternion();

let targetPos = CENTRE_POS;
let targetQuat = CENTRE_QUAT;

//

const container = new ThreeMeshUI.Block( {
	width: params.panelWidth,
	height: params.panelHeight,
	justifyContent: 'center',
	textAlign: 'left',
	fontColor: params.black,
	backgroundColor: params.white,
	backgroundOpacity: 1
} );

container.position.copy( CENTRE_POS );
container.quaternion.copy( CENTRE_QUAT );

container.add( browser )

///////////////
// EVENTS

events.on( 'clicked-ui', e => {

	findButton( e.detail.element, handleButtonClick );

} );

events.on( 'hovered-ui', e => {

	findButton( e.detail.element, handleButtonHovered );

} );

events.on( 'tutorial-finished', e => {

	uiPanel.setHomepage();

} );

function findButton( element, callback ) {

	if ( element.buttonName ) {

		callback( element.buttonName, element )

	} else if ( element.parent ) {

		findButton( element.parent, callback );

	}

}

function handleButtonClick( buttonName, button ) {

	if ( buttonName.includes( 'browserNav' ) ) {

		browser.setChunk( Number( buttonName[ buttonName.length - 1 ] ) - 1 );

	}

	if ( buttonName.includes( 'browserCell' ) ) {

		browser.populateInfo( Number( buttonName[ buttonName.length - 1 ] ) - 1 );

	}

	switch ( buttonName ) {

		case 'Puzzles':
			setBrowser();
			break

		case 'Tutorial' :
			setTutorial();
			gameManager.startTutorial();
			break

		case 'Github' :
			openGithubLink();
			break

		case 'arrowLeft' :
			browser.setChunk( 'down' );
			break

		case 'arrowRight' :
			browser.setChunk( 'up' );
			break

		case 'startPuzzle' :
			setInfoPanel( browser.currentPuzzle.fileName );
			gameManager.startPuzzle( browser.currentPuzzle.fileName );
			break

		default : return

	}

}

function handleButtonHovered( buttonName, button ) {

	if ( buttonName.includes( 'browserNav' ) ) {

		browser.navButtons[ Number( buttonName[ buttonName.length - 1 ] ) - 1 ].isHovered = true;

	}

	if ( buttonName.includes( 'browserCell' ) ) {

		browser.cells[ Number( buttonName[ buttonName.length - 1 ] ) - 1 ].isHovered = true;

	}

	switch ( buttonName ) {

		case 'arrowLeft' :
		case 'arrowRight' :
		case 'startPuzzle' :
			button.isHovered = true;
			break

		default : return

	}

}

///////////////
// FUNCTIONS

loopCallbacks.push( update );

function update( frameSpeed ) {

	browser.frameUpdate( frameSpeed );

	if ( !container.position.equals( targetPos ) ) {

		const nominalLength = TRANSLATION_SPEED * frameSpeed;

		vec3
		.copy( targetPos )
		.sub( container.position );

		const newLength = Math.min( vec3.length(), nominalLength );

		if ( newLength !== nominalLength ) {

			container.position.copy( targetPos );

		} else {

			vec3.setLength( newLength );

			container.position.add( vec3 );

		}

	}

	if ( !container.quaternion.equals( targetQuat ) ) {

		const nominalAngle = ANGLE_SPEED * frameSpeed;

		const leftAngle = container.quaternion.angleTo( targetQuat );

		container.quaternion.rotateTowards(
			targetQuat,
			Math.min( leftAngle, nominalAngle )
		)

	}

}

function clearContainer() {

	for ( let i=container.children.length-1 ; i>-1 ; i-- ) {

		const child = container.children[i];

		if ( child.isUI ) container.remove( child );

	}

}

function findIntersection( raycaster ) {

	const intersects = raycaster.intersectObject( container, true );

	if ( intersects.length ) {

		const intersect = {
			element: findUIParent( intersects[0].object ),
			point: intersects[0].point
		}

		return intersect

	} else {

		return null

	}

}

function findUIParent( object3D ) {

	if ( object3D.isUI ) return object3D
	else if ( object3D.parent ) return findUIParent( object3D.parent )
	return null

}

function setTutorial() {

	clearContainer();

	container.add( tutorial );

	targetPos = RIGHT_POS;
	targetQuat = RIGHT_QUAT;

}

function setHomepage() {

	clearContainer();

	container.add( homepage );

	targetPos = CENTRE_POS;
	targetQuat = CENTRE_QUAT;

}

function setBrowser() {

	clearContainer();

	container.add( browser );

	targetPos = CENTRE_POS;
	targetQuat = CENTRE_QUAT;

}

function setInfoPanel( modelName ) {

	clearContainer();

	infoPanel.setInfo( modelName )

	container.add( infoPanel );

	targetPos = RIGHT_POS;
	targetQuat = RIGHT_QUAT;

}

function openGithubLink() {

	if ( document ) {

		const a = document.createElement('A');
		a.href = 'https://github.com/felixmariotto/puzzle-museum';
		a.target = '_blank';
		a.click();

		homepage.ghButton.text.set( {
			content: 'Exit VR to see GH page',
			fontSize: 0.05
		} );

	}

}

//

const uiPanel = {
	findIntersection,
	block: container,
	setTutorial,
	setHomepage
}

export default uiPanel