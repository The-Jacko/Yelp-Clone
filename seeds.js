const mongoose = require("mongoose"),
        Campground = require("./models/campground"),
		Comment = require("./models/comment");

var data = [
	{
		name: "Clouds Rest",
		image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean feugiat dolor et congue faucibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce lacinia dui vel justo tristique, at commodo lacus ultrices. Morbi a metus luctus, malesuada sapien viverra, lacinia nunc. Nullam at felis mi. Phasellus pretium aliquet turpis a luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean eleifend diam luctus, pretium leo pharetra, dictum ligula. Cras quis pretium augue. In vitae ultrices lectus, sit amet finibus nibh. Praesent a lorem vehicula, dignissim justo vel, gravida elit. Duis vel justo ac lacus ullamcorper porttitor eget ut ligula. In porttitor ipsum sed odio dapibus placerat. Pellentesque velit nibh, posuere in consequat id, semper suscipit est. Nulla neque felis, porttitor a lorem a, dapibus cursus ante."
	},
	{
		name: "Nights Sky",
		image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Proin eu elit in elit convallis placerat eu vel neque. Sed viverra efficitur augue non pretium. In convallis condimentum purus, ut placerat libero faucibus in. Proin neque tellus, tempor vitae consectetur ut, finibus et enim. Suspendisse nec ante ut elit sollicitudin pulvinar ac a ligula. In quis tempus massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec pharetra diam eget aliquet iaculis. Praesent eget pharetra lorem. Cras tristique eros in volutpat ultrices. Duis auctor ullamcorper pharetra. Sed dictum ante libero. Vivamus dolor tellus, rhoncus non lobortis sed, consequat tincidunt quam. Maecenas suscipit condimentum nibh vel dictum. Fusce rhoncus tempus dui nec scelerisque. Morbi sodales turpis in enim dignissim sagittis."
	},
	{
		name: "Rocky Lands",
		image: "https://images.unsplash.com/photo-1476979735039-2fdea9e9e407?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description: "Cras vitae quam iaculis, commodo elit eu, facilisis ligula. Donec fermentum mauris non nisl interdum, in facilisis augue suscipit. Aliquam dapibus ex et urna efficitur, non ornare mi malesuada. In convallis, tortor quis facilisis pulvinar, ligula turpis condimentum elit, eget ullamcorper justo lorem quis sem. Nullam sed justo felis. Pellentesque quis placerat justo, vel laoreet velit. In hac habitasse platea dictumst. Quisque condimentum consectetur magna. Praesent viverra lectus vitae neque cursus auctor. Donec quis volutpat ante. Sed non odio vel ante aliquet pharetra."
	}
]

function seedDB(){
	// remove all campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("Removed campgrounds");
		Comment.deleteMany({}, function(err) {
			if(err){
				console.log(err);
			}
			console.log("removed comments");
			//add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err) {
						console.log(err);
					} else {
						console.log("added a campground");
						// create a comment
						Comment.create({
							text: "This place is great, but i wish there was internet",
							author: "Homer"
						}, function(err, comment){
							if(err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("created new comment");
							}
						});
					}
				});
			});
		});
		
	});

	
}

module.exports = seedDB;