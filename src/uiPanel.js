
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import params from './UI/params.js';
import homePage from './UI/homepage.js';
import tutorial from './UI/tutorial.js';

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

container.position.set( 0, 1, -1.8 );
// container.rotation.x = -0.55;

///////////////
// MODULES

container.add( tutorial )

///////////////
// FUNCTIONS

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

//

const uiPanel = {
	findIntersection,
	block: container
}

export default uiPanel