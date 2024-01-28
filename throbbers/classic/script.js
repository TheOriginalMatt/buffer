import { HandleCss } from "../../lib/HandleCss.js";

export class Classic {
	#CSS_FILE_PATH = "./throbbers/classic/style.css";
	#CIRCLE_COUNT = 1;
	#CONTAINER_WIDTH_IN_PX  = 100;
	#CONTAINER_HEIGHT_IN_PX = 100;
	#CIRCLE_DIAMETER_IN_PX = 25;
	#CONTAINER_SELECTOR = "#container";


	constructor() {
		this.state = 0; // Waiting to be initialized
		this.cssHandler = null;
		this.circles = {};
		/*
		 * The radius of the path the circles follow should be the width or height of the container, with enough space
		 * on either side for half a circle (the center of the circles follow the path). Which is 
		 * container width - (2 * cicle radius) -- or -- container width - circle diameter.
		 */
		this.radius = (this.#CONTAINER_WIDTH_IN_PX / 2) - (this.#CIRCLE_DIAMETER_IN_PX / 2); 
		this.intervalId = -1;
		this.offset = (this.#CIRCLE_DIAMETER_IN_PX / 2)
	}

	init() {
		console.debug("Classic - init()");
		if (this.state != 0) {
			console.error("You cannot call init() if the throbber is already running.");
			return;
		}
		// Add the CSS file for this throbber
		this.cssHandler = new HandleCss(this.#CSS_FILE_PATH);
		this.cssHandler.addCss();

		let angle = 0;
		let step = (2*Math.PI) / this.#CIRCLE_COUNT;
		for (let i = 0; i < this.#CIRCLE_COUNT; i++) {
			this.#createCircle(i, angle);
			angle += step;
		}

		this.state = 1; // Initialized, waiting to run.
	}

	run() {
		console.debug("Classic - run()");
		if (this.state != 1) {
			console.error("You cannot call run() if the throbber isn't initialized.");
			return;
		}
		
		let fps = 1;
		let distancePerFrame = 5;
		let circles = document.querySelectorAll(".circle");

		this.intervalId = setInterval(() => {
			circles.forEach((el, id) => {
				console.log(el.offsetTop);
				let nextAngle = this.#getAngleFromPos(el.offsetTop, el.offsetLeft) + distancePerFrame;
				let nextPos = this.#getPosFromAngle(nextAngle);

				console.log(nextPos);
				el.style.top = nextPos.xPos+"px";
				el.style.left = nextPos.yPos+"px";
			});
		}, 1000 / fps);


		this.state = 2; // Running, can be halted.
	}

	halt() {
		console.debug("Classic - halt()");
		if (this.state != 2) {
			console.error("You cannot call halt() if the throbber isn't already running.");
			return;
		}
		clearInterval(this.intervalId);
		this.cssHandler.removeCss();

		$(this.#CONTAINER_SELECTOR).remove();

		this.state = 0; // Halted, waiting to be initialized.
	}


	#createCircle(arrayPosition, angle) {
		console.debug("Creating circle");
		
		let pos = this.#getPosFromAngle(angle);
		let circle = this.circles[arrayPosition] = document.createElement("div");
		circle.classList.add("circle");
		circle.style = "top: "+pos.xPos+"px; left: "+pos.yPos+"px;";

		document.querySelector(this.#CONTAINER_SELECTOR).appendChild(circle);
	}

	#getPosFromAngle(angle) {
		let xPos = Math.round(this.#CONTAINER_WIDTH_IN_PX  / 2 + this.radius * Math.cos(angle)) - this.offset;
		let yPos = Math.round(this.#CONTAINER_HEIGHT_IN_PX / 2 + this.radius * Math.sin(angle)) - this.offset;
		console.log("x: "+xPos+", y:"+yPos+" angle: "+angle);
		return {"xPos": xPos, "yPos": yPos};
	}

	#getAngleFromPos(xPos, yPos) {
		let temp = Math.round(Math.sin((xPos - this.#CONTAINER_HEIGHT_IN_PX  / 2 - this.offset) / this.radius));
		console.log("x: "+xPos+", y:"+yPos+" angle: "+temp);
		return temp;
	}
};