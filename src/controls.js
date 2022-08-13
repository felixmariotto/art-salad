
import * as THREE from 'three';

//

const HAND_RADIUS = 0.1;

//

function Controls( renderer ) {

	const controls = {
		controllers: [],
		group: new THREE.Group(),
		update,
		intersectPuzzle,
		setPuzzle
	}

	function update() {

		controls.intersectPuzzle();

	}

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( renderer, i );
		controls.group.add( controls.controllers[i].group );

	}

	return controls

}

//

function Controller( renderer, i ) {

	const controller = {
		type: "controller",
		index: i,
		group: renderer.xr.getControllerGrip( i )
	}

	controller.group.add( Hand() );

	controller.group.addEventListener( 'connected', (e) => {

		console.log( 'setup source', e.data );

	} );

	controller.group.addEventListener( 'disconnected', () => {

		console.log('remove source')

	} );

	return controller

}

//

function Hand() {
	const material = new THREE.MeshPhongMaterial({
		transparent: true,
		opacity: 0.5
	});
	const geometry = new THREE.IcosahedronGeometry( HAND_RADIUS, 5 );
	return new THREE.Mesh( geometry, material );
}

//

function setPuzzle( puzzle ) {

	this.puzzle = puzzle;

}

//

function intersectPuzzle() {

	if ( this.puzzle ) {

		let noneHighlighted = true;

		this.controllers.forEach( controller => {

			this.puzzle.pieces.forEach( piece => {

				if ( piece.bbox.distanceToPoint( controller.group.position ) < HAND_RADIUS ) {

					this.puzzle.highlightPiece( piece );

					noneHighlighted = false;

				}

			} );

		} );

		if ( noneHighlighted ) this.puzzle.highlightPiece( null );

	}

}

//

export default Controls