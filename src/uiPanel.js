
import { loopCallbacks } from './init.js';
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import gameManager from './gameManager.js';
import events from './events.js';

import params from './UI/params.js';
import homepage from './UI/homepage.js';
import tutorial from './UI/tutorial.js';
import browser from './UI/browser.js';

//

const TRANSLATION_SPEED = 0.03;
const ANGLE_SPEED = 0.03;

const HOME_POS = new THREE.Vector3( 0, 1, -1.8 );
const HOME_QUAT = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, 0, 0 ) );
const TUTO_POS = new THREE.Vector3( 2.5, 1, 0 );
const TUTO_QUAT = new THREE.Quaternion().setFromEuler( new THREE.Euler( 0, -Math.PI * 0.5, 0 ) );
const vec3 = new THREE.Vector3();
const quat = new THREE.Quaternion();

let targetPos = HOME_POS;
let targetQuat = HOME_QUAT;

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

container.position.copy( HOME_POS );
container.quaternion.copy( HOME_QUAT );

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

		console.log( 'browserCell', Number( buttonName[ buttonName.length - 1 ] ) )

	}

	switch ( buttonName ) {

		case 'Puzzles':
			console.log('go to puzzles page');
			break

		case 'Tutorial' :
			setTutorial();
			gameManager.startTutorial();
			break

		case 'Github' :
			console.log('go to Github');
			break

		case 'arrowLeft' :
			browser.setChunk( 'down' );
			break

		case 'arrowRight' :
			browser.setChunk( 'up' );
			break

		case 'startPuzzle' :
			console.log('startPuzzle');
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
		.sub( container.position )

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

	targetPos = TUTO_POS;
	targetQuat = TUTO_QUAT;

}

function setHomepage() {

	clearContainer();

	container.add( homepage );

	targetPos = HOME_POS;
	targetQuat = HOME_QUAT;

}

//

const uiPanel = {
	findIntersection,
	block: container,
	setTutorial,
	setHomepage
}

export default uiPanel