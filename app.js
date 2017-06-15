const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dbRecord = require('./models/urldb');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urlDbs');
mongoose.Promise = global.Promise;

app.get('/favicon.ico', (req, res) =>{
    res.sendStatus(204);
});

app.get('/new/:urlUser(*)', (req,res,next)=>{
  let {urlUser} = req.params;
  let regx = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
  let num = Math.floor(Math.random()*10000);

  if(regx.test(urlUser)===true){
    let data = new dbRecord({
      originalUrl: urlUser,
      shortUrl: num
    });
    data.save(err => {
      if(err) throw err;
    });
    return res.json(data);
  }else {
    return res.json({Error: 'Format Incorrect. Please enter a valid URL to shorten'});
  }
});

app.get('/:urlForward', (req,res,next) =>{
  let {urlForward} = req.params;
  dbRecord.findOne({shortUrl: urlForward}, (err,data) =>{
    if(err) throw err;
    let urlRedir = new RegExp("^(http|https)://", "i");
    if(urlRedir.test(data.originalUrl)){
      res.redirect(301, data.originalUrl);
    }else
    res.redirect(301, 'http://'+data.originalUrl || 'https://'+data.originalUrl);
    // res.json({match: 'yes', id: data.originalUrl});
  });
});



//Port setup
app.listen(process.env.PORT || 3000, ()=>{
  console.log('Everything working fine..');
});
