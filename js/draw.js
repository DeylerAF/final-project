import Events from './events.js';

class Board extends Events {
    constructor(canvasId) {
        super(canvasId);
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.boardColor = window.getComputedStyle(this.canvas).backgroundColor;
        this.mirrorMode = false; // Add a mirrorMode property to keep track of the mirror mode
        this.rainbowMode = false;
        this.multicolorMode = false;
        this.eraserMode = false;
        this.pickedColor = this.colorPicker;
        this.hue = 0; // Add a hue property to keep track of the current hue value
        this.saturation = 100; // Add a saturation property to keep track of the current saturation value
        this.lightness = 50; // Add a lightness property to keep track of the current lightness value

    }

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

    updateColor() {
        this.updateHue();
        this.updateSaturation();
        this.updateLightness();
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

    updateSaturation() {
        if (this.saturation >= 100) {
            this.saturationDecreasing = true;
        } else if (this.saturation <= 0) {
            this.saturationDecreasing = false;
        }

        if (this.saturationDecreasing) {
            this.saturation -= .5;
        } else {
            this.saturation += .5;
        }
    }

    updateLightness() {
        if (this.lightness >= 100) {
            this.lightnessDecreasing = true;
        } else if (this.lightness <= 0) {
            this.lightnessDecreasing = false;
        }

        if (this.lightnessDecreasing) {
            this.lightness -= .5;
        } else {
            this.lightness += .5;
        }
    }

    updateColorStyle() {
        if (this.rainbowMode) {
            console.log(this.hue);
            return `hsl(${this.hue}, 100%, 50%)`;
        } else if (this.multicolorMode) {
            console.log(this.hue, this.saturation, this.lightness);
            return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
        } else {
            return this.color;
        }
    }

    drawMirroredLine(x, y) {
        const mirrorX = this.canvas.width - x;
        this.context.beginPath();
        this.context.moveTo(mirrorX, y);
        this.context.lineTo(this.canvas.width - this.lastX, this.lastY);
        this.context.stroke();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }


}

const myBoard = new Board('board');
myBoard.setCanvasDimensions();
myBoard.setLineWidth(myBoard.lineWidthInput.value);
myBoard.setLineType(myBoard.lineTypeRound.checked ? 'round' : 'square');
myBoard.setColor(myBoard.colorPicker.value);
myBoard.setRainbowMode(myBoard.rainbowMode.checked);
myBoard.setMulticolorMode(myBoard.multicolorMode.checked);
myBoard.setMirrorMode(myBoard.mirrorMode.checked);

console.log(myBoard);