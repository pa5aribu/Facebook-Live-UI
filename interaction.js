// get element by function
function getEl(el){
	return document.querySelector(el);
}

// generate random number
function random(min, max){
	return Math.floor(Math.random()*(max-min+1)+min);
}

// variables
var body = document.body,
		live = getEl(".live"), /* live mark */
		imageWrapper = getEl(".image-wrapper"),
		emoji = getEl(".emoji"); /* first emoji */

// preload animation timeline
var preloadTL = new TimelineMax({
	delay: 1,
	onComplete: function(){
		// autoclick the first emoji after animation is done
		emoji.click()
	}
});

preloadTL

	.to(imageWrapper, .6, {
		opacity: 1,
		onComplete: function(){
			// adding class active will animate the image wrapper to it's original position
			this.target.classList.add("active")
		}
	})

	// scale up background
	.to(".background", .9, {
		onStart: function(){
			// reveal live mark
			live.classList.add("active")
		},
		delay: .6,
		scale: 1,
		ease: Elastic.easeOut.config(1, 0.65)
	})

	// scretch the background with to 100%
	.to(".background", .3, {
		delay: -.35,
		width: "100%"
	})


	// animate emoji sequentially
	.staggerFrom(".emoji", .6, {
		scale: 0,
		ease: Elastic.easeOut.config(1, 0.65),
		onComplete: function(){
			// adding transition so emoji can animate when hovered
			this.target.setAttribute("style", "transition: .15s all ease;");
		}
	}, .1)


// event click
// this uses the capture technique https://www.kirupa.com/html5/event_capturing_bubbling_javascript.htm
body.addEventListener("click", function(e){

	// if emoji is clicked
	if(e.target.classList.contains("emoji")) {

		// create document fragment
		var frag = document.createDocumentFragment();
		var el = document.createElement("div");
		el.className = "emoji-reaction";
		el.innerHTML = "<div class='user'></div><div id='effect'><div class='bar-wrapper'>\
		\t\t<div class='bar'></div></div><div class='bar-wrapper'><div class='bar'></div></div>\
		\t\t<div class='bar-wrapper'><div class='bar'></div></div><div class='bar-wrapper'><div class='bar'></div></div>\
		\t\t<div class='bar-wrapper'><div class='bar'></div></div><div class='bar-wrapper'><div class='bar'></div></div>\
		\t\t<div class='bar-wrapper'><div class='bar'></div></div><div class='bar-wrapper'><div class='bar'></div></div>\
		\t\t<div class='bar-wrapper'><div class='bar'></div></div><div class='bar-wrapper'><div class='bar'></div></div></div>";

		// put element to fragment
		frag.appendChild(el);
		
		// put frag to image wrapper
		imageWrapper.appendChild(frag);

		// effect
		var effect = el.querySelector("#effect"),
				user = el.querySelector(".user"),
				bar = el.querySelectorAll(".bar");

		// randomize the right and bottom position
		el.style.right = random(5, 10) * 10 + "px";
		el.style.bottom = random(10, 13) * 10 + "px";

		// use different background for like and love button
		if(e.target.classList.contains("like")) {
			effect.classList.add("blue");
		}

		if(e.target.classList.contains("love")) {
			effect.classList.add("red");
		}

		// effect animation timeline
		var effectTl = new TimelineMax({});

		effectTl

			.to(user, .3, {
				y: 0,
				opacity: 1,
				scale: .5
			})

			.to(user, .3, {
				scale: 1.25
			})

			.to(bar, .3, {
				delay: -.15,
				scaleY: 1,
				onComplete: function(){
					// reverse the effect transform origin - from bottom to top
					effect.classList.add("reverse");
				}
			})

			.to(bar, .3, {
				scaleY: 0
			})

			.set(user, {
	      delay: .15,
	      onComplete: function(){
	      	// change the user background to selected emoji
					this.target.classList.add(e.target.id)
				}
	    })

	    .to(user, .15, {
				scale: .75
			})

			.to(user, .15, {
				scale: 1,
				onComplete: function(){

					// after 3 seconds the effect class will be removed and trigger the wave animation
					setTimeout(function(){
						effect.className = "";

						// generate random animation properties for wave animation
						var animProps = {
							x: 0,
							xSpeed: random(3, 4),
							y: 0,
							ySpeed: random(2,4),
							scale: 1,
							opacity: 1,
						}

						// call wave animation function
						waveAnim(user, animProps);
					}, 300)
				}
			});

	}

});

// wave animation
function waveAnim(user, animProps){

	// animation ID, we can use this data to cancel animation once it pass 600px
	var animID;

	animProps.x += animProps.xSpeed;
	animProps.y += animProps.ySpeed * 0.01;

	// using the math sin, we can simulate the wave animation by changing the value
	// from 0 to 1 to -1 to 0
	y = Math.sin(animProps.y) * 25;

	// request animation
	animID = requestAnimationFrame(function(){
		waveAnim(user, animProps);
	});

	if(animProps.x < 600) {

		user.style.transform = "translate(-" + animProps.x + "px, " + y + "px)";

	} else {

		// scale down and hide the user
		if(animProps.scale > 0){
			animProps.scale -= 0.05;
			animProps.opacity -= 0.05;
			user.style.transform = "translate(-" + animProps.x + "px, " + y + "px) scale(" + animProps.scale + ")";
			user.style.opacity = animProps.opacity;
		} else {

			// remove reaction wrapper from DOM
			user.parentElement.parentElement.removeChild(user.parentElement);
			// stop wave animation
			cancelAnimationFrame(animID);

		}
		
	}
	
}