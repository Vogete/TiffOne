var tiffFile;
var currentPage = 1;

async function tiffToCanvas(tiff, page = 1) {
    var tiffFile = tiff;
    tiff.setDirectory(page - 1);

    let canvas = tiff.toCanvas();
    canvas.setAttribute("class", "tiff-canvas");

    return canvas;
}

function getTiff(url) {
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

async function displayTiffCanvas(tifCanvas, targetElement) {
    let tiffViewerWrapper = await loadHtmlTemplate("templates/tiffInterface.html");

    let canvasWrapper = document.createElement("div");
    canvasWrapper.setAttribute("class", "canvas-wrapper");
    canvasWrapper = setDomElementSize(canvasWrapper, `${targetElement.width}px`, `${targetElement.height-40}px`);
    canvasWrapper.appendChild(tifCanvas);

    tiffViewerWrapper.appendChild(canvasWrapper);

    targetElement.parentNode.replaceChild(tiffViewerWrapper, targetElement);
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

function filterDomElementsByType(elements, type) {
    let filteredElements = [];

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let isSpecifiedType = element.type == type;
        if (isSpecifiedType) {
            filteredElements.push(element);
        }

    }

    return filteredElements;
}

async function getTiffCanvas(domElement, page = 0) {
    let tiff = await getTiff(domElement.src);
    let canvas = await tiffToCanvas(tiff, page);

    let domObj = {
        tifCanvas: canvas,
        embedObj: domElement
    };

    return domObj;
}


function setDomElementSize(element, width, height) {
    element.setAttribute('style', 'width:' + (width) + '; height: ' + (height));
    return element;
}


function loadLocalFile(url) {
    return fetch(url)
        .then((response) => {resolve(response);});

    // return new Promise(function (resolve) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open("GET", url);

    //     xhr.onreadystatechange = function (e) {
    //         resolve(xhr.response);
    //     };

    //     // xhr.send(null);
    // });
}

async function displayCanvases(elements) {

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let domObj = await getTiffCanvas(element);
        displayTiffCanvas(domObj.tifCanvas, domObj.embedObj.parentNode);
    }

}

function setEventListeners() {
    let tiffViewers = document.getElementsByClassName("tiff-viewer");

}


function changePage(element, page) {
    let canvas = tiffToCanvas(tiffFile, page);
    displayTiffCanvas(canvas, element);
    currentPage = page;
}

function nextPage(element) {
    changePage(element, currentPage + 1);
}

let embedDomElements = document.getElementsByTagName("embed");
let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");
displayCanvases(alternatiffElements);


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    console.log(msg);
});
