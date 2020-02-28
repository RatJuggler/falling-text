// Knows how to render text on the canvas.
class TextRenderer {
	// ctx;     // context of the canvas to render on.
	// height;  // to make the canvas.
	// width;   // to make the canvas.
	constructor(ctx, height, width) {
		this.ctx = ctx;
		this.ctx.canvas.height = height;
		this.ctx.canvas.width = width;
		// The canvas and font sizes govern the number of rows and columns available for text.
		this.font_size = 16;
		this.render_font = this.font_size + "px arial";
		this.row_count = this.ctx.canvas.height / this.font_size;
		this.column_count = this.ctx.canvas.width / this.font_size;
	}
	getRandomColumn() {
		return Math.floor(Math.random() * this.column_count);
	}
	hasReachedBottom(row) {
		return row > this.row_count
	}
	clearCanvas() {
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
	render(text, x, y) {
		// Set green text in the required font then render text.
		this.ctx.fillStyle = "#00FF00";
		this.ctx.font = this.render_font;
		this.ctx.fillText(text, x * this.font_size, y * this.font_size);
	}
}

// A repository of the text available for falling.
class TextRepository {
	//repository;  // Contains all the text we could use.
	//n;           // Index of the next text to use.
	// Define the initial text to show while the file loads.
	constructor() {
		this.repository = ["TYRANNOSAURUS", "TRICERATOPS", "VELOCIRAPTOR", "STEGOSAURUS", "SPINOSAURUS", "ARCHAEOPTERYX", "BRACHIOSAURUS", "ALLOSAURUS", "APATOSAURUS", "DILOPHOSAURUS"];
		this.n = 0;
	}
	populateFromFile(file) {
		// Extract text from the file, split by line and convert to upper case.
		fetch(file)
			.then(response => response.text())
			.then(text => this.repository = text.split('\n').map(s => s.toUpperCase()));
	}
	getNextText() {
		if (this.n === this.repository.length) {
			this.n = 0;
		}
		return this.repository[this.n++];
	} 
}

// A piece of falling text.
class FallingText {
	//textRepo;      // A repository of text to display.
	//textRenderer;  // A renderer to display the text.
	constructor(textRepo, textRenderer) {
		this.textRepo = textRepo;
		this.textRenderer = textRenderer;
		// Start new details.
		this.new();
	}
	new() {
		this.text = this.textRepo.getNextText();
		this.x = this.textRenderer.getRandomColumn();
		this.y = 0;
	}
	render() {
		this.textRenderer.render(this.text, this.x, this.y);
	}
	moveDown() {
		this.y++;
		// Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
		// Include a random element so they start to appear at different times.
		if (this.textRenderer.hasReachedBottom(this.y) && Math.random() > 0.9) {
			this.new();
		}
	}
}

class RainController {
	// textRenderer;  // Knows how to render canvas and text.
	constructor(textRenderer) {
		this.textRenderer = textRenderer;
		// Initialise an instance of the text repository.
		let textRepo = new TextRepository();
		// Populate initial display.
		textRepo.populateFromFile("https://raw.githubusercontent.com/junosuarez/dinosaurs/master/dinosaurs.csv");
		// An array to hold details of the falling text we want to show.
		this.falling_text = new Array(9);
		for (let i = 0; i < this.falling_text.length; i++) {
			this.falling_text[i] = new FallingText(textRepo, this.textRenderer);
		}
	}
	render() {
		// Redraw the canvas on each tick of the interval.
		this.textRenderer.clearCanvas();
		// Loop through the texts to display...
		for (let i = 0; i < this.falling_text.length; i++) {
			let display_text = this.falling_text[i];
			// Display the text.
			display_text.render();
			// Move it down the screen.
			display_text.moveDown();
		}
	}
}

// Look up the canvas element and get the context.
const ctx = document.getElementById("canvas").getContext("2d");
// Create a renderer that uses a canvas size matching the window size.
let textRenderer = new TextRenderer(ctx, window.innerHeight, window.innerWidth);
// Initialise everything.
let rainController = new RainController(textRenderer);
// Be ready to restart the animation if the window size changes.
window.addEventListener("resize", function () {
	textRenderer = new TextRenderer(ctx, window.innerHeight, window.innerWidth);
	rainController = new RainController(textRenderer);
});
// Run the animation.
setInterval(function () {
	rainController.render();
}, 100);
