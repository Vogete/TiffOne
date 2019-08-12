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

async function tiffToCanvas(tiff, location, page = 1) {
    // let tiffFile = tiff;

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

async function getTiffCanvas(tiffSrc, page = 1) {
    let tiff = await getTiff(tiffSrc);
    let canvas = await tiffToCanvas(tiff, tiffSrc, page);
    return canvas;
}
