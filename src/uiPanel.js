
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';

//

const container = new ThreeMeshUI.Block( {
	width: 1.2,
	height: 0.5,
	padding: 0.05,
	justifyContent: 'center',
	textAlign: 'left',
	fontFamily: FontJSON,
	fontTexture: FontImage
} );


container.position.set( 0, 1, -1.8 );
// container.rotation.x = -0.55;

//

container.add(
	new ThreeMeshUI.Text( {
		content: 'This library supports line-break-friendly-characters,',
		fontSize: 0.055
	} ),

	new ThreeMeshUI.Text( {
		content: ' As well as multi-font-size lines with consistent vertical spacing.',
		fontSize: 0.08
	} )
);

//

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