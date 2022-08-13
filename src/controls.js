
import * as THREE from 'three';

//

function Controls( renderer ) {

	const controls = {
		controllers: [],
		group: new THREE.Group()
	}

	for ( let i=0 ; i<2 ; i++ ) {

		controls.controllers[i] = Controller( renderer, i );
		controls.group.add( controls.controllers[i].group );

	}

	return controls

}

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

function Hand() {
	const material = new THREE.MeshPhongMaterial({
		transparent: true,
		opacity: 0.5
	});
	const geometry = new THREE.IcosahedronGeometry( 0.1, 5 );
	return new THREE.Mesh( geometry, material );
}

//

export default Controls