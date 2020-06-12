var express = require('express');
var request = require("request");

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/balance/:account', function (req, res) {
  const options = {
    method: 'POST',
    url: 'https://eos.greymass.com/v1/chain/get_currency_balance',
    headers:
    {
      
      'cache-control': 'no-cache'
    },
    body: JSON.stringify({
      code:"eosio.token",
      account: req.params.account,
      symbol:"EOS"
    })
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
    res.send(body);
  });

});

app.listen(8181, function () {
  console.log('App listening on port 8181!');
});