
import { scene, renderer } from './init.js';
import { room } from './stage.js';
import Controls from './controls.js';

scene.add( room );
const controls = Controls( renderer );
scene.add( controls.group );