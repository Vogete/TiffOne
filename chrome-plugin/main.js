async function tiffToCanvas(tiff, location, page = 1) {
    let tiffFile = tiff;

    let pageCount = tiff.countDirectory();
    if (page > pageCount) {
        page = pageCount;
    } else if (page < 1) {
        page = 1;
    }

    tiff.setDirectory(page - 1);

    let canvas = tiff.toCanvas();
    canvas.setAttribute("class", "tiff-canvas");
    canvas.setAttribute("location", location);
    canvas.setAttribute("page", page);
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

async function displayTiffViewer(tifCanvas, targetElement) {
    let tiffViewerWrapper = await loadHtmlTemplate("templates/tiffInterface.html");

    let canvasWrapper = document.createElement("div");
    canvasWrapper.setAttribute("class", "canvas-wrapper");
    canvasWrapper = setDomElementSize(canvasWrapper, `${targetElement.width}px`, `${targetElement.height-40}px`);
    canvasWrapper.appendChild(tifCanvas);

    tiffViewerWrapper.appendChild(canvasWrapper);

    let tiffMenuBarButtons = tiffViewerWrapper.getElementsByTagName("button");
    for (let i = 0; i < tiffMenuBarButtons.length; i++) {
        let element = tiffMenuBarButtons[i];
        element.addEventListener("click", buttonClickListener);
    }

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

async function getTiffCanvas(domElement, tiffSrc, page = 1) {
    let tiff = await getTiff(tiffSrc);
    let canvas = await tiffToCanvas(tiff, tiffSrc, page);

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

async function displayCanvases(elements) {

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let domObj = await getTiffCanvas(element, element.src, 1);
        displayTiffViewer(domObj.tifCanvas, domObj.embedObj.parentNode);
    }

}

async function changePage(element, page) {
    let rootElement = getTiffViewerRootElement(element);
    let src = element.attributes["location"].value;
    let domObj = await getTiffCanvas(element, src, page);
    // console.log(domObj);
    element.parentNode.replaceChild(domObj.tifCanvas, element);
    currentPage = domObj.tifCanvas.attributes["page"].value;

    rootElement.getElementsByClassName("tiff-page-indicator")[0].value = domObj.tifCanvas.attributes["page"].value;

}

async function nextPage(canvas) {
    let currentPage = parseInt(canvas.attributes["page"].value);
    await changePage(canvas, currentPage + 1);
}

async function previousPage(canvas) {
    let currentPage = parseInt(canvas.attributes["page"].value);
    await changePage(canvas, currentPage + -1);
}

function getTiffViewerRootElement(child) {
    return child.closest(".tiff-viewer");
}

function buttonClickListener(event) {
    let button = event.srcElement;
    let canvas = getTiffViewerRootElement(button).getElementsByClassName("tiff-canvas")[0];
    // let canvas = button.closest(".tiff-viewer").getElementsByClassName("tiff-canvas")[0];

    switch (button.name) {
        case "tiffPageChange":
            switch (button.value) {
                case "nextPage":
                    nextPage(canvas);
                    break;
                case "previousPage":
                    previousPage(canvas);
                    break;
                default:
                    break;
            }
            break;
        case "tiffPrint":
            console.log("print");
            break;
        default:
            break;
    }
}

function printCanvas(canvas) {

}

function printTiff(tiffFile) {

}


let embedDomElements = document.getElementsByTagName("embed");
let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");
displayCanvases(alternatiffElements);
