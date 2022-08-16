
import * as THREE from 'three';
import materials from './materials.js';
import controllerAssets from './controllerAssets.js';

//

const HAND_RADIUS = 0.1;
const matrix4 = new THREE.Matrix4();
const raycaster = new THREE.Raycaster();

//

function Controls( renderer ) {

	const controls = {
		controllers: [],
		group: new THREE.Group(),
		update,
		highlightHandIntersects,
		highlightRayIntersects,
		setPuzzle
	}

	function update() {

		if ( controls.puzzle ) {

			// reset highlights before to highlights again if necessary right after

			controls.puzzle.parts.forEach( part => {

				materials.setHighlightShader( part, false );

			} );

			// look for for intersections

			controls.highlightRayIntersects();

			controls.highlightHandIntersects();

		}


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

function highlightRayIntersects() {

	this.controllers.forEach( controller => {

		matrix4.identity().extractRotation( controller.raySpace.matrixWorld );

		raycaster.ray.origin.setFromMatrixPosition( controller.raySpace.matrixWorld );
		raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( matrix4 );

		const intersects = [];

		this.puzzle.group.traverse( child => {

			if ( child.isPiece ) {

				child.origModel.raycast( raycaster, intersects );

			}

		} );

		if ( intersects.length ) {

			intersects.sort( (a, b) => {

				return a.distance - b.distance

			} );

			controller.setPointerAt( intersects[0].point );

			intersects[0].object.traverseAncestors( ancestor => {

				if ( ancestor.isPart ) {

					const isNotFree = this.controllers.find( val => ancestor == val.grippedPart );

					if ( !isNotFree ) materials.setHighlightShader( ancestor, true );

				}

			} );

		}

	} );

}

//

function highlightHandIntersects() {

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
	controller.setRayMode = setRayMode;
	controller.setPointerAt = setPointerAt;
	controller.controls = controls;

	const raySpace = renderer.xr.getController( i );
	controller.raySpace = raySpace;

	controller.ray = controllerAssets.linesHelper.clone();
	controller.point = controllerAssets.pointer.clone();
	raySpace.add( controller.ray, controller.point );

	controller.setRayMode( false );

	controller.add( Hand() );

	controller.addEventListener( 'selectstart', (e) => {

		controller.setRayMode( true );

	} );

	controller.addEventListener( 'selectend', (e) => {

		controller.setRayMode( false );

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

function setRayMode( visiblity ) {

	this.ray.visible = visiblity;
	this.point.visible = visiblity;

}

//

function setPointerAt( vec ) {

	const localVec = this.raySpace.worldToLocal( vec );

	this.point.position.copy( localVec );
	this.point.visible = true;

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