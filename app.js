const express = require("express");
const app = express();

const path = require("path");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const userModel = require("./models/user");
const postModel = require("./models/post");

app.set("view engine", "ejs");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register", { registerError: null });
});

app.get("/login", (req, res) => {
  res.render("login", { loginError: null });
});

app.post("/registerUser", async (req, res) => {
  let { name, email, password, image } = req.body;
  let user = await userModel.findOne({ email });

  if (user) {
    return res.render("register", { registerError: "Email already exist's" });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let createdUser = await userModel.create({
        name,
        email,
        password: hash,
        image: genAvt(name),
      });

      const token = jwt.sign({ email }, "secret");
      res.cookie("token", token, { httpOnly: true });
    });
  });
  res.redirect("/home");
});

app.post("/loginUser", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!user) {
    return res.render("login", { loginError: "Invalid email or password" });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      const token = jwt.sign({ email }, "secret");
      res.cookie("token", token);
      res.redirect("/home");
    } else {
      return res.render("login", { loginError: "Invalid email or password" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", " ");
  res.redirect("/login");
});

app.get("/home", isLog, async (req, res) => {
  const { name, email } = req.user;
  let user = await userModel.findOne({ email });
  let posts = await postModel.find().populate("user").exec();

  res.render("home", { user, posts });
});

app.post("/post", isLog, async (req, res) => {
  const { name, email } = req.user;
  const { content } = req.body;
  let user = await userModel.findOne({ email: email });

  let post = await postModel.create({
    user: user._id,
    content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/home");
});

app.get("/like/:id", isLog, async (req, res) => {
  let post = await postModel.findOne({ _id: req.params.id }).populate("user");

  if (!post.likes.includes(req.user._id)) {
    post.likes.push(req.user._id);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }

  await post.save();
  res.redirect("/home");
});

app.post("/edit/:id", isLog, async (req, res) => {
  let post = await postModel.findOneAndUpdate(
    { _id: req.params.id },
    { content: req.body.content }
  );
  res.redirect("/home");
});

app.get("/delete/:id", isLog, async (req, res) => {
  let post = await postModel.findOneAndDelete({ _id: req.params.id });

  res.redirect("/home");
});

// custom functions

function isLog(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    res.redirect("/login");
  } else {
    const data = jwt.verify(token, "secret");
    req.user = data;
    next();
  }
}

function genAvt(seed) {
  const imgURL = `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
  return imgURL;
}

// port
app.listen(3000, () => {
  console.log("server runnning on http://localhost:3000");
});
