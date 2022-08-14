
import * as THREE from 'three';

//

const HAND_RADIUS = 0.1;

//

function Controls( renderer ) {

	const controls = {
		grippedPiece: null,
		controllers: [],
		group: new THREE.Group(),
		update,
		lookForHighlights,
		intersectController,
		setPuzzle,
		grip,
		release
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

function Controller( controls, renderer, i ) {

	const controller = renderer.xr.getControllerGrip( i );

	controller.add( Hand() );

	controller.addEventListener( 'selectstart', (e) => {

		console.log( 'selectstart');

	} );

	controller.addEventListener( 'selectend', (e) => {

		console.log( 'selectend');

	} );

	controller.addEventListener( 'squeezestart', (e) => {

		controls.grip( i );

	} );

	controller.addEventListener( 'squeezeend', (e) => {

		controls.release();

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

	if ( this.grippedPiece ) return

	let noneHighlighted = true;

	this.controllers.forEach( ( controller, i ) => {

		const intersects = this.intersectController( i );

		if ( intersects.length ) {

			this.puzzle.highlightPiece( intersects[0] );

			noneHighlighted = false;

		}

	} );

	if ( noneHighlighted ) this.puzzle.highlightPiece( null );

}

//

function grip( i ) {

	const intersects = this.intersectController( i );

	if ( intersects.length > 0 ) {

		this.grippedPiece = intersects[0];

		this.controllers[i].attach( this.grippedPiece );

		this.puzzle.highlightPiece( null );

	}

}

function release() {

	this.puzzle.group.attach( this.grippedPiece );

	this.grippedPiece.computeBBOX();

	this.grippedPiece = null;

	// we have to recompute the piece bbox

}

//

function intersectController( i ) {

	const controller = this.controllers[i];
	const intersects = [];

	if ( !this.puzzle ) return intersects;
	
	this.puzzle.pieces.forEach( piece => {

		// we first check intersection with the bouding box because it's less costly

		if ( piece.bbox.distanceToPoint( controller.position ) < HAND_RADIUS ) {

			// then here we look for real intersection

			const dist = piece.distanceToPoint( controller.position );

			if ( dist < HAND_RADIUS ) {

				intersects.push( piece );

			}

		}

	} );

	return intersects;

}

//

export default Controls