export default function (app) {
  app.post('/report/vessel-information-answer', function (req, res) {
    req.session.data['vessel-information']['vessel-name'] =
      req.body['vessel-name'];

    req.session.data['vessel-information']['vessel-construction-year'] =
      req.body['vessel-construction-year'];

    req.session.data['vessel-information']['vessel-sunk-year'] =
      req.body['vessel-sunk-year'];

    return req.session.data.redirectToCheckAnswers
      ? res.redirect('/report/check-your-answers')
      : res.redirect('salvaged-from');
  });
}
