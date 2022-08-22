
import * as THREE from 'three';

//

onmessage = function( e ) {

	console.log( 'grgreger', e.data );

	postMessage( { warning: 'missing-uv' } );

}