
import * as THREE from 'three';

//

const PIECE_BACK_COLOR = new THREE.Color( 0x8c8c8c );

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
		offset = normalize( offset ) * 0.01;

		vUv = uv;
		vNormal = normalMatrix * norm;
		vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		vPos.z += 0.01;
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


		/*
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
		*/

		const vert = `
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
		`;

		const frag = `
			varying vec2 vUv;

			uniform float bla;

			void main() {
				gl_FragColor = vec4( vUv, 1.0, 1.0 );
			}
		`;

		const uni = {
			bla: { value: 0.0 }
		};

		const shaderMat = new THREE.ShaderMaterial({
			vertexShader: vert,
			fragmentShader: frag,
			uniforms: uni,
			side: THREE.DoubleSide
		} );

		piece.origModel.material = shaderMat

		// setup material for the piece outline

		piece.bgModel1.material = outlineMaterial;
		piece.bgModel2.material = outlineMaterial.clone();

		piece.bgModel2.material.uniforms.invertNormals.value = false;
		piece.bgModel2.material.uniformsNeedUpdate = true;

		piece.bgModel1.visible = false;
		piece.bgModel2.visible = false;

	} );

}

//

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