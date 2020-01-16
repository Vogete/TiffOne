let tiffOnes = [];

let allTiffDomContent = [];

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


async function replaceTiffs(elements, idStart = 0) {
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let tiffOne = new TiffOne(element, element, uuidv4());
        await tiffOne.initialize();
        tiffOne.displayViewer();

        tiffOnes.push(tiffOne);
    }
}

async function runTiffOneOnDocumentObject(documentObj) {
    // console.log("TiffOne runs");

    let alternatiffElements = documentObj.querySelectorAll("[type='application/x-alternatiff']");
    // Get all elements which has a tif extentions as source
    let tiffElements = documentObj.querySelectorAll("[src$='tif' i]:not([type='application/x-alternatiff']), [src$='tiff' i]:not([type='application/x-alternatiff'])");

    replaceTiffs(alternatiffElements);
    replaceTiffs(tiffElements);
}

// async function main() {
//     // Get Alternatiff elements
//     let alternatiffElements = document.querySelectorAll("[type='application/x-alternatiff']");
//     // Get all elements which has a tif extentions as source
//     let tiffElements = document.querySelectorAll("[src$='tif' i]:not([type='application/x-alternatiff']), [src$='tiff' i]:not([type='application/x-alternatiff'])");

//     console.log(alternatiffElements);

//     replaceTiffs(alternatiffElements);
//     // TODO: fix ID generation. Low priority, but needs to be fixed :)
//     replaceTiffs(tiffElements, alternatiffElements.length);

// }

// main();

function createMutationObserver(domObject) {

    let dom_observer = new MutationObserver(function (mutation) {
        runTiffOneOnDocumentObject(document);
        // console.log("Mutation detected")

        domObject.querySelectorAll('iframe').forEach(iframeElement => {
            // createMutationObserver(iframeElement.contentWindow.document);
            // console.log("iframe Mutation observer fired");

            iframeElement.addEventListener('load', function() {

                chrome.runtime.sendMessage({
                    type: "TiffOne-Iframe-load", options: {
                        type: "basic",
                        title: "Iframe loaded",
                        message: "Iframe loaded"
                    }
                });
                // console.log("iframe loaded");
                // runTiffOneOnDocumentObject(iframeElement.contentWindow.document)
            }, true);
        });

    });

    var container = domObject;
    var config = { attributes: true, childList: true, characterData: true };
    dom_observer.observe(container, config);

}

createMutationObserver(document.body);
runTiffOneOnDocumentObject(document);
