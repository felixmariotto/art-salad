
import * as THREE from 'three';

//

const vec3 = new THREE.Vector3();

//

export default function PuzzlePiece( model ) {

	const piece = new THREE.Group();
	piece.origModel = model;
	piece.bgModel1 = model.clone();
	piece.bgModel2 = model.clone();

	piece.add( piece.origModel, piece.bgModel1, piece.bgModel2 );

	piece.bbox = new THREE.Box3();

	piece.computeBBOX = computeBBOX;
	piece.distanceToPoint = distanceToPoint;

	return piece

}

//

function computeBBOX() {

	this.bbox.setFromObject( this, true );
	
}

//

function distanceToPoint( targetVec ) {

	let smallestDist = Infinity;

	const posAttrib = this.origModel.geometry.attributes.position;

	this.origModel.updateWorldMatrix( true, false );

	for ( let i=0 ; i<posAttrib.count ; i++ ) {

		vec3.set(
			posAttrib.getX( i ),
			posAttrib.getY( i ),
			posAttrib.getZ( i )
		);

		vec3.applyMatrix4( this.origModel.matrixWorld );

		const dist = vec3.distanceTo( targetVec );

		if ( dist < smallestDist ) smallestDist = dist;

	}

	return smallestDist

}
