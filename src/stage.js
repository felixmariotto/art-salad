
/* module responsible for creating and fetching all the scene background decorations */

import * as THREE from 'three';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';

//

const stageGroup = new THREE.Group();

const room = new THREE.LineSegments(
	new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
	new THREE.LineBasicMaterial( { color: 0x808080 } )
);

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );

stageGroup.add( room, light, directionalLight );

//

export default stageGroup