const http = require('http')
const port = 3000
const INTERVAL = 60000
const EOL = '\n\r'

const MongoClient = require('mongodb').MongoClient

// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/test';

function sendLine(res, message){
  res.write(message + EOL);
}

http.createServer((req, res) => {
  var start = new Date();
  // Use connect method to connect to the Server
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.end('BOOM: ' + err)
    } else {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      sendLine(res, "server activo")
      var dbo = db.db("alive");
      var mysort = {date: -1};
      dbo.collection("times").find().sort(mysort).limit(100).toArray(function(err, result) {
        if (err) throw err;
        result.forEach(element => {
          console.log(element.date)
          sendLine(res, 'timestamp: ' + element.date)
        });
        db.close();
        var executeTake = new Date().getTime() - start.getTime()
        res.end('Execution time: ' + executeTake + 'ms')
      });
    }
  });
}).listen(port, err => {
  console.log('Server listening at *:', port)
});

// Save active status

function saveActiveStatus() {
  // Use connect method to connect to the Server
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      console.log("[ERROR #1]", err);
    } else {
      var dbo = db.db("alive");
      var actualTimeAlive = { date: new Date()};
      dbo.collection("times").insertOne(actualTimeAlive, function(err, res) {
        if (err) {
          console.log("[ERROR #2]", err);
          db.close();
        } else {
          console.log("1 document inserted");
          db.close();
        }
      })
    }
  });
}

setInterval(saveActiveStatus, INTERVAL);