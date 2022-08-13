
import * as THREE from 'three';

//

export default function PuzzlePiece( model ) {

	const piece = new THREE.Group();
	piece.origModel = model;
	piece.bgModel1 = model.clone();
	piece.bgModel2 = model.clone();

	piece.add( piece.origModel, piece.bgModel1, piece.bgModel2 );

	piece.bbox = new THREE.Box3();
	
	piece.computeBBOX = function () {
		this.bbox.setFromObject( this, true );
	}

	return piece

}