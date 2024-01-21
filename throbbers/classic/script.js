import { HandleCss } from "../../lib/HandleCss.js";

export class Classic {
	#CSS_FILE_PATH = "./throbbers/classic/style.css";
	#CIRCLE_COUNT = 8;
	#CONTAINER_WIDTH_IN_PX  = 100;
	#CONTAINER_HEIGHT_IN_PX = 100;
	#CIRCLE_DIAMETER_IN_PX = 25;
	#CONTAINER_SELECTOR = "#container";
	#WORKER_SCRIPT = "./throbbers/classic/worker.js";


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
		new Worker(this.#WORKER_SCRIPT);
		console.log(this.state);
		this.state = 2; // Running, can be halted.
		console.log(this.state);
	}

	halt() {
		console.debug("Classic - halt()");
		console.log(this.state);
		if (this.state != 2) {
			console.error("You cannot call halt() if the throbber isn't already running.");
			return;
		}
		this.cssHandler.removeCss();

		$(this.#CONTAINER_SELECTOR).remove();

		this.state = 0; // Halted, waiting to be initialized.
	}


	#createCircle(arrayPosition, angle) {
		console.debug("Creating circle");
		let xPos = Math.round(this.#CONTAINER_WIDTH_IN_PX  / 2 + this.radius * Math.cos(angle)) - (this.#CIRCLE_DIAMETER_IN_PX / 2);
		let yPos = Math.round(this.#CONTAINER_HEIGHT_IN_PX / 2 + this.radius * Math.sin(angle)) - (this.#CIRCLE_DIAMETER_IN_PX / 2);

		let circle = this.circles[arrayPosition] = document.createElement("div");
		circle.classList.add("circle");
		circle.style = "top: "+xPos+"px; left: "+yPos+"px;";

		document.querySelector(this.#CONTAINER_SELECTOR).appendChild(circle);
	}
};