const Campground = require("../models/campground"),
		Comment = require("../models/comment");

// all the middleware goes here
var middlewareObject = {};

// middleware checks to see if user is logged in
middlewareObject.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

// middleware that checks campground ownership
middlewareObject.checkCampgroundOwnership = function(req, res, next){	
	// is user logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			// if theres an error or if foundCampground == null
			if(err || !foundCampground) {
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// does user own the campground?
					// cant do this because foundCampground.author.id is a mongoose object returned as string
					// and req.user._id is return as string
					// they look the same but aren't
					// console.log(req.user._id);
					// console.log(foundCampground.author.id);
					// if(req.user._id == foundCampground.author.id){...}
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					// otherwise, redirect
					res.redirect("back");
				}
			}
		});
	} else {
		// if not, redirect somewhere
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}
// middleware that checks comment ownership
middlewareObject.checkCommentOwnership = function(req, res, next){
	// is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err || !foundComment) {
				req.flash("error", "Comment not found");
				res.redirect("back");
			} else {
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					// otherwise, redirect
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		// if not, redirect somewhere
		res.redirect("back");
	}
}

module.exports = middlewareObject;