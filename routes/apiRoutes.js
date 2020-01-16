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

    // scrape articles
    app.get("/api/fetch", function (req, res) {
        // A GET route for scraping the nytimes website
        // First, we grab the body of the html with axios
        axios.get("https://www.nytimes.com/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            const $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function (i, element) {

                // Save an empty result object
                var result = {};
                result.headline = $(element).find("h2").text().trim();
                result.url = 'https://www.nytimes.com' + $(element).find("a").attr("href");
                result.summary = $(element).find("p").text().trim();

                if (result.headline !== '' && result.summary !== '') {
                    db.Article.findOne({ headline: result.headline }, function (err, data) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (data === null) {
                                db.Article.create(result)
                                    .then(function (dbArticle) {
                                        console.log(dbArticle)
                                    })
                                    .catch(function (err) {
                                        // If an error occurred, send it to the client
                                        console.log(err)
                                    });
                            }
                            console.log(data)
                        }
                    });
                }

            });

            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape completed!");
        });
    });

    // clear all articles from collection
    app.get("/api/clear", function (req, res) {
        console.log(req.body)
        db.Article.deleteMany({}, function (err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
                res.send(true)
            }
        })
    });
}