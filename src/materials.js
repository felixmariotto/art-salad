
import * as THREE from 'three';

//

const PIECE_BACK_COLOR = new THREE.Color( 0x5c5c5c );

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

		// make background of original piece grey.

		piece.origModel.material.onBeforeCompile = function ( shader ) {

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

function setSelectedShader( puzzlePiece, value ) {

	puzzlePiece.bgModel1.visible = value;
	puzzlePiece.bgModel2.visible = value;

}

//

export default {
	initPuzzle,
	setSelectedShader
}