class Board {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.color = window.getComputedStyle(this.canvas).colorPicker;
        this.lineWidth = window.getComputedStyle(this.canvas).lineWidthInput;
        this.lineCap = 'round';
        this.backgroundColor = window.getComputedStyle(this.canvas).backgroundColor;

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));

        this.lineWidthInput = document.getElementById('line-width');
        this.lineWidthInput.addEventListener('change', this.handleLineWidthChange.bind(this));

        this.colorPicker = document.getElementById('color-picker');
        this.colorPicker.addEventListener('change', this.handleColorChange.bind(this));

        this.lineTypeRound = document.getElementById('line-type-round');
        this.lineTypeRound.addEventListener('change', this.handleLineTypeChange.bind(this));

        this.lineTypeSquare = document.getElementById('line-type-square');
        this.lineTypeSquare.addEventListener('change', this.handleLineTypeChange.bind(this));

        this.eraserModeCheckbox = document.getElementById('eraser-mode');
        this.eraserModeCheckbox.addEventListener('change', this.handleEraserModeChange.bind(this));

        this.loadImageButton = document.getElementById('load-image');
        this.loadImageButton.addEventListener('click', this.handleLoadImage.bind(this));

        this.saveImageButton = document.getElementById('save-image');
        this.saveImageButton.addEventListener('click', this.handleSaveImage.bind(this));

        this.clearCanvasButton = document.getElementById('clear-canvas');
        this.clearCanvasButton.addEventListener('click', this.handleClearCanvas.bind(this));
    }

    handleMouseDown(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        this.startDrawing(x, y);
    }

    handleMouseMove(event) {
        const x = event.offsetX;
        const y = event.offsetY;
        this.draw(x, y);
    }

    handleMouseUp(event) {
        this.stopDrawing();
    }

    handleMouseOut(event) {
        this.stopDrawing();
    }

    handleLineWidthChange(event) {
        this.setLineWidth(event.target.value);
    }

    handleColorChange(event) {
        this.setColor(event.target.value);
    }

    handleLineTypeChange(event) {
        this.setLineType(event.target.value);
    }

    handleEraserModeChange(event) {
        this.setEraserMode(event.target.checked);
    }

    handleLoadImage(event) {
        const imageUrl = prompt('Enter the URL of the image:');
        if (imageUrl) {
            this.loadImage(imageUrl);
        }
    }

    handleSaveImage(event) {
        this.saveImage();
    }

    handleClearCanvas(event) {
        this.clear();
    }

    draw(x, y) {
        if (!this.isDrawing) return;
        this.context.beginPath();
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(x, y);
        this.context.strokeStyle = this.color;
        this.context.lineWidth = this.lineWidth;
        this.context.lineCap = this.lineCap;
        this.context.stroke();
        this.lastX = x;
        this.lastY = y;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    setEraserMode(eraserMode) {
        this.eraserMode = eraserMode;
        this.color = eraserMode ? this.backgroundColor : this.colorPicker.value;
        this.lineCap = this.lineTypeRound.checked ? 'round' : 'square';
    }

    startDrawing(x, y) {
        this.isDrawing = true;
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    saveImage() {
        const dataUrl = this.canvas.toDataURL();
        const link = document.createElement('a');
        link.download = 'myImage.png';
        link.href = dataUrl;
        link.click();
    }

    loadImage(imageUrl) {
        const image = new Image();
        image.onload = () => {
            this.context.drawImage(image, 0, 0);
        };
        image.src = imageUrl;
    }

    resize(width, height) {
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context.putImageData(imageData, 0, 0);
    }
}

const myBoard = new Board('board');
