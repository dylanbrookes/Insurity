var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { layout: false, title: 'Express'});
});

router.get('/demo', function(req, res, next) {
  res.render('demo', { layout: false, title: 'Demo' });
});

router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { layout: false, title: 'Dashboard' });
});

router.get('/dashboard/insights', function(req, res, next) {
  res.render('dashboard/insights', { layout: false, title: 'Insights' });
});



module.exports = router;
