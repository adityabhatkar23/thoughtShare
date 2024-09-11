const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/postApp")
  .then(() => console.log("MongoDB Connection Succeeded."))
  .catch((err) => console.log("Error in DB connection: " + err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image:{
    type:String,
    default:"https://api.dicebear.com/9.x/lorelei/svg"
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
