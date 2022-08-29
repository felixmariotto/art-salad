
/*
This is a copy paste of https://github.com/mrdoob/three.js/blob/dev/examples/jsm/webxr/VRButton.js
With some changes regarding the button element CSS.
*/

class VRButton {

	static createButton( renderer ) {

		const button = document.createElement( 'button' );

		function showEnterVR( /*device*/ ) {

			let currentSession = null;

			async function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				await renderer.xr.setSession( session );
				button.textContent = 'EXIT VR';

				currentSession = session;

			}

			function onSessionEnded( /*event*/ ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				button.textContent = 'ENTER VR';

				currentSession = null;

			}

			//

			button.style.display = '';

			button.style.cursor = 'pointer';

			button.textContent = 'ENTER VR';

			button.onmouseenter = function () {

				button.style.opacity = '1.0';

			};

			button.onmouseleave = function () {

				button.style.opacity = '0.5';

			};

			button.onclick = function () {

				if ( currentSession === null ) {

					// WebXR's requestReferenceSpace only works if the corresponding feature
					// was requested at session creation time. For simplicity, just ask for
					// the interesting ones as optional features, but be aware that the
					// requestReferenceSpace call will fail if it turns out to be unavailable.
					// ('local' is always available for immersive sessions and doesn't need to
					// be requested separately.)

					const sessionInit = { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking', 'layers' ] };
					navigator.xr.requestSession( 'immersive-vr', sessionInit ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

			};

		}

		function disableButton() {

			button.style.display = '';

			button.style.cursor = 'auto';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

		}

		function showWebXRNotFound() {

			disableButton();

			button.textContent = 'VR NOT SUPPORTED ON THIS DEVICE';

		}

		function showVRNotAllowed( exception ) {

			disableButton();

			console.warn( 'Exception when trying to call xr.isSessionSupported', exception );

			button.textContent = 'VR NOT ALLOWED ON THIS DEVICE';

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.top = '20px';
			element.style.padding = '12px 20px';
			element.style.border = '3px solid #104529';
			element.style.borderRadius = '4px';
			element.style.background = '#a9d4bd';
			element.style.color = '#104529';
			element.style.font = 'normal 18px sans-serif';
			element.style.fontWeight = '600';
			element.style.textAlign = 'center';
			element.style.opacity = '0.8';
			element.style.outline = 'none';
			element.style.zIndex = '999';
			element.style.left = '50%';
			element.style.transform = 'translateX(-50%)';

		}

		function styleNoVR( element ) {

			element.style.border = '3px solid #591212';
			element.style.color = '#591212';
			element.style.background = '#d98d8d';

		}

		if ( 'xr' in navigator ) {

			button.id = 'VRButton';
			button.style.display = 'none';

			stylizeElement( button );

			navigator.xr.isSessionSupported( 'immersive-vr' ).then( function ( supported ) {

				supported ? showEnterVR() : showWebXRNotFound();

				if ( supported && VRButton.xrSessionIsGranted ) {

					button.click();

				}

				if ( !supported ) styleNoVR( button );

			} ).catch( showVRNotAllowed );

			return button;

		} else {

			styleNoVR( button );

			const message = document.createElement( 'a' );

			if ( window.isSecureContext === false ) {

				message.href = document.location.href.replace( /^http:/, 'https:' );
				message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

			} else {

				message.href = 'https://immersiveweb.dev/';
				message.innerHTML = 'WEBXR NOT AVAILABLE ON THIS DEVICE';

			}

			message.style.textDecoration = 'none';

			stylizeElement( message );

			return message;

		}

	}

	static xrSessionIsGranted = false;

	static registerSessionGrantedListener() {

		if ( 'xr' in navigator ) {

			// WebXRViewer (based on Firefox) has a bug where addEventListener
			// throws a silent exception and aborts execution entirely.
			if ( /WebXRViewer\//i.test( navigator.userAgent ) ) return;

			navigator.xr.addEventListener( 'sessiongranted', () => {

				VRButton.xrSessionIsGranted = true;

			} );

		}

	}

}

VRButton.registerSessionGrantedListener();

export { VRButton };