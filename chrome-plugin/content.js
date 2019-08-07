
async function tiffToCanvas(location) {
    let response = await getTiff(location);

    var tiff = new Tiff({ buffer: response });
    var canvas = tiff.toCanvas();

    return canvas;
}

function getTiff(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';

        xhr.open("GET", url);

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

function displayTiffCanvas(domObj) {
    var wrapper = document.createElement("div");
    wrapper.setAttribute("class", "tiff-canvas-wrapper");

    var menuBar = document.createElement("div")
    menuBar.setAttribute("class", "menu-bar");
    wrapper.appendChild(menuBar)

    tifCanvas = domObj.tifCanvas;

    wrapper.appendChild(tifCanvas);
    domObj.embedObj.parentNode.parentNode.replaceChild(wrapper, domObj.embedObj.parentNode);
}

async function getTiffCanvases(domElements) {
    var tiffCanvases = []

    for (let i = 0; i < domElements.length; i++) {
        var embedElement = domElements[i];

        var isAlternatiffContent = embedElement.type == "application/x-alternatiff";
        if (isAlternatiffContent) {

            var canvas = await tiffToCanvas(embedElement.src);

            canvas.setAttribute("class", "tiff-canvas");
            // canvas = setDomElementSize(canvas, dimensions.width + "px", "auto")
            // canvas = setDomElementSize(canvas, "100%", "100%")

            // canvas.setAttribute('style', 'width:' + (dimensions.width) +
            // 'px;');

            domObj = {
                tifCanvas: canvas,
                embedObj: embedElement
            }
            tiffCanvases.push(domObj);
        }
    }

    return tiffCanvases;
}

function setDomElementSize(element, width, height) {
    element.setAttribute('style', 'width:' + (width) + '; height: ' + (height));
    return element;
}


function clearDOM() {
    document.body.innerHTML = "";
}

async function displayCanvases(embedDomElements) {
    tiffCanvases = await getTiffCanvases(embedDomElements);

    // clearDOM();

    for (let i = 0; i < tiffCanvases.length; i++) {
        tiffCanvas = tiffCanvases[i];
        var domObj = tiffCanvas;
        displayTiffCanvas(domObj);
    }

}


var embedDomElements = document.getElementsByTagName("embed");
displayCanvases(embedDomElements);
