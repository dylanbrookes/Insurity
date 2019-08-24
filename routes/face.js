var express = require('express');
var router = express.Router();
var atob = require('atob');
var AWS = require('aws-sdk');
var Defs = require('../Defs.js');

AWS.config.update({ region: 'us-west-1', credentials: Defs.AWS_CREDENTIALS });
const rekognition = new AWS.Rekognition();

function getBinary(base64Image) {
	base64Image = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
	var binaryImg = atob(base64Image);
	var length = binaryImg.length;
	var ab = new ArrayBuffer(length);
	var ua = new Uint8Array(ab);
	for (var i = 0; i < length; i++) {
		ua[i] = binaryImg.charCodeAt(i);
	}

	return ab;
}

/* POST face sample. */
router.post('/sample', function(req, res, next) {
	console.log('Got a face');
	rekognition.detectFaces({
		Image: {
			Bytes: getBinary(req.body.img)
		},
		Attributes: ['ALL']
	}, (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).end();
		} else {
			res.json(data);
		}
	})
});

module.exports = router;
