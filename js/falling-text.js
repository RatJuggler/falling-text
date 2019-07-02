// Look up the canvas element and get the context.
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Make the canvas full screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// The canvas and font sizes govern the number of rows and columns available for text.
var font_size = 16;
var render_font = font_size + "px arial";
var rows = canvas.height / font_size;
var columns = canvas.width / font_size;

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
		// Randomly send the text back to a new starting position at the top of the screen once it has reached the bottom.
		if (this.y > row_count && Math.random() > 0.9) {
			this.x = Math.floor(Math.random() * column_count);
			this.y = 0;
		}
	}
}

// Define some text to show.
var text = ["Tyrannosaurus Rex", "Triceratops", "Velociraptor", "Stegosaurus", "Spinosaurus", "Archaeopteryx", "Brachiosaurus", "Allosaurus", "Apatosaurus", "Dilophosaurus"];
// The number of pieces of falling text.
var falling_texts = text.length;
// An array to hold the falling texts.
var falling_text = [];
// Populate initial display.
for(var i = 0; i < falling_texts; i++) {
	falling_text[i] = new FallingText(text[i], rows, columns);
}

// Render everything to the screen.
function render() {
	// Use a black background for the canvas with translucency for the trail effect.
	ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	// Set green text in the required font.
	ctx.fillStyle = "#00FF00";
	ctx.font = render_font;
	// Loop through the texts to display...
	for(var i = 0; i < falling_texts; i++) {
		var display_text = falling_text[i];
		// Display the text.
		display_text.render(font_size);
		// Move it down the screen.
		display_text.moveDown(rows, columns);
	}
}

// Run the animation.
setInterval(render, 100);
