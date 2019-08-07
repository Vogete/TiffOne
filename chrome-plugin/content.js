
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

function displayTiffCanvas(canvas) {
    document.body.append(canvas);
    console.log(canvas);
}

async function getTiffCanvases(domElements) {
    var tiffCanvases = []

    for (let i = 0; i < embedDomElements.length; i++) {
        var embedElement = embedDomElements[i];

        var isAlternatiffContent = embedElement.type == "application/x-alternatiff";
        if (isAlternatiffContent) {
            var canvas = await tiffToCanvas(embedElement.src);
            tiffCanvases.push(canvas);
        }
    }

    return tiffCanvases;

}

function clearDOM() {
    document.body.innerHTML = "";
}

async function displayCanvases(embedDomElements) {
    tiffCanvases = await getTiffCanvases(embedDomElements);

    clearDOM();

    for (let i = 0; i < tiffCanvases.length; i++) {
        var canvas = tiffCanvases[i];
        displayTiffCanvas(canvas);
    }

}


var embedDomElements = document.getElementsByTagName("embed");
displayCanvases(embedDomElements);
