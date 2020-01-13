const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
// Require all models
const db = require("../models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {
    // landing page index.handlebars
    app.get('/', function (req, res) {
        db.Article.find({ saved: false }, function (err, data) {
            res.render('index', { home: true, article: data });
        })
    });
}