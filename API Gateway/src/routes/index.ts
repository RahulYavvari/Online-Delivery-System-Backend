import { NextFunction } from "express";

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req: any, res: any, next: NextFunction) {
  const message = {message: "Home Page"};
  res.status(200).json();
});

router.all('/health', function(req: any, res: any, next: NextFunction) {
  const message = {message: "healthy"};
  res.status(200).json(message);
});

module.exports = router;