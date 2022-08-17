
import * as THREE from 'three';
import materials from './materials.js';
import controllerAssets from './controllerAssets.js';

//

const HAND_RADIUS = 0.1;
const TELEKINESIS_SPEED = 0.02;
const vec3 = new THREE.Vector3();
const matrix4 = new THREE.Matrix4();
const raycaster = new THREE.Raycaster();

//

function Controls( renderer ) {

	const controls = {
		controllers: [],
		group: new THREE.Group(),
		update,
		setPuzzle
	}

	function update( frameSpeed ) {

		if ( controls.puzzle ) {

			// reset highlights before to highlights again if necessary right after

			controls.puzzle.parts.forEach( part => {

				materials.setHighlightShader( part, false );

			} );

			controls.controllers.forEach( controller => {

				controller.highlighted = null;

			} );

			//

			controls.controllers.forEach( controller => {

				// look for for parts to highlight depending on the controller position

				if ( controller.isRayEnabled && controller.gamepad ) {

					controller.highlightRayIntersects();

				} else {

					controller.highlightHandIntersects();

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

		}

		// set each controller ray's visibility depending on wether the user is pressing
		// the ray input.

		controls.controllers.forEach( controller => {

			if ( controller.isRayEnabled && controller.gamepad ) {

				controller.ray.visible = true;
				// controller.point.visible is also set in controls.highlightRayIntersects just above

			} else {

				controller.ray.visible = false;
				controller.point.visible = false;

			}

		} );

		// if the user grips at least one part, we tell the puzzle to check for
		// possible parts merging.

		const grippingC = controls.controllers.find( c => c.grippedPart );

		if ( grippingC ) controls.puzzle.findPossibleMerging( grippingC.grippedPart );

	}

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( controls, renderer, i );

		controls.group.add( controls.controllers[i], controls.controllers[i].raySpace );

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

function Controller( controls, renderer, i ) {

	const controller = renderer.xr.getControllerGrip( i );
	controller.highlightRayIntersects = highlightRayIntersects;
	controller.highlightHandIntersects = highlightHandIntersects;
	controller.setupSource = setupSource;
	controller.grip = grip;
	controller.release = release;
	controller.intersectController = intersectController;
	controller.controls = controls;

	const raySpace = renderer.xr.getController( i );
	controller.raySpace = raySpace;

	controller.ray = controllerAssets.linesHelper.clone();
	controller.point = controllerAssets.pointer.clone();
	raySpace.add( controller.ray, controller.point );

	controller.isRayEnabled = false;

	controller.add( Hand() );

	controller.addEventListener( 'selectstart', (e) => {

		controller.isRayEnabled = true;

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

	controller.addEventListener( 'disconnected', () => {

		// console.log('remove source')

	} );

	return controller

}

//

function highlightRayIntersects() {

	if ( !this.isRayEnabled ) return

	matrix4.identity().extractRotation( this.raySpace.matrixWorld );

	raycaster.ray.origin.setFromMatrixPosition( this.raySpace.matrixWorld );
	raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( matrix4 );

	const intersects = [];

	this.controls.puzzle.group.traverse( child => {

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

	} else {

		this.point.visible = false;

	}

}

//

function highlightHandIntersects() {

	const intersects = this.intersectController();

	if ( intersects.length ) {

		const isNotFree = this.controls.controllers.find( val => intersects[0] == val.grippedPart );

		if ( !isNotFree ) {

			materials.setHighlightShader( intersects[0], true );

			this.highlighted = intersects[0];

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

//

function grip() {

	if ( this.highlighted ) {

		/*
		// before to attach the part to this controller, we must make sure that
		// the selected part is not gripped by another controller.
		// if so, we don't grip.

		const isNotFree = this.controls.controllers.find( c => c.grippedPart == this.highlighted );

		if ( isNotFree ) return

		*/

		this.grippedPart = this.highlighted;

		this.attach( this.grippedPart );

	}

}

function release() {

	if ( this.grippedPart ) {

		this.controls.puzzle.group.attach( this.grippedPart );

		this.grippedPart.computeChildrenBBOX();

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