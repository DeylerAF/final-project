import Events from './events.js';

class Board extends Events {
    constructor(canvasId) {
        super(canvasId); // Call the constructor of the Events class
        this.isDrawing = false; // Add an isDrawing property to keep track of when the user is drawing
        this.clear = false; // Add a clear property to keep track of when the user is clearing the canvas
        this.lastX = 0; // Add lastX properties to keep track of the last position of the mouse
        this.lastY = 0; // Add lastY properties to keep track of the last position of the mouse
        this.mirrorMode = false; // Add a mirrorMode property to keep track of the mirror mode
        this.rainbowMode = false; // Add a rainbowMode property to keep track of the rainbow mode
        this.eraserMode = false; // Add a eraserMode property to keep track of the eraser mode
        this.pickedColor = this.colorPicker; // Add a pickedColor property to keep track of the picked color
        this.hue = 0; // Add a hue property to keep track of the current hue value
    }

    /* Dimensions properties*/
    canvasDimensions() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    /* Draw tools properties */
    draw(x, y) {
        if (!this.isDrawing) return;

        this.context.beginPath();
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(x, y);

        this.updateColor();
        this.context.strokeStyle = this.updateColorStyle();

        this.context.lineWidth = this.lineWidth;
        this.context.lineCap = this.lineCap;
        this.context.stroke();

        if (this.mirrorMode) {
            this.drawMirroredLine(x, y);
        }

        this.lastX = x;
        this.lastY = y;
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    /* Rainbow mode properties */
    updateColor() {
        this.updateHue();
    }

    updateHue() {
        if (this.hue >= 360) {
            this.hueDecreasing = true;
        } else if (this.hue <= 0) {
            this.hueDecreasing = false;
        }

        if (this.hueDecreasing) {
            this.hue -= 1;
        } else {
            this.hue += 1;
        }
    }

    updateColorStyle() {
        if (this.rainbowMode) {
            return `hsl(${this.hue}, 100%, 50%)`;
        } else {
            return this.color;
        }
    }

    /* Mirror mode properties */
    drawMirroredLine(x, y) {
        const mirrorX = this.canvas.width - x;
        this.context.beginPath();
        this.context.moveTo(mirrorX, y);
        this.context.lineTo(this.canvas.width - this.lastX, this.lastY);
        this.context.stroke();
    }

    /* File tools properties */
    clearCanvas(clear) {
        clear = this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveImage() {
        const dataUrl = this.canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.download = 'canvas.jpg';
        link.href = dataUrl;
        link.click();
    }

    loadImage() {
                const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = new Image();
                    image.onload = () => {
                        this.setCanvasDimensions();
                        this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
                    };
                    image.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
}

const myBoard = new Board('board'); // Create a new instance of the Board class
myBoard.canvasDimensions(); // Set the canvas dimensions
myBoard.setLineWidth(myBoard.lineWidthInput.value); // Set the line width
myBoard.setLineType(myBoard.lineTypeRound.checked ? 'round' : 'square'); // Set the line type
myBoard.setColor(myBoard.colorPicker.value); // Set the color
myBoard.setEraserMode(myBoard.eraserMode.checked); // Set the eraser mode
myBoard.setRainbowMode(myBoard.rainbowMode.checked); // Set the rainbow mode
myBoard.setMirrorMode(myBoard.mirrorMode.checked);  // Set the mirror mode