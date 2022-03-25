const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const cors = require("cors");

var fs = require('fs');
var path = require('path');
require("dotenv/config");

// set up multer for storing uploaded files image upload database
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });
var categoryImgModel = require('./categoryData');
var findWorkDataModel = require('./FindWorkData');

const corsOptions = {
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

const {createNewUser, isValidUser} = require("./database.js");
const { json } = require("body-parser");
const { log } = require("console");
const commentsData = require("./WorkBidCommentsData");
const Bids = require('./Bids');

app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(bodyParser.json());

app.post("/post", (req, res, err) => {
});

app.post("/login", (req, res, err) => {

  const result = isValidUser(req.body);
  //send to react the result code
});

app.get('/findtalent', (req, res, err) => {

  if(err){
    console.log(err);
  }
  categoryImgModel.find({}, (error, items) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred', err);
    }
    else {
      res.send({ items: items });
    }
  });
});

app.get('/findwork', (req, res, err) => {

  if(err){
    console.log(err);
  }
  const findWorkData = findWorkDataModel.FindWorkData;
  const FindWorkFilterData = findWorkDataModel.FindWorkFilterData;

  findWorkData.find({}, (error, items) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred', err);
    }
    else {
      FindWorkFilterData.find({}, (error, filterData) => {
        if (error) {
          console.log(error);
          res.status(500).send('An error occurred', err);
        }
        else 
          res.send({ items: items, filterData: filterData });
      });
    }
  });
});

//this was supposed to be get requst but we have manipulated using post
app.post('/findwork/bid', (req, res, err) => {

  if(err){
    console.log(err);
  }
  const workBidCommentsData = commentsData.WorkBidCommentsData;
  
  workBidCommentsData.find({workId: req.body.id}, (error, items) => {
    if (error) {
      console.log(error);
      res.status(500).send('An error occurred', err);
    }
    else {
      Bids.find({workId: req.body.id}, (errorrr, bids) => {
        if(errorrr){
          console.log(errorrr);
        }
        let totalBids = 0;
        for(let i = 0 ; i < bids.length ; i++){
          totalBids += bids[i].amount;
        }
        res.send({items: items, bids: bids, avgBid: totalBids/bids.length});  
      })
    }
  });
});

app.post('/findwork/bid/newComment', (req, res, err) => {
  console.log(req.body);
  const body = req.body;
  if(err){
    console.log(err);
  }
  const addCommentToWorkBid = commentsData.addCommentToWorkBid;
  const result = addCommentToWorkBid({
    workId: body.workId,
    username: body.username,
    desc: body.desc,
  });
  console.log(result);
  res.send({result: result});
});

app.post("/signup", (req, res, err) => {

  if(err){
    //
  }
  //user exist or user dont exist
  let result;
  try{
    result = createNewUser(req.body);
    res.send({result: result});
  }catch(error){    
    console.log("some error");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
