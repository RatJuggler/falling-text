// Look up the canvas element and get the context.
const ctx = document.getElementById("canvas").getContext("2d");

// An array to hold the number of falling texts we want to show.
const falling_text = new Array(9);

// Keep track of the animation interval.
let intervalId;

// Details of
class RenderFont {
	constructor(ctx) {
		this.ctx = ctx;
		// The canvas and font sizes govern the number of rows and columns available for text.
		this.font_size = 16;
		this.render_font = this.font_size + "px arial";
		this.row_count = ctx.canvas.height / this.font_size;
		this.column_count = ctx.canvas.width / this.font_size;
	}
	render(text, x, y) {
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
	//text_repo;    // A repository of text to display.
	//render_repo;  //
	constructor(text_repo, render_font) {
		this.text_repo = text_repo;
		this.render_font = render_font;
		// Start the text at a random point.
		this.text = this.text_repo.getNextText();
		this.x = Math.floor(Math.random() * this.render_font.column_count);
		this.y = Math.floor(Math.random() * this.render_font.row_count);
	}
	render() {
		this.render_font.render(this.text, this.x, this.y);
	}
	moveDown() {
		this.y++;
		// Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
		if (this.y > this.render_font.row_count && Math.random() > 0.9) {
			this.text = this.text_repo.getNextText();
			this.x = Math.floor(Math.random() * this.render_font.column_count);
			this.y = 0;
		}
	}
}

function initialise() {
	// Stop any existing animation.
	clearInterval(intervalId);
	// Make the canvas match the window size.
	ctx.canvas.height = window.innerHeight;
	ctx.canvas.width = window.innerWidth;
	// Initialise an instance of the font rendering details.
	let renderFont = new RenderFont(ctx);
	// Initialise an instance of the text repository.
	let textRepo = new TextRepository();
	// Populate initial display.
	textRepo.populateFromFile("https://raw.githubusercontent.com/junosuarez/dinosaurs/master/dinosaurs.csv");
	for(let i = 0; i < falling_text.length; i++) {
		falling_text[i] = new FallingText(textRepo, renderFont);
	}
	// Run the animation.
	intervalId = setInterval(render, 100);
}

// Redraw the canvas on each tick of the interval.
function render() {
	// Use a black background for the canvas with translucency for the trail effect.
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	// Set green text in the required font.
	ctx.fillStyle = "#00FF00";
	// Loop through the texts to display...
	for(let i = 0; i < falling_text.length; i++) {
		let display_text = falling_text[i];
		// Display the text.
		display_text.render();
		// Move it down the screen.
		display_text.moveDown();
	}
}

// Be ready to restart the animation if the window size changes.
window.addEventListener("resize", initialise);

// Kick off the animation.
initialise();
