
/*
Module responsible for setting the white outline around pieces.
At the moment it is done in a pretty slapdash, by creating two clone meshes for each
puzzle piece, and assigning a special material to each of those.
This material only offset the mesh normal and renders full white.
It doesn't look great at all, but it was fast to setup.

This should be refactored in favor of a postprocessing solution, like one of the
three last solutions explained in this article: https://alexanderameye.github.io/notes/rendering-outlines/
*/

import * as THREE from 'three';

//

const PIECE_BACK_COLOR = new THREE.Color( 0xb5b5b5 );

const outlineVertex = `
	varying vec4 vPos;
	varying vec3 vNormal;
	varying vec2 vUv;
	uniform bool invertNormals;

	void main() {

		vec3 norm = normalMatrix * normal;
		if ( invertNormals ) {
			norm *= -1.0;
		}

		vec2 offset = norm.xy;
		offset = normalize( offset ) * 0.005;

		vUv = uv;
		vNormal = normalMatrix * norm;
		vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		vPos.z += 0.001;
		vPos.x += offset.x;
		vPos.y += offset.y;
		gl_Position = vPos;
	}
`;

const outlineFragment = `
	varying vec4 vPos;
	varying vec3 vNormal;
	varying vec2 vUv;

	void main() {
		gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
	}
`;

const outlineUniforms = {
	invertNormals: { value: true }
};

const outlineMaterial = new THREE.ShaderMaterial({
	vertexShader: outlineVertex,
	fragmentShader: outlineFragment,
	uniforms: outlineUniforms,
	side: THREE.DoubleSide
} );

//

function initPuzzle( puzzle ) {

	puzzle.pieces.forEach( piece => {

		// make background of original piece grey.

		piece.origModel.material.onBeforeCompile = function ( shader ) {

			shader.uniforms.backgroundColor = { value: PIECE_BACK_COLOR };

			shader.fragmentShader = shader.fragmentShader.replace( 'uniform vec3 diffuse;', `
				uniform vec3 backgroundColor;
				uniform vec3 diffuse;
			`);

			shader.fragmentShader = shader.fragmentShader.replace( '}', `
					if ( !gl_FrontFacing ) {
						gl_FragColor = vec4( backgroundColor, 1.0 );
					}
				}
			`);

		};

		// setup material for the two outline meshes

		piece.bgModel1.material = outlineMaterial;
		piece.bgModel2.material = outlineMaterial.clone();

		piece.bgModel2.material.uniforms.invertNormals.value = false;
		piece.bgModel2.material.uniformsNeedUpdate = true;

		piece.bgModel1.visible = false;
		piece.bgModel2.visible = false;

	} );

}

// Called by the controls module when it detects an intersection between a controller and a piece.

function setHighlightShader( puzzlePart, value ) {

	puzzlePart.traverse( child => {

		if ( child.isPiece ) {

			child.bgModel1.visible = value;
			child.bgModel2.visible = value;

		}

	} );

}

//

export default {
	initPuzzle,
	setHighlightShader
}