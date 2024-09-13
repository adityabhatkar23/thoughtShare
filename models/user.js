const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

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
