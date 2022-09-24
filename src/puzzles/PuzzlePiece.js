
/*
A puzzle piece is the representation of the puzzle piece actual mesh.
This puzzle piece is never handled directly by controls, instead puzzle pieces
are put into puzzle parts ( see PuzzlePart module ).
*/

import * as THREE from 'three';

//

const vec3 = new THREE.Vector3();

//

export default function PuzzlePiece( model ) {

	const piece = new THREE.Group();
	piece.isPiece = true;
	piece.origModel = model;
	// each piece must have two clones with a special material to render an outline.
	piece.bgModel1 = model.clone();
	piece.bgModel2 = model.clone();

	piece.add( piece.origModel, piece.bgModel1, piece.bgModel2 );

	piece.bbox = new THREE.Box3();

	piece.computeBBOX = computeBBOX;
	piece.distanceToPoint = distanceToPoint;
	piece.getAveragedNormal = getAveragedNormal;

	return piece

}

//

function computeBBOX() {

	this.bbox.setFromObject( this, true );
	
}

// Used by the controls module to know if a piece is interacted with.
// For instance to highlight it, or to grip it.

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

// Used to rotate the piece toward the user on puzzle startup

const FACES_TO_SAMPLES = 15;
const triangle = new THREE.Triangle();
const indices = new THREE.Vector3();

function getAveragedNormal( targetVec ) {

	const geometry = this.origModel.geometry;

	const facesCount = geometry.index.count / 3;
	const facesToSamples = Math.min( FACES_TO_SAMPLES, facesCount );

	for ( let i = 0 ; i < facesToSamples ; i++ ) {

		const faceIndex = Math.floor( facesCount * ( i / facesToSamples ) );

		indices.fromArray( geometry.index.array, faceIndex * 3 );

		triangle.setFromAttributeAndIndices(
			geometry.attributes.position,
			indices.x,
			indices.y,
			indices.z
		);

		triangle.getNormal( vec3 );
		targetVec.add( vec3 );

	}

	targetVec.normalize();

}
