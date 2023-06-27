var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://bibekraydec:Agent47isback@cluster0.ffsrbxe.mongodb.net/LoginDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', function(callback) {
  console.log("connection succeeded");
})

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/login', function(req, res) {
  var Email = req.body.email;
  var Password = req.body.password;

  db.collection('details').findOne({ email: Email }, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      if (result) {
        const { email, password } = result;
        if (Password === password) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Incorrect password' });
        }
      } else {
        res.redirect("https://sign-up-service.onrender.com");
      }
    }
  });
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.listen(3000, function() {
  console.log("server listening at port 3000");
});
