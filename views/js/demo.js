const SCREENSHOT_INTERVAL = 5; // seconds
const SCREENSHOT_WIDTH = 640;

let scores = [];
let requiresEyeglasses = false;
let drivingStart = Date.now();

const DISTRACTED_POSE_ANGLE = 25;
const SAFE_DURATION = 120 * 60 * 1000;
const RISKY_EMOTIONS = ['FEAR', 'SURPRISED', 'ANGRY', 'SAD'];
const aggregateScore = (faceDetails) => {
	let score = {
		time: Date.now(),
		risk: 0,
		distraction: 0
	};

	if (requiresEyeglasses && !faceDetails.Eyeglasses.Value && faceDetails.Eyeglasses.Confidence >= 95) {
		score.risk++;
	}

	for (let i = 0; i < faceDetails.Emotions.length; i++) {
		if (faceDetails.Emotions[i].Confidence >= 90
			&& RISKY_EMOTIONS.indexOf(faceDetails.Emotions[i].Type) !== -1) {
			score.risk++; break;
		}
	}

	score.risk += Math.min((Date.now() - drivingStart) / SAFE_DURATION, 2);
	score.risk /= 4;

	if (faceDetails.Pose.Pitch >= DISTRACTED_POSE_ANGLE
		|| faceDetails.Pose.Roll >= DISTRACTED_POSE_ANGLE
		|| faceDetails.Pose.Yaw >= DISTRACTED_POSE_ANGLE) {
		score.distraction += 2;
	}
	
	if (faceDetails.MouthOpen.Value && faceDetails.MouthOpen.Confidence >= 50) {
		score.distraction++;
	}

	if (!faceDetails.EyesOpen.Value && faceDetails.EyesOpen.Confidence >= 70) {
		score.distraction++;
	}

	score.distraction /= 4;

	return score;
}

let fn = () => {
	const video = document.querySelector('video');
	const canvas = document.createElement('canvas');
	let insightDataStr = window.localStorage.getItem('insights');
	let insightData = insightDataStr? JSON.parse(insightDataStr) : {
		gender: {
			male: 0, female: 0
		},
		emotion: {
			happy: 0,
			disgusted: 0,
			calm: 0,
			angry: 0,
			sad: 0,
			confused: 0,
			fear: 0,
			surprised: 0
		},
		smile: { yes: 0, no: 0 }
	};

	navigator.mediaDevices.getUserMedia({ video: true})
		.then((stream) => {video.srcObject = stream});

	const takeScreenshot = () => {
		canvas.width = SCREENSHOT_WIDTH;
		canvas.height = video.videoHeight / video.videoWidth * SCREENSHOT_WIDTH;
		canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL();

	}

	setInterval(() => {
		let img = takeScreenshot();
		fetch('/face/sample', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ img })
		})
		.then((resp) => resp.json())
		.then((resp) => {
			if (resp.FaceDetails && resp.FaceDetails.length === 1) {
				let score = aggregateScore(resp.FaceDetails[0]);
				console.log(resp.FaceDetails[0]);
				console.log(score);
				let s = {
					...score,
					faceDetails: resp.FaceDetails[0]
				};
				scores.push(s);
				if (typeof window.dataHook == 'function') window.dataHook(s);

				let gender = resp.FaceDetails[0].Gender.Value.toLowerCase();
				let smile = resp.FaceDetails[0].Smile.Value;
				let mood = null;
				let maxConfidence = 0;
				for (let i = 0; i < resp.FaceDetails[0].Emotions.length; i++) {
					let emotion = resp.FaceDetails[0].Emotions[i];
					if (emotion.Confidence > maxConfidence) mood = emotion.Type.toLowerCase();
				}

				insightData.gender[gender]++;
				insightData.smile[smile? 'yes':'no']++;
				insightData.emotion[mood]++;

				console.log(insightData);
				window.localStorage.setItem('insights', JSON.stringify(insightData));
			}
		});
	}, SCREENSHOT_INTERVAL * 1000);
};

document.addEventListener('DOMContentLoaded', fn, false);