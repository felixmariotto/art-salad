
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
	const material = new THREE.MeshNormalMaterial();
	const geometry = new THREE.SphereGeometry( 0.1 );
	return new THREE.Mesh( geometry, material );
}

//

export default Controls