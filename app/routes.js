// ROUTING SCRIPT FROM PROTOTYPE //

/*
const express = require('express')
const router = express.Router()

router.post('/report/removed-property-check-answer', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const value = req.session.data['removed-property'];

  // Throw the current date in here as it's a good a place as any! 
  var date = new Date();
  var day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();

  // We add 0 to the start of the date and slice the last two digits off to ensure leading zeros.
  req.session.data['report-date'] = {};
  req.session.data['report-date']['day'] = ("0" + day).slice(-2);
  req.session.data['report-date']['month'] = ("0" + month).slice(-2);
  req.session.data['report-date']['year'] = year;

  if (value === 'yes') {
    res.redirect('/report/find-date')
  } else {
    res.redirect('/report/not-removed-property-content')
  }
})

router.post('/report/known-wreck-answer', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const value = req.session.data['known-wreck']

  if (value === 'yes') {
    res.redirect('/report/vessel-information')
  } else {
    res.redirect('/report/salvaged-from')
  }
})

router.post('/report/location-answer', function (req, res) {
  // Standardise the location data so we can show it more easily later.
  const type = req.session.data.location

  req.session.data['location-standard'] = {}
  req.session.data['location-given'] = {}

  switch (type) {
    case 'coords-decimal':
      req.session.data['location-standard'].latitude = req.session.data['location-latitude-decimal']
      req.session.data['location-standard'].longitude = req.session.data['location-longitude-decimal']
      req.session.data['location-standard'].radius = 0

      req.session.data['location-given'].latitude = req.session.data['location-latitude-decimal'] + '°'
      req.session.data['location-given'].longitude = req.session.data['location-longitude-decimal'] + '°'
      break
    case 'coords-decimal-minutes':
      var latD = Number.parseFloat(req.session.data['location-latitude-decimal-minutes-degree'])
      var latM = Number.parseFloat(req.session.data['location-latitude-decimal-minutes-minute'])
      var latDir = req.session.data['location-latitude-decimal-minutes-direction']
      var lonD = Number.parseFloat(req.session.data['location-longitude-decimal-minutes-degree'])
      var lonM = Number.parseFloat(req.session.data['location-longitude-decimal-minutes-minute'])
      var lonDir = req.session.data['location-longitude-decimal-minutes-direction']

      var latitude = latD + (latM / 60)
      var longitude = lonD + (lonM / 60)

      if (latDir == "S") {
        latitude = latitude * -1;
      }
      if (lonDir == "W") {
        longitude = longitude * -1;
      }

      req.session.data['location-standard'].latitude = latitude.toFixed(5)
      req.session.data['location-standard'].longitude = longitude.toFixed(5)
      req.session.data['location-standard'].radius = 0

      req.session.data['location-given'].latitude = latD + '° ' + latM + "' " + latDir;
      req.session.data['location-given'].longitude = lonD + '° ' + lonM + "' " + lonDir;
      break
    case 'coords-sexagesimal':
      var latD = Number.parseFloat(req.session.data['location-latitude-degrees-degree'])
      var latM = Number.parseFloat(req.session.data['location-latitude-degrees-minute'])
      var latS = Number.parseFloat(req.session.data['location-latitude-degrees-second'])
      var latDir = req.session.data['location-latitude-degrees-direction']
      var lonD = Number.parseFloat(req.session.data['location-longitude-degrees-degree'])
      var lonM = Number.parseFloat(req.session.data['location-longitude-degrees-minute'])
      var lonS = Number.parseFloat(req.session.data['location-longitude-degrees-second'])
      var lonDir = req.session.data['location-longitude-degrees-direction']

      var latitude = latD + (latM / 60) + (latS / 3600)
      var longitude = lonD + (lonM / 60) + (lonS / 3600)
      var latitude = latD + (latM / 60)
      var longitude = lonD + (lonM / 60)
      
      if (latDir == "S") {
        latitude = latitude * -1;
      }
      if (lonDir == "W") {
        longitude = longitude * -1;
      }


      req.session.data['location-standard'].latitude = latitude.toFixed(5)
      req.session.data['location-standard'].longitude = longitude.toFixed(5)
      req.session.data['location-standard'].radius = 0

      req.session.data['location-given'].latitude = latD + '° ' + latM + "' " + latS + '" ' + latDir;
      req.session.data['location-given'].longitude = lonD + '° ' + lonM + "' " + lonS + '" ' + lonDir;
      break
    case 'map':
      var latitude = Number.parseFloat(req.session.data['map-latitude-input']).toFixed(5)
      var longitude = Number.parseFloat(req.session.data['map-longitude-input']).toFixed(5)

      req.session.data['location-standard'].latitude = latitude
      req.session.data['location-standard'].longitude = longitude
      req.session.data['location-standard'].radius = req.session.data['map-radius-input']

      req.session.data['location-given'].latitude = latitude + '° N '
      req.session.data['location-given'].longitude = longitude + '° W'
      break
    default:
      req.session.data['location-standard'].latitude = 0
      req.session.data['location-standard'].longitude = 0
      req.session.data['location-standard'].radius = 0

      req.session.data['location-given'].latitude = ''
      req.session.data['location-given'].longitude = ''
  }

  console.log(req.session.data['location-standard'])

  res.redirect('/report/depth')
})

router.all('/report/depth', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const salvagedFrom = req.session.data['removed-from']

  var depthResponses = ['shipwreck', 'seabed']

  // If it's not one of the depth responses, skip this question.
  if (depthResponses.includes(salvagedFrom)) {
    res.render('report/depth')
  } else {
    res.redirect('/report/vessel-description')
  }
})

router.all('/report/vessel-description', function (req, res) {
  // Get the answer from session data
  // The name between the quotes is the same as the 'name' attribute on the input elements
  // However in JavaScript we can't use hyphens in variable names

  const salvagedFrom = req.session.data['removed-from']

  var descriptionResponses = ['shipwreck']

  // If it's not one of the description responses, skip this question.
  if (descriptionResponses.includes(salvagedFrom)) {
    res.render('report/vessel-description')
  } else {
    res.redirect('/report/property-summary')
  }
})

router.get('/report/property-form/:prop_id', function (req, res) {
  // This is a janky router to try simulate a create/edit page for property. It contains many flaws.

  // Instantiate a counter for the ID in the session data to avoid duplicates.
  req.session.data['property-id-counter'] = req.session.data['property-id-counter'] !== undefined ? req.session.data['property-id-counter'] : 0

  // Instantiate the property object itself in the session data so we can assume its existance later.
  req.session.data.property = req.session.data.property !== undefined ? req.session.data.property : {}

  var rawPropertyID = req.params.prop_id
  var property = req.session.data.property

  // If our ID is the string "new", we're creating a new item of property.
  if (rawPropertyID === 'new') {
    // Generate the new ID and increment the counter for next time.
    // Explaination of why we append an "i": https://stackoverflow.com/a/22198251
    propertyID = 'i' + req.session.data['property-id-counter']
    req.session.data['property-id-counter']++
  } else {
    // Otherwise we check if we're getting an existing ID and throw a 404 otherwise.
    if (property[rawPropertyID] !== undefined) {
      propertyID = rawPropertyID
    } else {
      res.redirect('/report/property-summary')
    }
  }

  res.render('report/property-form', { propertyID: propertyID })
})

router.all('/report/property-form-image/:prop_id', function (req, res) {
  var rawPropertyID = req.params.prop_id
  var property = req.session.data.property

  if (property[rawPropertyID] !== undefined) {
    propertyID = rawPropertyID;
    propertyItem = property[propertyID];
  } else {
    res.redirect('/report/property-summary');
  }

  res.render('report/property-form-image', { propertyID: propertyID, propertyItem: propertyItem });
})

router.all('/report/property-form-address/:prop_id', function (req, res) {
  var rawPropertyID = req.params.prop_id
  var property = req.session.data.property

  if (property[rawPropertyID] !== undefined) {
    propertyID = rawPropertyID;
    propertyItem = property[propertyID];
  } else {
    res.redirect('/report/property-summary');
  }

  res.render('report/property-form-address', { propertyID: propertyID, propertyItem: propertyItem });
})

router.get('/report/property-delete/:prop_id', function (req, res) {
  // This is a janky router to try simulate a delete page for property. It contains many flaws.

  // Instantiate the property object itself in the session data so we can assume its existance later.
  req.session.data.property = req.session.data.property !== undefined ? req.session.data.property : {}

  var rawPropertyID = req.params.prop_id
  var property = req.session.data.property
  var propertyItem = null

  if (property[rawPropertyID] !== undefined) {
    propertyItem = property[rawPropertyID]
  } else {
    res.redirect('/report/property-summary')
  }

  res.render('report/property-delete', { propertyID: rawPropertyID, propertyItem: propertyItem })
})

router.get('/report/property-delete-action/:prop_id', function (req, res) {
  // This is a janky router to try simulate a delete page for property. It contains many flaws.

  // Instantiate the property object itself in the session data so we can assume its existance later.
  req.session.data.property = req.session.data.property !== undefined ? req.session.data.property : {}

  var rawPropertyID = req.params.prop_id
  var property = req.session.data.property
  var propertyItem = null

  if (property[rawPropertyID] !== undefined) {
    delete property[rawPropertyID]
  }

  res.redirect('/report/property-summary')
})

router.get('/report/property-summary', function (req, res) {
  var removedFlash = false
  var addedFlash = false

  // These are set as hidden fields.
  if (req.session.data['property-added-flash'] !== undefined && req.session.data['property-added-flash']) {
    addedFlash = true
    req.session.data['property-added-flash'] = false
  }

  // These are set as hidden fields.
  if (req.session.data['property-removed-flash'] !== undefined && req.session.data['property-removed-flash']) {
    removedFlash = true
    req.session.data['property-removed-flash'] = false
  }

  res.render('report/property-summary', { addedFlash: addedFlash, removedFlash: removedFlash })
})

module.exports = router
*/