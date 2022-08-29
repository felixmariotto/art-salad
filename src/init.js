
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import files from './files.js';

/* Create the container object, the scene */

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xc7c7c7 );

/* Create the camera from which the scene will be seen */

const width = window.innerWidth;
const height = window.innerHeight;

var camera = new THREE.PerspectiveCamera( 75, width/height, 0.005, 50 );
camera.position.set( 0, 1.6, 0 );
camera.lookAt( 0, 1, -1.8 );

/* Create the renderer object, with VR parameters enabled */

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.xr.enabled = true;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild( renderer.domElement );

window.onresize = function () {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

};

/*
renderer.xr.addEventListener( 'sessionend', () => {

	console.log('end')

} );
*/

/* Render loop (called ~60 times/second, or more in VR) */

const loopCallbacks = [];

renderer.setAnimationLoop( loop );

let lastTime = 0;

function loop( elapsedTime ) {

	const delta = Math.min( elapsedTime - lastTime, 100 );
	lastTime = elapsedTime;
	const frameSpeed = ( 1000 / 60 ) / delta

	// stir a bit the camera before the VR session, so users can understand that they are
	// looking at a 3D scene.

	if ( !renderer.xr.isPresenting ) {

		camera.position.set( 0, 1.5, 0 );

		camera.lookAt(
			0.35 * Math.sin( elapsedTime * 0.00025 ),
			1.5 + 0.07 * Math.sin( elapsedTime * 0.0007 ),
			-5
		)

	}

	//

	renderer.render( scene, camera );

	loopCallbacks.forEach( fn => fn( frameSpeed ) );

	ThreeMeshUI.update();

};

//

export { scene }
export { camera }
export { renderer }
export { loopCallbacks }
export default { scene, camera, renderer, loopCallbacks }