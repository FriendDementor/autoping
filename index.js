const http = require('http')
const port = 3000

const MongoClient = require('mongodb').MongoClient

// Connection URL
const mongoUrl = process.env.MONGO_URL || 'mongodb://db:27017/test';

var timesLoged = 0;

http.createServer((req, res) => {
  // Use connect method to connect to the Server
  MongoClient.connect(mongoUrl, (err, db) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'})
      res.end('BOOM: ' + err)
    } else {
      res.writeHead(200, {'Content-Type': 'text/plain'})
      res.end('[ ' + timesLoged + ' ] segundos activo')
      db.close();
    }
  });
}).listen(port, err => {
  console.log('Server listening at *:', port)
});


function intervalFunc() {
  timesLoged+=1;
}

setInterval(intervalFunc, 1000);