// async function displayTiffViewer(tifCanvas, targetElement) {
//     let tiffViewerWrapper = await loadHtmlTemplate("templates/tiffInterface.html");

//     let canvasWrapper = document.createElement("div");
//     canvasWrapper.setAttribute("class", "canvas-wrapper");
//     canvasWrapper = setDomElementSize(canvasWrapper, `${targetElement.width}px`, `${targetElement.height-40}px`);
//     canvasWrapper.appendChild(tifCanvas);

//     tiffViewerWrapper.appendChild(canvasWrapper);

//     let tiffMenuBarButtons = tiffViewerWrapper.getElementsByTagName("button");
//     for (let i = 0; i < tiffMenuBarButtons.length; i++) {
//         let element = tiffMenuBarButtons[i];
//         element.addEventListener("click", buttonClickListener);
//     }

//     targetElement.parentNode.replaceChild(tiffViewerWrapper, targetElement);
// }

function displayAlternatiffContent(tiffViewer, targetElement) {
    console.log(targetElement.height)
    tiffViewer.getElementsByClassName("canvas-wrapper")[0].style.height = `${targetElement.height-40}px`;

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
        let tifCanvas = await getTiffCanvas(element.src, 1);
        let tiffViewerWrapper = await generateTiffViewer(tifCanvas);
        displayAlternatiffContent(tiffViewerWrapper, element.parentNode);
        // displayTiffViewer(tifCanvas, element.parentNode);
    }

}

async function changePage(element, page) {
    let rootElement = getTiffViewerRootElement(element);
    let src = element.attributes["location"].value;
    let tifCanvas = await getTiffCanvas(src, page);
    // console.log(domObj);
    element.parentNode.replaceChild(tifCanvas, element);

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

function getTiffViewerRootElement(child) {
    return child.closest(".tiff-viewer");
}

function printContent(element) {
    // TODO
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
