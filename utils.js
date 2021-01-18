import getKeypath from 'keypather/get';
import sessionDataDefaults from './api/data/session-data-defaults';

// Store data from POST body or GET query in session
const storeData = (input, data) => {
  for (const i in input) {
    // any input where the name starts with _ is ignored
    if (i.indexOf('_') === 0) {
      continue;
    }

    const val = input[i];

    // Delete values when users unselect checkboxes
    if (val === '_unchecked' || val === ['_unchecked']) {
      delete data[i];
      continue;
    }

    // Remove _unchecked from arrays of checkboxes
    if (Array.isArray(val)) {
      const index = val.indexOf('_unchecked');
      if (index !== -1) {
        val.splice(index, 1);
      }
    } else if (typeof val === 'object') {
      // Store nested objects that aren't arrays
      if (typeof data[i] !== 'object') {
        data[i] = {};
      }

      // Add nested values
      storeData(val, data[i]);
      continue;
    }

    data[i] = val;
  }
};

export const autoStoreData = (req, res, next) => {
  if (!req.session.data) {
    req.session.data = {};
  }

  req.session.data = Object.assign({}, sessionDataDefaults, req.session.data);

  storeData(req.body, req.session.data);
  storeData(req.query, req.session.data);

  // Send session data to all views

  res.locals.data = {};

  for (var j in req.session.data) {
    res.locals.data[j] = req.session.data[j];
  }

  next();
};

// Add Nunjucks function called 'checked' to populate radios and checkboxes
export const addCheckedFunction = (env) => {
  env.addGlobal('checked', function (name, value) {
    // Check data exists
    if (this.ctx.data === undefined) {
      return '';
    }
    // Use string keys or object notation to support:
    // checked("field-name")
    // checked("['field-name']")
    // checked("['parent']['field-name']")
    name = !name.match(/[.[]/g) ? `['${name}']` : name;
    var storedValue = getKeypath(this.ctx.data, name);
    // Check the requested data exists
    if (storedValue === undefined) {
      return '';
    }
    var checked = '';
    // If data is an array, check it exists in the array
    if (Array.isArray(storedValue)) {
      if (storedValue.indexOf(value) !== -1) {
        checked = 'checked';
      }
    } else {
      // The data is just a simple value, check it matches
      if (storedValue === value) {
        checked = 'checked';
      }
    }
    return checked;
  });
};

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// and /app/views/test/index.html

function renderPath(path, res, next) {
  // Try to render the path
  res.render(path, function (error, html) {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found - call next with the error
      next(error);
      return;
    }
    if (!path.endsWith('/index')) {
      // Maybe it's a folder - try to render [path]/index.html
      renderPath(path + '/index', res, next);
      return;
    }
    // We got template not found both times - call next to trigger the 404 page
    next();
  });
}

export const matchRoutes = (req, res, next) => {
  var path = req.path;

  // Remove the first slash, render won't work with it
  path = path.substr(1);

  // If it's blank, render the root index
  if (path === '') {
    path = 'index';
  }

  renderPath(path, res, next);
};
