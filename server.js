// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var axios = require("axios"); // Go to the news website
var cheerio = require("cheerio"); // Extract info from the website
var logger = require("morgan");
var exphbs = require("express-handlebars");
var Article = require("./Article.js");

// --- Back End ---
// Create an article collection (mongodb)
// Go to the news website
// Extract info from the website
// Make the homepage URL (express)
// Make the Saved Articles URL (express)
// Make the Delete Articles URL (express)
// Save / Update articles viewed (mongodb)
// --- Front End ---
// Create a base template file - base.handlebars (handlebars)
// Create an article div handlebars page (handlebars)
//

// Initialize Express
var app = express();

app.use(express.static("public")); // allows public folder contents to be accessible
app.engine("handlebars", exphbs({ defaultLayout: "base" }));
app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const BASE_URL = "https://www.aljazeera.com";

var db = mongoose.connection;
var mongoURL = process.env.MONGODB_URI || "mongodb://localhost/article_db";
mongoose.connect(
  mongoURL,
  { useNewUrlParser: true }
);

process.env// // Routes
// 1. At the root path, send a simple hello world message to the browser
.app
  .get("/", function(req, res) {
    res.render("index");
  });

// 2. At the "/all" path, display every entry in the animals collection
app.get("/all", function(req, res) {
  Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      console.log(err.message);
    });
});
c;
// // 3. At the "/name" path, display every entry in the animals collection, sorted by name
// app.get("/name", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything,
//   // but this time, sort it by name (1 means ascending order)
//   db.animals.find().sort({ name: 1 }, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

// // 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
// app.get("/weight", function(req, res) {
//   // Query: In our database, go to the animals collection, then "find" everything,
//   // but this time, sort it by weight (-1 means descending order)
//   db.animals.find().sort({ weight: -1 }, function(error, found) {
//     // Log any errors if the server encounters one
//     if (error) {
//       console.log(error);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       res.json(found);
//     }
//   });
// });

getNewArticles();

app.listen(3000, function() {
  console.log("App running on port 3000!");
});

function getNewArticles() {
  axios.get(`${BASE_URL}/news/`).then(function(response) {
    var $ = cheerio.load(response.data);
    $("div[class='col-sm-7 topics-sec-item-cont']").each(function(i, element) {
      var result = {};
      var headline = $(this)
        .children("a")
        .children("h2")
        .text();
      result.headline = headline;
      result.link =
        BASE_URL +
        $(this)
          .children("a")
          .attr("href");
      result.summary = $(this)
        .children("p[class='topics-sec-item-p']")
        .text();
      saveArticlesToDb(result);
    });
  });
}

function saveArticlesToDb(newArticlesObj) {
  // console.log(newArticlesObj);
  var query = { articleUrl: newArticlesObj.link },
    update = {
      articleHeader: newArticlesObj.headline,
      articleUrl: newArticlesObj.link,
      articleSummary: newArticlesObj.summary,
      isSavedArticle: false
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  Article.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) console.log(error);
    console.log(result);
  });

  // Article.create({})
  //   .then(function(dbArticle) {
  //     // console.log(dbArticle);
  //   })
  //   .catch(function(err) {
  //     console.log(err.message);
  //   });
}
