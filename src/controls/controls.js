
/*
Module responsible for creating the hand controllers.
It is in this module that we look for intersection with puzzle pieces or user interface,
and trigger updates if necessary.
*/

import * as THREE from 'three';

import { scene, renderer, loopCallbacks } from '../misc/init.js';
import events from '../misc/events.js';
import materials from '../puzzles/materials.js';
import controllerAssets from './controllerAssets.js';
import UI from '../UI.js';

//

// the "hand" is actually a sphere, this constant is the sphere radius.
const HAND_RADIUS = 0.07;

// speed at which a piece moves toward or away of the hand when joystick input.
const TELEKINESIS_SPEED = 0.02;

const vec3 = new THREE.Vector3();
const matrix4 = new THREE.Matrix4();
const raycaster = new THREE.Raycaster();

//

const controls = Controls( renderer );
scene.add( controls.group );
loopCallbacks.push( controls.update );

function Controls( renderer ) {

	const controls = {
		controllers: [],
		// hand meshes are not directly added into the scene, but un this group.
		group: new THREE.Group(),
		update,
		_update,
		setPuzzle
	}

	// necessary to have this function because it's called in another module where
	// it's not called as controls method.

	function update( f ) { controls._update( f ) }

	// create one controller for each hand.

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( controls, renderer, i );

		controls.group.add( controls.controllers[i], controls.controllers[i].raySpace );

	}

	return controls

}

// Update function. The framspeed argument is a number representing the real speed of rendering
// compared to the wanted speed of rendering :
// If the app runs at 30FPS, frameSpeed will be 2, because when want to update animations twice as fast.

function _update( frameSpeed ) {

	this.controllers.forEach( controller => {

		controller.point.visible = false;

	} );

	if ( this.puzzle ) {

		// disable highlight meshes before to enable them again if necessary right after

		this.puzzle.parts.forEach( part => {

			materials.setHighlightShader( part, false );

		} );

		this.controllers.forEach( controller => {

			controller.highlighted = null;

		} );

		//

		this.controllers.forEach( controller => {

			// look for for parts to highlight depending on the controller position

			if ( !controller.grippedPart ) {

				if ( controller.isRayEnabled && controller.gamepad ) {

					controller.highlightRayIntersects();

				} else {

					controller.highlightHandIntersects();

				}

			}

			// here we check if the user is pressing the joystick to attract or move away a puzzle part.

			if (
				controller.grippedPart &&
				controller.gamepad.axes &&
				Math.abs( controller.gamepad.axes[3] ) > 0.5
			) {

				const direction = Math.sign( controller.gamepad.axes[3] );

				controller.raySpace.attach( controller.grippedPart );

				controller.grippedPart.position.z += direction * TELEKINESIS_SPEED * frameSpeed;

				controller.attach( controller.grippedPart );

			}

		} );

		// set each controller ray's visibility depending on wether the user is pressing
		// the ray input.

		this.controllers.forEach( controller => {

			if (
				!controller.grippedPart &&
				controller.isRayEnabled &&
				controller.gamepad
			) {

				controller.ray.visible = true;

			} else {

				controller.ray.visible = false;
				controller.point.visible = false;

			}

		} );

		// if the user grips at least one part, we tell the puzzle to check for
		// possible parts merging.

		const grippingC = this.controllers.find( c => c.grippedPart );

		if ( grippingC ) this.puzzle.findPossibleMerging( grippingC.grippedPart );

	}

	// Intersection test with user interface.
	// It happens even when there is no puzzle.

	this.controllers.forEach( controller => {

		if ( !this.puzzle ) controller.ray.visible = false;

		matrix4.identity().extractRotation( controller.raySpace.matrixWorld );
		raycaster.ray.origin.setFromMatrixPosition( controller.raySpace.matrixWorld );
		raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( matrix4 );

		controller.intersect = UI.findIntersection( raycaster );

		if ( controller.intersect ) {

			// This event is listened by the UI module

			events.emit( 'hovered-ui', {
				controller,
				element: controller.intersect.element
			} );

			controller.ray.visible = true;
			controller.point.visible = true;

			controller.raySpace.worldToLocal( controller.intersect.point );

			controller.point.position.copy( controller.intersect.point );

		}

	} );

}

// this is how this module is informed that a new puzzle is started.
// If there was a previous puzzle, it overwrites it.

function setPuzzle( puzzle ) {

	this.puzzle = puzzle;

	this.controllers.forEach( controller => {

		if ( controller.grippedPart && controller.grippedPart.parent ) {

			controller.grippedPart.parent.remove( controller.grippedPart );

		}

		controller.grippedPart = null;

	} );

}

// Controller class.
// It holds information about the puzzle parts it is intersecting, the part it is gripping,
// and has its own methods so that the player can use both controller independently, like
// gripping one puzzle part in each hand, releasing one, etc..

