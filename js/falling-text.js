// Look up the canvas element and get the context.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// The canvas and font sizes govern the number of rows and columns available for text.
var font_size = 16;
var render_font = font_size + "px arial";
var rows, columns;

// An array to hold the number of falling texts we want to show.
var falling_text = new Array(9);

// Keep track of the animation interval.
var intervalId;

// A repository of the text availble for falling.
class TextRepository {
	//repository;  // Contains all the text we could use.
	//n;           // Index of the next text to use.
	// Define the inital text to show while the file loads.
	constructor() {
		this.repository = ["TYRANNOSAURUS", "TRICERATOPS", "VELOCIRAPTOR", "STEGOSAURUS", "SPINOSAURUS", "ARCHAEOPTERYX", "BRACHIOSAURUS", "ALLOSAURUS", "APATOSAURUS", "DILOPHOSAURUS"];
		this.n = 0;
	}
	populateFromFile(file) {
		// Extract text from the file split by line and c.
		fetch(file)
			.then(response => response.text())
			.then(text => this.repository = text.split('\n').map(s => s.toUpperCase()));
	}
	getNextText() {
		if (this.n == this.repository.length) {
			this.n = 0;
		}
		return this.repository[this.n++];
	} 
}

// A piece of falling text.
class FallingText {
	//text;  // The text to display.
	//x;     // It's column on the screen.
	//y;     // It's row on the screen.
	constructor(display_text, row_count, column_count) {
		this.text = display_text;
		// Start the text at a random point.
		this.x = Math.floor(Math.random() * column_count);
		this.y = Math.floor(Math.random() * row_count);
	}
	render(in_font_size) {
		ctx.fillText(this.text, this.x * in_font_size, this.y * in_font_size);
	}
	moveDown(row_count, column_count) {
		this.y++;
		// Grab a new text and send the falling item to a new starting position at the top of the screen once it has reached the bottom.
		if (this.y > row_count && Math.random() > 0.9) {
			this.text = textRepo.getNextText();
			this.x = Math.floor(Math.random() * column_count);
			this.y = 0;
		}
	}
}

function intialise() {
	// Stop any existing animation.
	clearInterval(intervalId);
	// Make the canvas match the window size.
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	// Work out how many text rows and columns this gives us.
	rows = canvas.height / font_size;
	columns = canvas.width / font_size;
	// Populate initial display.
	textRepo = new TextRepository();
	textRepo.populateFromFile("https://raw.githubusercontent.com/junosuarez/dinosaurs/master/dinosaurs.csv");
	for(let i = 0; i < falling_text.length; i++) {
		falling_text[i] = new FallingText(textRepo.getNextText(), rows, columns);
	}
	// Run the animation.
	intervalId = setInterval(render, 100);
}

// Redraw the canvas on each tick of the interval.
function render() {
	// Use a black background for the canvas with translucency for the trail effect.
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// Set green text in the required font.
	ctx.fillStyle = "#00FF00";
	ctx.font = render_font;
	// Loop through the texts to display...
	for(let i = 0; i < falling_text.length; i++) {
		let display_text = falling_text[i];
		// Display the text.
		display_text.render(font_size);
		// Move it down the screen.
		display_text.moveDown(rows, columns);
	}
}

// Be ready to restart the animation if the window size changes.
window.addEventListener("resize", intialise);

// Kick off the animation.
intialise();
