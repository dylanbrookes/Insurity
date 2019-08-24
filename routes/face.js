var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var Defs = require('../Defs.js');

AWS.config.update({ region: 'us-west-1', credentials: Defs.AWS_CREDENTIALS });
const rekognition = new AWS.Rekognition();

/* POST face sample. */
router.post('/sample', function(req, res, next) {
	console.log('Got a face');
	rekognition.detectFaces({
		Image: {
			Bytes: req.body.img.split('base64,')[1]
		}
	}, (err, data) => {
		if (err) console.error(err);
		else console.log(data);
	})
	res.status(200).end();
});

module.exports = router;
