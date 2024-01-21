// JS files for individual Throbbers
import { Classic } from './throbbers/classic/script.js';

let myClassic = new Classic();

myClassic.init();
myClassic.run();


$(document).ready(() => {
	$("#halt-button").on("click", () => {
		myClassic.halt();
	})
});