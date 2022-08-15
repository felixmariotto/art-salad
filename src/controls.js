
import * as THREE from 'three';

//

const HAND_RADIUS = 0.1;

//

function Controls( renderer ) {

	const controls = {
		controllers: [],
		group: new THREE.Group(),
		update,
		lookForHighlights,
		setPuzzle
	}

	function update() {

		controls.lookForHighlights();

	}

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( controls, renderer, i );

		controls.group.add( controls.controllers[i] );

	}

	return controls

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

function lookForHighlights() {

	this.controllers.forEach( ( controller, i ) => {

		// this.puzzle.highlightPiece( null );

		const intersects = controller.intersectController();

		if ( intersects.length ) {

			this.puzzle.highlightPiece( intersects[0] );

		}

	} );

}

//

function Controller( controls, renderer, i ) {

	const controller = renderer.xr.getControllerGrip( i );
	controller.grip = grip;
	controller.release = release;
	controller.intersectController = intersectController;
	controller.controls = controls;

	controller.add( Hand() );

	controller.addEventListener( 'selectstart', (e) => {

		console.log( 'selectstart');

	} );

	controller.addEventListener( 'selectend', (e) => {

		console.log( 'selectend');

	} );

	controller.addEventListener( 'squeezestart', (e) => {

		controller.grip();

	} );

	controller.addEventListener( 'squeezeend', (e) => {

		controller.release();

	} );

	controller.addEventListener( 'connected', (e) => {

		console.log( 'setup source', e.data );

	} );

	controller.addEventListener( 'disconnected', () => {

		console.log('remove source')

	} );

	return controller

}

//

function grip() {

	const intersects = this.intersectController();

	if ( intersects.length > 0 ) {

		this.grippedPiece = intersects[0];

		this.attach( this.grippedPiece );

		this.controls.puzzle.highlightPiece( null );

	}

}

function release() {

	if ( this.grippedPiece ) {

		this.controls.puzzle.group.attach( this.grippedPiece );

		this.grippedPiece.computeBBOX();

		this.grippedPiece = null;

	}

}

//

function intersectController() {

	const intersects = [];

	if ( !this.controls.puzzle ) return intersects;
	
	this.controls.puzzle.pieces.forEach( piece => {

		// we first check intersection with the bouding box because it's less costly

		if ( piece.bbox.distanceToPoint( this.position ) < HAND_RADIUS ) {

			// then here we look for real intersection

			const dist = piece.distanceToPoint( this.position );

			if ( dist < HAND_RADIUS ) {

				intersects.push( piece );

			}

		}

	} );

	return intersects;

}

//

export default Controls