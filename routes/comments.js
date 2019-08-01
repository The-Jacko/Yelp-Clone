const express = require("express"),
		router = express.Router({mergeParams: true}),
		Campground = require("../models/campground"),
		Comment = require("../models/comment"),
		middleware = require("../middleware");

// =====================================
// COMMENTS ROUTES
// =====================================

// New Comment Route
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

// Create Comment Route
router.post("/", middleware.isLoggedIn, function(req, res){
	var newComment = req.body.comment;
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Something went wrong");
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(newComment, function(err, createdComment){
				if(err){
					console.log(err);
				} else {
					// add username and id to comment
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					// save comment
					createdComment.save();
					foundCampground.comments.push(createdComment);
					foundCampground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + foundCampground._id)
				}
			});
		}
	})
});

// Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			 return res.redirect("/campground");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});
	});
});

// Update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
		if(err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Delete/destroy comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});


module.exports = router;