export class HandleCss {
	constructor(path) {
		this.path = path;
		this.link = null;
	}

	addCss() {
		if (this.link != null){
			console.error("A link already exists with the path: "+this.path+". Run .removeCss() first.");
		}
		console.debug("Attaching the CSS file. Path: "+this.path);
		this.link = document.createElement("link")
		this.link.href = this.path;
		this.link.rel = "stylesheet";
		this.link.media = "screen,print";

		document.getElementsByTagName("head")[0].appendChild(this.link);
	}

	removeCss() {
		if (this.link == null) {
			console.error("No link exists with the path: "+this.path+". Run .addCss() first.");
			return;
		}
		console.debug("Removing the CSS file. Path: "+this.path);
		$("link[href='"+this.path+"']").remove();
	}
}