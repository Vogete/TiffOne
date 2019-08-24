let tiffOnes = [];

let allTiffDomContent = [];

async function replaceTiffs(elements) {
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let tiffOne = new TiffOne(element, element, i);
        await tiffOne.initialize();
        tiffOnes.push(tiffOne);
    }
}

let embedDomElements = document.getElementsByTagName("embed");
let alternatiffElements = filterDomElementsByType(embedDomElements, "application/x-alternatiff");
let tiffElements = document.querySelectorAll("[src$='tif']");

replaceTiffs(alternatiffElements);
// replaceTiffs(tiffElements);
