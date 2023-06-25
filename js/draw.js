class Board {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.color = window.getComputedStyle(this.canvas).colorPicker;
        this.lineWidth = window.getComputedStyle(this.canvas).lineWidthInput;
        this.boardColor = window.getComputedStyle(this.canvas).backgroundColor;

        // Add event listener to window object to make canvas responsive
        this.boardSize = window.addEventListener('resize', this.handleResize.bind(this));

        this.setCanvasDimensions();
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

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

    handleResize() {
        this.setCanvasDimensions();
    }
    
    setCanvasDimensions() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
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

    handleTouchStart(event) {
        const x = event.touches[0].clientX - this.canvas.offsetLeft;
        const y = event.touches[0].clientY - this.canvas.offsetTop;
        this.startDrawing(x, y);
    }

    handleTouchMove(event) {
        event.preventDefault();
        const x = event.touches[0].clientX - this.canvas.offsetLeft;
        const y = event.touches[0].clientY - this.canvas.offsetTop;
        this.draw(x, y);
    }

    handleTouchEnd(event) {
        this.stopDrawing();
    }

    handleLineWidthChange(event) {
        this.setLineWidth(event.target.value);
    }

    handleColorChange(event) {
        this.setColor(event.target.value);
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = false, this.setEraserMode(false)) : null;
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
        this.color = eraserMode ? this.boardColor : this.colorPicker.value;
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
}

const myBoard = new Board('board');
myBoard.setLineWidth(myBoard.lineWidthInput.value);
myBoard.setLineType(myBoard.lineTypeRound.checked ? 'round' : 'square');
myBoard.setColor(myBoard.colorPicker.value);

console.log(myBoard);