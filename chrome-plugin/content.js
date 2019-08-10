async function tiffToCanvas(tiff, page = 0) {
    tiff.setDirectory(page);

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
    // test = document.createElement("div");

    let tiffViewerWrapper = document.createElement("div");
    tiffViewerWrapper.setAttribute("class", "tiff-viewer");

    let canvasWrapper = document.createElement("div");
    canvasWrapper.setAttribute("class", "canvas-wrapper");
    canvasWrapper = setDomElementSize(canvasWrapper, targetElement.width + "px", `${targetElement.height-30}px`);

    let menuBar = document.createElement("div");
    menuBar.setAttribute("class", "menu-bar");

    let buttonsWrapper = setupMenuBar();
    menuBar.innerHTML = buttonsWrapper;

    let menuBarUrl = chrome.runtime.getURL("templates/menubar.html");
    console.log(menuBarUrl);
    // test = await fetch(menuBarUrl);

    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", menuBarUrl, true);
    // xhr.send();


    // loadLocalFile(menuBarUrl).then(function(response){
    //     test = document.getElementById(menuBar.id);

    //     test.innerHTML = response;
    //     console.log(response);
    //     console.log("tests");
    // });

    tiffViewerWrapper.appendChild(menuBar);
    canvasWrapper.appendChild(tifCanvas);

    tiffViewerWrapper.appendChild(canvasWrapper);
    // test.appendChild(wrapper);

    targetElement.parentNode.replaceChild(tiffViewerWrapper, targetElement);
}

function setupMenuBar() {
    menubar = `
    <div class="button-wrapper">
        <button>
            <i class="fas fa-print"></i>
        </button>
        <button>
            <i class="fas fa-arrow-left"></i>
        </button>
        <input name="current-page" class="tiff-page-indicator" value="1">
        <button>
            <i class="fas fa-arrow-right"></i>
        </button>
    </div>
    `;
    return menubar;
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


let embedDomElements = document.getElementsByTagName("embed");
let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");
displayCanvases(alternatiffElements);
