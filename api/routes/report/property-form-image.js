const { body, validationResult } = require('express-validator');

import { formatValidationErrors } from '../../../utils';

export default function (app) {
  /*app.all('/report/property-form-image/:prop_id', function (req, res) {
    var rawPropertyID = req.params.prop_id;
    var property = req.session.data.property;
    var propertyID;
    var propertyItem;

    if (property[rawPropertyID] !== undefined) {
      propertyID = rawPropertyID;
      propertyItem = property[propertyID];
    } else {
      res.redirect('/report/property-summary');
    }

    res.redirect('report/property-form-image', {
      propertyID: propertyID,
      propertyItem: propertyItem
    });
  });*/
}
