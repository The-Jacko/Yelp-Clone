const express = require("express"),
		router = express.Router(),
		Campground = require("../models/campground"),
		// index.js is a special name, all of the contents will automatically be required
		middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
	// console.log(req.user);
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
			// can add {currentUser: req.user} into ^ to check for user
			// easier to use middleware to determine if there is a user ^^^^
			// so we dont have to type it in for every route
		}
	});
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

// CREATE - add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
	const newCampground = req.body.campground;
	newCampground["author"] = {
		id: req.user._id,
		username: req.user.username
	};
	Campground.create(newCampground, function(err, newlyCreated){
			if(err){
				console.log(err);
			} else {
				res.redirect("/campgrounds");
			}
		});
});

// SHOW - shows all information about a specific campground
router.get("/:id", function(req, res){
	// find campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds");
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT - show form to edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE - edits and updates the campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + updatedCampground._id);
		}
	});
});

// DELETE - deletes campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// can use findByIdAndDelete or findByIdAndRemove
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;




