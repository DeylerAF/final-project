export default class Events {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId); // Canvas element
        this.context = this.canvas.getContext('2d', { willReadFrequently: true }); // Canvas context

        this.canvas.addEventListener('resize', this.getCanvasDimensions.bind(this)); // Canvas resize event

        /* Canvas cursor events */
        this.canvas.addEventListener('mousedown', this.getMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.getMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.getMouseUp.bind(this));
        this.canvas.addEventListener('mouseout', this.getMouseOut.bind(this));
        this.canvas.addEventListener('touchstart', this.getTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.getTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.getTouchEnd.bind(this));

        /* Canvas draw tools events */
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

        this.eraserModeCheckbox = document.getElementById('eraser-mode');
        this.eraserModeCheckbox.addEventListener('change', this.getEraserModeChange.bind(this));

        /* Canvas file tools events */
        this.loadImageButton = document.getElementById('load-image');
        this.loadImageButton.addEventListener('click', this.getLoadImage.bind(this));

        this.saveImageButton = document.getElementById('save-image');
        this.saveImageButton.addEventListener('click', this.getSaveImage.bind(this));

        this.clearCanvasButton = document.getElementById('clear-canvas');
        this.clearCanvasButton.addEventListener('click', this.getClear.bind(this));

        /* Resize canvas when screen change size */
        this.resizeObserver = new ResizeObserver(this.getCanvasDimensions.bind(this));
        this.resizeObserver.observe(this.canvas.parentElement);
    }

    /* Get canvas dimensions */
    getCanvasDimensions() {
        // Save the current state of the canvas
        const imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Update the canvas dimensions
        this.setCanvasDimensions();

        // Restore the previous state of the canvas
        this.context.putImageData(imageData, 0, 0);
    }

    /* Get cursor events */
    getMouseDown(e) {
        const x = e.offsetX;
        const y = e.offsetY;
        this.startDrawing(x, y);
    }

    getMouseMove(e) {
        e.preventDefault();
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
        this.stopDrawing(e);
    }

    /* Get tools events */
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
    }

    getMirrorModeChange(e) {
        this.setMirrorMode(e.target.checked);
    }

    getRainbowModeChange(e) {
        this.setRainbowMode(e.target.checked);
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = false, this.setEraserMode(false)) : null;
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = true, this.setRainbowMode(true)) : null;
    }

    getEraserModeChange(e) {
        this.setEraserMode(e.target.checked);
        this.rainbowModeCheckbox.checked ? (this.rainbowModeCheckbox.checked = false, this.setRainbowMode(false)) : null;
        this.eraserModeCheckbox.checked ? (this.eraserModeCheckbox.checked = true, this.setEraserMode(true)) : null;
    }

    /* Get file tools events */
    getClear(e) {
        this.setClear(e);
    }

    getSaveImage(e) {
        this.setSaveImage(e);
    }

    getLoadImage(e) {
        this.setLoadImage(e);
    }

    /* Set cursor events */
    setCanvasDimensions() {
        this.canvasDimensions();
    }

    /* Set draw tools events */
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

    setEraserMode(eraserMode) {
        if (eraserMode) {
            this.context.globalCompositeOperation = 'destination-out';
        } else {
            this.context.globalCompositeOperation = 'source-over';
        }
    }

    /* Set file tools events */
    setClear() {
        this.clearCanvas();
    }

    setSaveImage() {
        this.saveImage();
    }

    setLoadImage() {
        this.loadImage();
    }
}