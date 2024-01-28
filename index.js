// JS files for individual Throbbers
import { Classic } from './throbbers/classic/script.js';

let myClassic = new Classic();

myClassic.init();
// myClassic.run();

for (let i = 0; i < 360; i++) {
	let pos = myClassic.getPosFromAngle(i);
	let angle = myClassic.getAngleFromPos(pos.xPos, pos.yPos);
	console.log(i+": x:"+pos.xPos+", y:"+pos.yPos+", angle: "+angle)
}


// $(document).ready(() => {
// 	$("#halt-button").on("click", () => {
// 		myClassic.halt();
// 	})
// });