// Require mongoose
var mongoose = require("mongoose");

// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ExampleSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `string` must be of type String. We "trim" it to remove any trailing white space
  // `string` is a required field, and a custom error message is thrown if it is not supplied
  articleHeader: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  articleUrl: {
    type: String,
    trim: true,
    required: "String is Required",
    unique: true
  },
  articleSummary: {
    type: String,
    trim: true,
    required: "String is Required"
  },
  articleComment: {
    type: String,
    trim: true
  },
  userCreated: {
    type: Date,
    default: Date.now
  },
  isSavedArticle: { type: Boolean, default: false }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
