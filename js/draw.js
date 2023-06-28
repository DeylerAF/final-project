class Board {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
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

        // Add event listener to window object to make canvas responsive
        this.canvas.addEventListener('resize', this.canvasDimensions.bind(this));

        this.canvas.addEventListener('mousedown', this.getMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.getMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.getMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.getMouseOut.bind(this));
        this.canvas.addEventListener('touchstart', this.getTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.getTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.getTouchEnd.bind(this));

        this.lineWidthInput = document.getElementById('line-width');
        this.lineWidthInput.addEventListener('change', this.getLineWidthChange.bind(this));

        this.colorPicker = document.getElementById('color-picker');
        this.colorPicker.addEventListener('change', this.getColorChange.bind(this));

        this.lineTypeRound = document.getElementById('line-type-round');
        this.lineTypeRound.addEventListener('change', this.getLineTypeChange.bind(this));

        this.lineTypeSquare = document.getElementById('line-type-square');
        this.lineTypeSquare.addEventListener('change', this.getLineTypeChange.bind(this));

        this.mirrorModeCheckbox = document.getElementById('mirror-mode');
        this.mirrorModeCheckbox.addEventListener('change', this.getMirrorModeChange.bind(this));

        this.rainbowModeCheckbox = document.getElementById('rainbow-mode');
        this.rainbowModeCheckbox.addEventListener('change', this.getRainbowModeChange.bind(this));

        this.multicolorModeCheckbox = document.getElementById('multicolor-mode');
        this.multicolorModeCheckbox.addEventListener('change', this.getMulticolorModeChange.bind(this));

        this.eraserModeCheckbox = document.getElementById('eraser-mode');
        this.eraserModeCheckbox.addEventListener('change', this.getEraserModeChange.bind(this));

        this.loadImageButton = document.getElementById('load-image');
        this.loadImageButton.addEventListener('click', this.getLoadImage.bind(this));

        this.saveImageButton = document.getElementById('save-image');
        this.saveImageButton.addEventListener('click', this.getSaveImage.bind(this));

        this.clearCanvasButton = document.getElementById('clear-canvas');
        this.clearCanvasButton.addEventListener('click', this.getClear.bind(this));
    }

    canvasDimensions() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    getMouseDown(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        this.startDrawing(x, y);
    }

    getMouseMove(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        this.draw(x, y);
    }

    getMouseUp(e) {
        this.stopDrawing(e);
    }

    getMouseOut(e) {
        this.stopDrawing(e);
    }

    getTouchStart(e) {
        const x = e.touches[0].clientX - this.canvas.offsetLeft;
        const y = e.touches[0].clientY - this.canvas.offsetTop;
        this.startDrawing(x, y);
    }

    getTouchMove(e) {
        e.preventDefault();
        const x = e.touches[0].clientX - this.canvas.offsetLeft;
        const y = e.touches[0].clientY - this.canvas.offsetTop;
        this.draw(x, y);
    }

    getTouchEnd(e) {
        this.stopDrawing();
    }

    getLineWidthChange(e) {
        this.setLineWidth(e.target.value);
    }

    getLineTypeChange(e) {
        this.setLineType(e.target.value);
    }

    getColorChange(e) {
        this.setColor(e.target.value);
        this.pickedColor = e.target.value;
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = false, this.setEraserMode(false)) : null;
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = false, this.setRainbowMode(false)) : null;
        this.multicolorModeCheckbox.checked ? (this.multicolorModeCheckbox.checked = false, this.setMulticolorMode(false)) : null;
    }

    getMirrorModeChange(e) {
        this.setMirrorMode(e.target.checked);
    }

    getRainbowModeChange(e) {
        this.setRainbowMode(e.target.checked);
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = false, this.setEraserMode(false)) : null;
        this.multicolorModeCheckbox.checked ? (this.multicolorModeCheckbox.checked = false, this.setMulticolorMode(false)) : null;
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = true, this.setRainbowMode(true)) : null;
    }

    getMulticolorModeChange(e) {
        this.setMulticolorMode(e.target.checked);
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = false, this.setEraserMode(false)) : null;
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = false, this.setRainbowMode(false)) : null;
        this.multicolorModeCheckbox.checked ? (this.multicolorModeCheckbox.checked = true, this.setMulticolorMode(true)) : null;
    }

    getEraserModeChange(e) {
        this.setEraserMode(e.target.checked);
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = false, this.setRainbowMode(false)) : null;
        this.multicolorModeCheckbox.checked ? (this.multicolorModeCheckbox.checked = false, this.setMulticolorMode(false)) : null;
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = true, this.setEraserMode(true)) : null;
    }

    getSaveImage(e) {
        this.setSaveImage();
        }
        
    getLoadImage(e) {
    this.setLoadImage();
    }

    draw(x, y) {
        if (!this.isDrawing) return;

        this.context.beginPath();
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(x, y);

        this.updateColor();
        this.context.strokeStyle = this.getColorStyle();

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

    getColorStyle() {
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

    getClear(e) {
        this.setClear(e);
    }

    setClear(clear) {
        this.clear = clear;
        clear = this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setColor(colorPicker) {
        this.color = colorPicker;
    }

    setLineWidth(lineWidth) {
        this.lineWidth = lineWidth;
    }

    setLineType(lineType) {
        this.lineCap = lineType;
    }

    setMirrorMode(mirrorMode) {
        this.mirrorMode = mirrorMode;
    }

    setRainbowMode(rainbowMode) {
        this.rainbowMode = rainbowMode;
        this.rainbowMode ? this.pickedColor = this.colorPicker.value : this.setColor(this.pickedColor);
    }

    setMulticolorMode(multicolorMode) {
        this.multicolorMode = multicolorMode;
        this.multicolorMode ? this.pickedColor = this.colorPicker.value : this.setColor(this.pickedColor);
    }

    setEraserMode(eraserMode) {
        if (eraserMode) {
            this.context.globalCompositeOperation = 'destination-out';
        } else {
            this.context.globalCompositeOperation = 'source-over';
        }
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    setSaveImage() {
        const dataUrl = this.canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'myImage.png';
        link.href = dataUrl;
        link.click();
    }

    setLoadImage() {
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
                        this.canvasDimensions();
                        console.log(image.width, image.height);
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

const myBoard = new Board('board');
myBoard.canvasDimensions();
myBoard.setLineWidth(myBoard.lineWidthInput.value);
myBoard.setLineType(myBoard.lineTypeRound.checked ? 'round' : 'square');
myBoard.setColor(myBoard.colorPicker.value);
myBoard.setRainbowMode(myBoard.rainbowMode.checked);
myBoard.setMulticolorMode(myBoard.multicolorMode.checked);
myBoard.setMirrorMode(myBoard.mirrorMode.checked);

console.log(myBoard);