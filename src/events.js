
/*
used everywhere in the library to transmit events across modules.
*/

//

const domElement = document.createElement('DIV');

//

function on( eventName, callback ) {

	domElement.addEventListener( eventName, callback );

}

//

function remove( eventName, callback ) {

	domElement.removeEventListener( eventName, callback );

}

//

function emit( eventName, detail ) {

	// create and dispatch the event

	const event = new CustomEvent( eventName, { detail } );

	domElement.dispatchEvent( event );

}

//

export default {
	on,
	remove,
	emit
}
