
import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';

import FontJSON from '../assets/Roboto-msdf.json';
import FontImage from '../assets/Roboto-msdf.png';

//

const container = new ThreeMeshUI.Block( {
	width: 1.2,
	height: 0.5,
	padding: 0.05,
	justifyContent: 'center',
	textAlign: 'left',
	fontFamily: FontJSON,
	fontTexture: FontImage
} );


container.position.set( 0, 1, -1.8 );
container.rotation.x = -0.55;

//

container.add(
	new ThreeMeshUI.Text( {
		content: 'This library supports line-break-friendly-characters,',
		fontSize: 0.055
	} ),

	new ThreeMeshUI.Text( {
		content: ' As well as multi-font-size lines with consistent vertical spacing.',
		fontSize: 0.08
	} )
);



export default container