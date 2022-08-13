
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
		intersectController,
		setPuzzle,
		grip
	}

	function update() {

		controls.lookForHighlights();

	}

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( controls, renderer, i );

		controls.group.add( controls.controllers[i].group );

	}

	return controls

}

//

function Controller( controls, renderer, i ) {

	const controller = {
		type: "controller",
		index: i,
		group: renderer.xr.getControllerGrip( i )
	}

	controller.group.add( Hand() );

	controller.group.addEventListener( 'selectstart', (e) => {

		console.log( 'selectstart');

	} );

	controller.group.addEventListener( 'selectend', (e) => {

		console.log( 'selectend');

	} );

	controller.group.addEventListener( 'squeezestart', (e) => {

		controls.grip( i );

	} );

	controller.group.addEventListener( 'squeezeend', (e) => {

		console.log( 'squeezeend');

	} );

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

function lookForHighlights() {

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

	console.log( intersects );

}

//

function intersectController( i ) {

	const controller = this.controllers[i];
	const intersects = [];

	if ( !this.puzzle ) return intersects;
	
	this.puzzle.pieces.forEach( piece => {

		if ( piece.bbox.distanceToPoint( controller.group.position ) < HAND_RADIUS ) {

			intersects.push( piece );

		}

	} );

	return intersects;

}

//

export default Controls