function Controller( controls, renderer, i ) {

	const controller = renderer.xr.getControllerGrip( i );
	controller.highlightRayIntersects = highlightRayIntersects;
	controller.highlightHandIntersects = highlightHandIntersects;
	controller.setupSource = setupSource;
	controller.grip = grip;
	controller.release = release;
	controller.controls = controls;

	const raySpace = renderer.xr.getController( i );
	controller.raySpace = raySpace;

	controller.ray = controllerAssets.linesHelper.clone();
	controller.point = controllerAssets.pointer.clone();
	raySpace.add( controller.ray, controller.point );

	controller.isRayEnabled = false;

	controller.add( controllerAssets.Hand( HAND_RADIUS ) );

	controller.addEventListener( 'selectstart', (e) => {

		controller.isRayEnabled = true;

		if ( controller.intersect ) {

			events.emit( 'clicked-ui', {
				controller,
				element: controller.intersect.element
			} );

		}

	} );

	controller.addEventListener( 'selectend', (e) => {

		controller.isRayEnabled = false;

	} );

	controller.addEventListener( 'squeezestart', (e) => {

		controller.grip();

	} );

	controller.addEventListener( 'squeezeend', (e) => {

		controller.release();

	} );

	controller.addEventListener( 'connected', (e) => {

		controller.setupSource( e.data );

	} );

	// TODO: handle case when the user was gripping a piece and their controller runs out of battery.
	// In this case three.js will automatically remove the controller from the scene, along with its
	// children, which is to say the gripped piece.
	// It's not ultra important since our controller object still exists, and when the user release the
	// grip button, .release() will be called normally. But still this is weird to see the part disappear
	// temporarily.

	controller.addEventListener( 'disconnected', () => {

		//

	} );

	return controller

}

// Traverse the puzzle scene to look for an intersection with the controller ray.
// If found, we tell the materials module to enable the highlight meshes.

function highlightRayIntersects() {

	if ( !this.isRayEnabled ) return

	matrix4.identity().extractRotation( this.raySpace.matrixWorld );
	raycaster.ray.origin.setFromMatrixPosition( this.raySpace.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( matrix4 );

	const intersects = [];

	this.controls.puzzle.group.traverse( child => {

		// To improve performance, we start by intersecting the bounding box of each piece.
		// A real intersection test is only perform if necessary.

		if ( child.isPiece && raycaster.ray.intersectsBox( child.bbox ) ) {

			child.origModel.raycast( raycaster, intersects );

		}

	} );

	if ( intersects.length ) {

		// we want to highlight only the closest part

		intersects.sort( (a, b) => {

			return a.distance - b.distance

		} );

		// set point position

		const localVec = this.raySpace.worldToLocal( intersects[0].point );

		this.point.position.copy( localVec );

		this.point.visible = true;

		// highlight part

		intersects[0].object.traverseAncestors( ancestor => {

			if ( ancestor.isPart ) {

				const isNotFree = this.controls.controllers.find( val => ancestor == val.grippedPart );

				if ( !isNotFree ) materials.setHighlightShader( ancestor, true );

				this.highlighted = ancestor;

			}

		} );

	}

}

// Like highlightRayIntersects, this function also finds intersection to set highlighted pieces.
// However is does it by finding intersection with the hand sphere, not the controller ray.

function highlightHandIntersects() {

	const intersects = [];

	if ( !this.controls.puzzle ) return intersects;
	
	this.controls.puzzle.parts.forEach( part => {

		const dist = part.distanceToController( this, HAND_RADIUS );

		if ( dist < HAND_RADIUS ) {

			intersects.push( { part, dist } );

		}

	} );

	if ( intersects.length ) {

		// Sort the intersected part so the part closest to the hand center is picked

		const part = intersects.sort( ( a, b ) => a.dist - b.dist )[0].part;

		// Highlight the intersected part if it's not gripped by a controller

		const isNotFree = this.controls.controllers.find( val => part == val.grippedPart );

		if ( !isNotFree ) {

			materials.setHighlightShader( part, true );

			this.highlighted = part;

		}

	}

}

// we keep a reference to the gamepad because it will be useful when the user
// will want to attract a puzzle part to them using the joystick.

function setupSource( inputSource ) {

	this.inputSource = inputSource;

	this.gamepad = inputSource.gamepad;

	this.handedness = inputSource.handedness;

}

// Gripping is done by moving the part from the scene to the controller space.

function grip() {

	this.traverse( child => {

		if ( child.isHand ) {

			child.scale.setScalar( 0.85 );

			child.material.uniforms.alpha.value = 0.5;

		}

	} );

	if ( this.highlighted ) {

		this.grippedPart = this.highlighted;

		this.attach( this.grippedPart );

	}

}

// Releasing is done by moving the part from the controller to the scene space.

function release() {

	this.traverse( child => {

		if ( child.isHand ) {

			child.scale.setScalar( 1.0 );

			child.material.uniforms.alpha.value = 1.0;

		}

	} );

	if ( this.grippedPart ) {

		this.controls.puzzle.group.attach( this.grippedPart );

		this.grippedPart.computeChildrenBBOX();

		this.grippedPart = null;

	}

}

//

export default controls
