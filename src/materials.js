
import * as THREE from 'three';

//

const PIECE_BACK_COLOR = new THREE.Color( 0x5c5c5c );

function makeBackgroundGrey( puzzleModel ) {

	puzzleModel.traverse( obj => {

		if ( obj.material ) {

			obj.material.onBeforeCompile = function ( shader ) {

				shader.uniforms.backgroundColor = { value: PIECE_BACK_COLOR };

				shader.fragmentShader = shader.fragmentShader.replace( 'uniform vec3 diffuse;', `
					uniform vec3 backgroundColor;
					uniform vec3 diffuse;
				`);

				shader.fragmentShader = shader.fragmentShader.replace( 'gl_FragColor = vec4( outgoingLight, diffuseColor.a );', `
					if ( gl_FrontFacing ) {
						gl_FragColor = vec4( outgoingLight, diffuseColor.a );
					} else {
						gl_FragColor = vec4( backgroundColor, 1.0 );
					}
				`);

			};

		}

	} );

}

export default {
	makeBackgroundGrey
}