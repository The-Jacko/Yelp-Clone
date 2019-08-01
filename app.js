const express = require("express"),
 		app = express(),
 		bodyParser = require("body-parser"),
 		mongoose = require("mongoose"),
 		flash = require("connect-flash"),
 		passport = require("passport"),
 		LocalStrategy = require("passport-local"),
 		methodOverride = require("method-override"),
 		Campground = require("./models/campground"),
 		Comment = require("./models/comment"),
 		User = require("./models/user"),
 		seedDB = require("./seeds");

// requiring routes
const campgroundRoutes = require("./routes/campgrounds"),
		commentRoutes = require("./routes/comments"),
		indexRoutes = require("./routes/index");
 		

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });
// console.log(process.env.DATABASEURL)
// mongoose.connect("mongodb+srv://janie:janie@cluster0-ipdbc.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
// incase if our environment variable breaks, we have a backup for our local
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true });
// seed the database
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Jackie's a beast",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware to determine if user is logged in
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("The YelpCamp Server Started...");
});