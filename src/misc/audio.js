
import * as THREE from 'three';

import { camera, scene, loopCallbacks } from './init.js';
import events from './events.js';
import controls from '../controls/controls.js';

import lightTapURL from '../../assets/sounds/Minimalist1.mp3';
import strongTagURL from '../../assets/sounds/Minimalist7.mp3';
import mergeURL from '../../assets/sounds/Minimalist10.mp3';

//

const audio = { init };

let controller0Audio, controller1Audio;

const buffers = {};

const audioLoader = new THREE.AudioLoader();

loadBuffer( 'lightTap', lightTapURL );
loadBuffer( 'strongTap', strongTagURL );
loadBuffer( 'merge', mergeURL );

function loadBuffer( name, URL ) {

	audioLoader.load( URL, buffer => {

		buffers[ name ] = buffer;

	} );

}

//

function init() {

	const listener = new THREE.AudioListener();
	camera.add( listener );

	controller0Audio = new THREE.PositionalAudio( listener );
	controller1Audio = new THREE.PositionalAudio( listener );
	scene.add( controller0Audio, controller1Audio );
	
	

}

//

function update() {

	if ( controller0Audio ) {

		controller0Audio.position.copy( controls.controllers[0].position );

	}

	if ( controller1Audio ) {

		controller1Audio.position.copy( controls.controllers[1].position );

	}

}

loopCallbacks.push( update );

//

function playControllerSound( soundName, controllerID ) {

	const audio = controllerID ? controller1Audio : controller0Audio;

	if ( audio ) {

		if ( audio.isPlaying ) audio.stop();

		audio.setBuffer( buffers[ soundName ] );

		switch ( soundName ) {

			case 'lightTap': audio.setVolume( 0.5 ); break
			case 'strongTap': audio.setVolume( 1.0 ); break
			case 'merge': audio.setVolume( 1.0 ); break

		}

		audio.play();

	}

}

//

events.on( 'new-highlight', e => playControllerSound( 'lightTap', e.detail.serial ) );
events.on( 'grip-part', e => playControllerSound( 'strongTap', e.detail.serial ) );
events.on( 'parts-assembled', e => playControllerSound( 'merge', 0 ) );

//

export default audio
