import { HandleCss } from "../../lib/HandleCss.js";

export class Classic {
	constructor() {
		this.cssFilePath = "./throbbers/classic/style.css";
		this.state = 0; // Waiting to be initialized
		this.cssHandler = null;
	}

	init() {
		console.debug("Classic - init()");
		if (this.state != 0) {
			console.error("You cannot call init() if the throbber is already running.");
			return;
		}
		this.cssHandler = new HandleCss(this.cssFilePath);
		this.cssHandler.addCss();

		this.state = 1; // Initialized, waiting to run.
	}

	run() {
		console.debug("Classic - run()");
	}

	halt() {
		console.debug("Classic - halt()");
		this.cssHandler.removeCss();
	}
};