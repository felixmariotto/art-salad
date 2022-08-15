
import * as THREE from 'three';
import materials from './materials.js';

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

	this.puzzle.parts.forEach( part => {

		materials.setHighlightShader( part, false );

	} );

	this.controllers.forEach( ( controller, i, controllers ) => {

		const intersects = controller.intersectController();

		if ( intersects.length ) {

			const isNotFree = controllers.find( val => intersects[0] == val.grippedPart );

			if ( !isNotFree ) materials.setHighlightShader( intersects[0], true );

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

		// before to attach the part to this controller, we must make sure that
		// the selected part is not gripped by another controller.
		// if so, we don't grip.

		const isNotFree = this.controls.controllers.find( c => c.grippedPart == intersects[0] );

		if ( isNotFree ) return

		//

		this.grippedPart = intersects[0];

		this.attach( this.grippedPart );

	}

}

function release() {

	if ( this.grippedPart ) {

		this.controls.puzzle.group.attach( this.grippedPart );

		this.grippedPart.computeBBOX();

		this.grippedPart = null;

	}

}

//

function intersectController() {

	const intersects = [];

	if ( !this.controls.puzzle ) return intersects;
	
	this.controls.puzzle.parts.forEach( part => {

		const dist = part.distanceToController( this, HAND_RADIUS );

		if ( dist < HAND_RADIUS ) {

			intersects.push( part );

		}

	} );

	return intersects;

}

//

export default Controls