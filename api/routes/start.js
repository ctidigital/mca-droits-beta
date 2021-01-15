import { Router } from 'express';

const route = Router();

export default function (app) {
  app.use('/report/start', route);

  route.get('/', function (req, res, next) {
    res.render('report/start.html');
  });
}
