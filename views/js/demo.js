const SCREENSHOT_INTERVAL = 5; // seconds
const SCREENSHOT_WIDTH = 640;

let fn = () => {
	const video = document.querySelector('video');
	const canvas = document.createElement('canvas');

	navigator.mediaDevices.getUserMedia({ video: true})
		.then((stream) => {video.srcObject = stream});

	const takeScreenshot = () => {
		canvas.width = SCREENSHOT_WIDTH;
		canvas.height = video.videoHeight / video.videoWidth * SCREENSHOT_WIDTH;
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL();

	}

	setTimeout(() => {
		let img = takeScreenshot();
		fetch('/face/sample', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ img })
		}).then(() => console.log("Sent screenshot!"));
	}, SCREENSHOT_INTERVAL * 1000);
};

document.addEventListener('DOMContentLoaded', fn, false);