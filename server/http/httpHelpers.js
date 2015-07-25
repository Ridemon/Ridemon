module.exports = function(req, response) {
  var queryData = req.query;
  console.log(queryData);

  request({
    url: 'https://sandbox-api.uber.com/v1/estimates/price',
    method: 'GET',
    qs: req.query,
    headers: {
      'Content-Type': 'application/JSON',
    }
  }, function(error, res, body) {
    console.log('body:', body);
    console.log('error:', error);
    response.send(JSON.parse(body));
  })
};
