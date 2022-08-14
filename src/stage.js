
/* module responsible for creating and fetching all the scene background decorations */

import * as THREE from 'three';
import files from './files.js';

//

const stageGroup = new THREE.Group();

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

// stageGroup.add( light, directionalLight );

files.museumModel.then( model => {

	stageGroup.add( model );

} );

//

export default stageGroup