/**
 * A TiffOne object.
 * Always call initialize first before you use
 * the object (JavaScript Constructor can't be async)!
 */
class TiffOne {
    constructor(tiffDomElement, targetDomElement, id) {
        this._sourceTiffDomElement = tiffDomElement;
        this._targetDomElement = targetDomElement;
        this._tiffSrc = this._sourceTiffDomElement.src;
        this._viewerId = `TiffOne-${id}`;
        this._currentPage = 1;
    }

    /**
     * (async) Initializes the object by loading the tiff file
     * and creating all necessary components
     */
    async initialize() {
        // get tiff file and its total page count
        this._tiff = await this.getTiff(this._tiffSrc);
        this._totalPageCount = this.getTiffPageCount(this._tiff);

        // Create an array of tiff canvases. (longer loading time, but faster page turns)
        this._tiffCanvases = [];
        for (let i = 1; i <= this._totalPageCount; i++) {
            let pageCanvas = await this.tiffToCanvas(this._tiff, i);
            this._tiffCanvases.push(pageCanvas);
        }

        await this.generateTiffViewer(this._tiffCanvases[0]);
    }

    displayViewer(){
        // this._tiffViewerWrapper.getElementsByClassName("TiffOne-canvas-wrapper")[0].style.height = `${this._sourceTiffDomElement.height}`;
        // this._tiffViewerWrapper.getElementsByClassName("TiffOne-canvas-wrapper")[0].style.width = `${this._sourceTiffDomElement.width}`;
        this._tiffViewerWrapper.querySelectorAll(".TiffOne-canvas-wrapper")[0].style.height = `${this._sourceTiffDomElement.height}`;
        this._tiffViewerWrapper.querySelectorAll(".TiffOne-canvas-wrapper")[0].style.width = `${this._sourceTiffDomElement.width}`;

        this._targetDomElement.parentNode.replaceChild(this._tiffViewerWrapper, this._targetDomElement);
    }

    async generateFullScreenView() {
        let fullscreenWrapper = await this.loadHtmlTemplate("templates/fullscreenTemplate.html");
        // let canvasWrapper = fullscreenWrapper.getElementsByClassName("TiffOne-fullscreen-canvaswrapper")[0];
        let canvasWrapper = fullscreenWrapper.querySelectorAll(".TiffOne-fullscreen-canvaswrapper")[0];
        fullscreenWrapper.appendChild(canvasWrapper);

        // Setup button click event handlers
        let tiffMenuBarButtons = fullscreenWrapper.querySelectorAll(".TiffOne-fsexit-button");
        this.addOnClickListener(tiffMenuBarButtons);


        for (let i = 0; i < this._tiffCanvases.length; i++) {
            let canvas = this.cloneCanvas(this._tiffCanvases[i]);
            canvas.setAttribute("class", "TiffOne-canvas");
            canvasWrapper.appendChild(canvas);
        }
        this._fullscreenWrapper = fullscreenWrapper;
    }

    async displayFullScreen() {
        this._tiffViewerWrapper.appendChild(this._fullscreenWrapper);
        console.log("DisplayFullScreen");
    }



    exitFullScreen() {
        this._tiffViewerWrapper.removeChild(this._fullscreenWrapper);
    }

    /**
     * Generates the full TiffOne viewer. Takes a tiff canvas as an argument.
     */
    async generateTiffViewer(canvasWrapperContent) {

        // Load and create HTML template
        let tiffViewerWrapper = await this.loadHtmlTemplate("templates/tiffInterface.html");
        tiffViewerWrapper.setAttribute("id", this._viewerId);
        let canvasWrapper = document.createElement("div");
        canvasWrapper.setAttribute("class", "TiffOne-canvas-wrapper");
        canvasWrapper.appendChild(canvasWrapperContent);
        tiffViewerWrapper.appendChild(canvasWrapper);

        // Setup button click event handlers
        let tiffMenuBarButtons = tiffViewerWrapper.getElementsByTagName("button");
        let tiffMenuBarButtonDivs = tiffViewerWrapper.querySelectorAll(".TiffOne-Button");
        this.addOnClickListener(tiffMenuBarButtons);
        this.addOnClickListener(tiffMenuBarButtonDivs);

        // let pageIndicator = tiffViewerWrapper.getElementsByClassName("TiffOne-page-indicator")[0];
        let pageIndicator = tiffViewerWrapper.querySelectorAll(".TiffOne-page-indicator")[0];
        pageIndicator.addEventListener("change", this.pageIndicatorChangeListener.bind(this));

        // setupPageIndicator(1, canvasWrapperContent.attributes["totalPages"].value, pageIndicator);
        for (let i = 1; i <= this._totalPageCount; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = i;
            pageIndicator.appendChild(option);
        }
        this._currentPage = 1;
        pageIndicator.value = this._currentPage;

        this._tiffViewerWrapper = tiffViewerWrapper;

        this.generateFullScreenView();
        // return this._tiffViewerWrapper;
    }

