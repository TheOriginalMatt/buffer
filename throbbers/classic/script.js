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
			console.error("You cannot call un() if the throbber isn't initialized.");
			return;
		}
		
		let fps = 1;
		let distancePerFrame = 5;
		let circles = document.querySelectorAll(".circle");
		let offset = 40;
		console.log(this.radius);

		this.intervalId = setInterval(() => {
			circles.forEach((el, id) => {
				let currentXPos = el.offsetTop;

				let currentAngle = Math.round(Math.sin((currentXPos - this.#CONTAINER_HEIGHT_IN_PX  / 2 - offset) / 37.5));
				let newAngle = currentAngle + distancePerFrame;


				let xPos = Math.round(this.#CONTAINER_WIDTH_IN_PX  / 2 + this.radius * Math.cos(newAngle)) - offset;
				let yPos = Math.round(this.#CONTAINER_HEIGHT_IN_PX / 2 + this.radius * Math.sin(newAngle)) - offset;

				console.table({ currentX: currentXPos, currentAngle: currentAngle, newAngle: newAngle, newX: xPos})

				el.style.top = xPos+"px";
				el.style.left = yPos+"px";
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
		let offset = (this.#CIRCLE_DIAMETER_IN_PX / 2)
		let xPos = Math.round(this.#CONTAINER_WIDTH_IN_PX  / 2 + this.radius * Math.cos(angle)) - offset;
		let yPos = Math.round(this.#CONTAINER_HEIGHT_IN_PX / 2 + this.radius * Math.sin(angle)) - offset;

		let circle = this.circles[arrayPosition] = document.createElement("div");
		circle.classList.add("circle");
		circle.style = "top: "+xPos+"px; left: "+yPos+"px;";

		document.querySelector(this.#CONTAINER_SELECTOR).appendChild(circle);
	}
};