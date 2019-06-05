var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer");
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

// APP Configuration
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/RESTful_Blog_App", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE SCHEMA
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

//Blog.create({
//    name: "Rusty",
//    image: "https://images.unsplash.com/photo-1559519013-4a31a4b1c4ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//    body: "HI THERE, How are yo all guys!!"
//});

// RESTful Routes STARTS HERE

//ROOT Route
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX Route
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("EROOR!!");
        } else {
            res.render("index.ejs", { blogs: blogs });
        }
    });
});

//NEW Route
app.get("/blogs/new", function (req, res) {
    res.render("new.ejs");
});

//CREATE Route
app.post("/blogs", function (req, res) {
    console.log(req.body.blog.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("==============");
    console.log(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        //console.log(req.body.blog);
        if (err) {
            res.render("new.ejs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//SHOW Route
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.render("/blogs");
        } else {
            res.render("show.ejs", { blog: foundBlog });
        }
    });
});

// EDIT Route
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", { blog: foundBlog });
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE Route
app.delete("/blogs/:id", function (req, res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//PORT Route
app.listen(1000, function () {
    console.log("SERVER IS RUNNING");
});