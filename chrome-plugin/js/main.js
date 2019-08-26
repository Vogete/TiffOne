let tiffOnes = [];

let allTiffDomContent = [];

async function replaceTiffs(elements) {
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let tiffOne = new TiffOne(element, element, i);
        await tiffOne.initialize();
        tiffOne.displayViewer();

        tiffOnes.push(tiffOne);
    }
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

// Get Alternatiff elements
// let embedDomElements = document.getElementsByTagName("embed");
// let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");

// Get all elements which has a tif extentions as source
let tiffElements = document.querySelectorAll("[src$='tif' i], [src$='tiff' i]");

replaceTiffs(tiffElements);