    /**
     * Generates an HTML Canvas from a tiff object
     */
    async tiffToCanvas(tiff, page = 1) {
        // Needed because of how the library handles page count
        tiff.setDirectory(0);

        let pageCount = this.getTiffPageCount(tiff);
        if (page > pageCount) {
            page = pageCount;
        } else if (page < 1) {
            page = 1;
        }

        tiff.setDirectory(page - 1);

        let canvas = tiff.toCanvas();
        canvas.setAttribute("class", "TiffOne-canvas");

        // This will not be needed anymore, but doesn't harm anyone :)
        canvas.setAttribute("location", this._tiffSrc);
        canvas.setAttribute("page", page);
        canvas.setAttribute("totalPages", pageCount);

        return canvas;
    }

    /**
     * Loads a Tiff file via AJAX
     */
    getTiff(url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'arraybuffer';

            xhr.open("GET", url);

            xhr.onload = function (e) {
                let tiff = new Tiff({ buffer: xhr.response });
                resolve(tiff);
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    /**
     * Returns the total number of pages in a tiff object
     */
    getTiffPageCount(tiff) {
        this._tiff.setDirectory(0);
        let totalPages = this._tiff.countDirectory();
        return totalPages;
    }



    // ************************************************//
    // Toolbar methods:
    // ************************************************//
    printTiffFile() {
        let wrapper = document.createElement("div");

        for (let i = 0; i < this._tiffCanvases.length; i++) {
            let canvas = this.cloneCanvas(this._tiffCanvases[i]);
            wrapper.appendChild(canvas);

        }

        this.printContent(wrapper);
    }

    changePage(page) {
        let totalPages = this.getTiffPageCount();
        if (page > totalPages) {
            page = totalPages;
        } else if (page < 1) {
            page = 1;
        }

        let canvas = this._tiffCanvases[page-1];
        // let canvasWrapper = this._tiffViewerWrapper.getElementsByClassName("TiffOne-canvas-wrapper")[0];
        // let pageIndicator = this._tiffViewerWrapper.getElementsByClassName("TiffOne-page-indicator")[0];
        let canvasWrapper = this._tiffViewerWrapper.querySelectorAll(".TiffOne-canvas-wrapper")[0];
        let pageIndicator = this._tiffViewerWrapper.querySelectorAll(".TiffOne-page-indicator")[0];
        canvasWrapper.innerHTML = "";
        canvasWrapper.appendChild(canvas);

        this._currentPage = page;
        pageIndicator.value = page;

    }

    nextPage() {
        this.changePage(this._currentPage + 1);
    }

    previousPage(){
        this.changePage(this._currentPage - 1);
    }

    // ************************************************//
    // Event listener methods:
    // ************************************************//
    addOnClickListener(elements) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            element.addEventListener("click", this.buttonClickListener.bind(this));
        }
    }


    buttonClickListener(event) {
        let button = event.srcElement;
        const buttonName = button.getAttribute("name");
        const buttonValue = button.getAttribute("value");
        // console.log(button);
        // console.log(`Button Name: ${buttonName} | Button Value: ${buttonValue}`);
        switch (buttonName) {
            case "tiffPageChange":
                switch (buttonValue) {
                    case "nextPage":
                        this.nextPage();
                        break;
                    case "previousPage":
                        this.previousPage();
                        break;
                    default:
                        break;
                }
                break;
            case "tiffPrint":
                this.printButtonListener();
                break;
            case "tiffFullScreen":
                this.displayFullScreen();
                break;
            case "exitTiffFullScreen":
                this.exitFullScreen();
                break;
            default:
                break;
        }
    }

    pageIndicatorChangeListener(event) {
        let pageIndicator = event.srcElement;
        this.changePage(parseInt(pageIndicator.value));
    }


    printButtonListener() {
        this.printTiffFile(this._tiff);
        // let newCanvas = cloneCanvas(canvas);
        // // let img = newCanvas.toDataURL("image/png");
        // printContent(newCanvas);
    }


    // ************************************************//
    // Helper methods:
    // ************************************************//
    ajaxCall(url, type = "GET") {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            // xhr.responseType = 'arraybuffer';

            xhr.open(type, url);

            xhr.onload = function (e) {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    async loadHtmlTemplate(location) {
        let url = chrome.runtime.getURL(location);
        let templateString = await this.ajaxCall(url, "GET");
        let parser = new DOMParser();
        let htmlDoc = parser.parseFromString(templateString, 'text/html');
        return htmlDoc.body.firstChild;
    }

    async printContent(element) {
        let printPage = await this.loadHtmlTemplate("templates/printTemplate.html");
        printPage.appendChild(element);

        let cssLink = document.createElement('link');
        cssLink.rel = "stylesheet";
        cssLink.type = "text/css";
        cssLink.href = chrome.runtime.getURL("css/printing.css");

        let win1 = window.open();

        win1.document.head.appendChild(cssLink);
        win1.document.body.appendChild(printPage);

        win1.document.close();
        win1.focus();

        // Need to wait a bit so that CSS can be applied. #KindOfAHackButItWorks
        await setTimeout(
            function(){
                win1.print();
                win1.close();
            },
        500);
    }

    cloneCanvas(canvas) {
        let newCanvas = document.createElement('canvas');
        let context = newCanvas.getContext('2d');

        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        context.drawImage(canvas, 0, 0);

        return newCanvas;
    }


}
