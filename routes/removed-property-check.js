const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', function(req, res, next) {
  res.render('report/removed-property-check.html')
});

module.exports = router