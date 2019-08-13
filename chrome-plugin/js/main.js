let tiffCollection = {};

function displayAlternatiffContent(tiffViewer, targetElement) {

    tiffViewer.getElementsByClassName("canvas-wrapper")[0].style.height = `${targetElement.height}`;
    tiffViewer.getElementsByClassName("canvas-wrapper")[0].style.width = `${targetElement.width}`;

    targetElement.parentNode.replaceChild(tiffViewer, targetElement);
}

async function generateTiffViewer(tifCanvas) {
    let tiffViewerWrapper = await loadHtmlTemplate("templates/tiffInterface.html");

    let canvasWrapper = document.createElement("div");
    canvasWrapper.setAttribute("class", "canvas-wrapper");
    // canvasWrapper = setDomElementSize(canvasWrapper, `${targetElement.width}px`, `${targetElement.height-40}px`);
    canvasWrapper.appendChild(tifCanvas);

    tiffViewerWrapper.appendChild(canvasWrapper);

    let tiffMenuBarButtons = tiffViewerWrapper.getElementsByTagName("button");
    for (let i = 0; i < tiffMenuBarButtons.length; i++) {
        let element = tiffMenuBarButtons[i];
        element.addEventListener("click", buttonClickListener);
    }

    let pageIndicator = tiffViewerWrapper.getElementsByTagName("select")[0];
    pageIndicator.addEventListener("change", pageIndicatorChangeListener)


    return tiffViewerWrapper;
}

async function loadHtmlTemplate(location) {
    let url = chrome.runtime.getURL(location);
    let templateString = await ajaxCall(url, "GET");
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(templateString, 'text/html');
    return htmlDoc.body.firstChild;
}

function ajaxCall(url, type = "GET") {
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

async function displayCanvases(elements) {

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        // let tifCanvas = await getTiffCanvas(element.src, 1);
        let tiff = await getTiff(element.src);
        tiffCollection[element.src] = tiff;
        let tifCanvas = await tiffToCanvas(tiff, element.src, 1);

        let tiffViewerWrapper = await generateTiffViewer(tifCanvas);
        displayAlternatiffContent(tiffViewerWrapper, element.parentNode);
        setupPageIndicator(1, tiff.countDirectory(), tiffViewerWrapper.getElementsByClassName("tiff-page-indicator")[0]);
    }

}

async function changePage(canvas, page) {
    let rootElement = getTiffViewerRootElement(canvas);
    let src = canvas.attributes["location"].value;

    tiff = tiffCollection[src];

    let tifCanvas = await tiffToCanvas(tiff, src, page);
    canvas.parentNode.replaceChild(tifCanvas, canvas);
    let currentPage = tifCanvas.attributes["page"].value;
    rootElement.getElementsByClassName("tiff-page-indicator")[0].value = currentPage;
}

async function nextPage(canvas) {
    let currentPage = parseInt(canvas.attributes["page"].value);
    await changePage(canvas, currentPage + 1);
}

async function previousPage(canvas) {
    let currentPage = parseInt(canvas.attributes["page"].value);
    await changePage(canvas, currentPage + -1);
}

async function printContent(element) {
    let printPage = await loadHtmlTemplate("templates/printTemplate.html");
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

function cloneCanvas(canvas) {
    let newCanvas = document.createElement('canvas');
    let context = newCanvas.getContext('2d');

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    context.drawImage(canvas, 0, 0);

    return newCanvas;
}


function printCanvas(canvas) {
    // TODO?
}

function printTiff(tiffFile) {
    // TODO?
}


let embedDomElements = document.getElementsByTagName("embed");
let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");
displayCanvases(alternatiffElements);
