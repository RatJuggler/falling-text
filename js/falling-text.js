// Look up the canvas element and get the context.
const ctx = document.getElementById("canvas").getContext("2d");

// An array to hold the number of falling texts we want to show.
const falling_text = new Array(9);

// Keep track of the animation interval.
let intervalId;

// Knows how to render text on the canvas.
class TextRenderer {
	constructor(ctx) {
		this.ctx = ctx;
		// The canvas and font sizes govern the number of rows and columns available for text.
		this.font_size = 16;
		this.render_font = this.font_size + "px arial";
		this.row_count = ctx.canvas.height / this.font_size;
		this.column_count = ctx.canvas.width / this.font_size;
	}
	getRandomColumn() {
		return Math.floor(Math.random() * this.column_count);
	}
	hasReachedBottom(row) {
		return row > this.row_count
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
	//text_repo;      // A repository of text to display.
	//text_renderer;  // A renderer to display the text.
	constructor(text_repo, text_renderer) {
		this.text_repo = text_repo;
		this.text_renderer = text_renderer;
		// Start new details.
		this.new();
	}
	new() {
		this.text = this.text_repo.getNextText();
		this.x = this.text_renderer.getRandomColumn();
		this.y = 0;
	}
	render() {
		this.text_renderer.render(this.text, this.x, this.y);
	}
	moveDown() {
		this.y++;
		// Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
		// Include a random element so they start to appear at different times.
		if (this.text_renderer.hasReachedBottom(this.y) && Math.random() > 0.9) {
			this.new();
		}
	}
}

function initialise() {
	// Stop any existing animation.
	clearInterval(intervalId);
	// Make the canvas match the window size.
	ctx.canvas.height = window.innerHeight;
	ctx.canvas.width = window.innerWidth;
	// Initialise an instance of the text renderer.
	let textRenderer = new TextRenderer(ctx);
	// Initialise an instance of the text repository.
	let textRepo = new TextRepository();
	// Populate initial display.
	textRepo.populateFromFile("https://raw.githubusercontent.com/junosuarez/dinosaurs/master/dinosaurs.csv");
	for(let i = 0; i < falling_text.length; i++) {
		falling_text[i] = new FallingText(textRepo, textRenderer);
	}
	// Run the animation.
	intervalId = setInterval(render, 100);
}

// Redraw the canvas on each tick of the interval.
function render() {
	// Use a black background for the canvas with translucency for the trail effect.
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
