var express = require('express');
var router = express.Router();
var request = require('request');


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


const url = 'mongodb://127.0.0.1:27017';
const dbName = 'spotify';
 


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index access');
  res.render('index', { title: 'Express' });
});

var client_id = '46b4f1ef8c994ec0a6759523243177aa'; // Your client id
var client_secret = '2e9b5ec7135d4e129239abaac10de4f2'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

router.get('/consumir', function(req, res, next) {
  
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/users/jmperezperez',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        console.log('token: '+token);
        res.send(body);
      });
    }else{
      res.send('ok');
    }
  });

});

router.get('/search/:type/:q', function(req, res, next) {
  q = req.params.q;
  type = req.params.type;
  console.log('q: '+q);
  console.log('type: '+type);

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
      res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/search?q='+q+'&type=album',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        console.log('token: '+token);
        console.log(body);
        res.send(body);
      });
    }else{
      res.send('ok');
    }
  });

});

router.get('/test', function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  res.send('[{"id": "bitcoin","name": "Bitcoin"}]');

});


router.get('/mongo', function(req, res, next) {

  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myobj = { name_search: "Company Inc", address: "Highway 37" };
    dbo.collection("searches").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

res.send('ok');

});




router.get('/add/:search', function(req, res, next) {
  search = req.params.search;

  //tomamos la informacion de la ultima consulta

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
      res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/search?q='+q+'&type=album',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        
        //intert mongo
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db(dbName);
          var myobj = { name_search: search, date: new Date(), items: body.albums.items};
          dbo.collection("searches").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
      
            db.close();
          });
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send('ok1');    

      });
    }else{
      res.send('ok');
    }
  });  
  
});

router.get('/find', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var myobj = { name_search: "Company Inc", date: new Date() };
    var mysort = { date: -1 };
    dbo.collection("searches").find().sort(mysort).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
      res.setHeader('Access-Control-Allow-Credentials', true); // If needed      
      res.send(result);
      db.close();
    });
  });

//res.send('ok');

});

router.get('/get-search/:id', function(req, res, next) {
  id = req.params.id;
  ObjectId = require('mongodb').ObjectId; 
  o_id = new ObjectId(id);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    var query = { _id: o_id };
    dbo.collection("searches").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
      res.setHeader('Access-Control-Allow-Credentials', true); // If needed      
      res.send(result);
      db.close();
    });
  });

//res.send('ok');

});


router.get('/del', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.collection("searches").drop(function(err, delOK) {
      if (err) throw err;
      if (delOK) console.log("Collection deleted");
      db.close();
      res.send('ok');
    });
  });
});


module.exports = router;
