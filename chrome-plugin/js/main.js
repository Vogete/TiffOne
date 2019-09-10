let tiffOnes = [];

let allTiffDomContent = [];

async function replaceTiffs(elements, idStart = 0) {
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];

        let tiffOne = new TiffOne(element, element, idStart+i);
        await tiffOne.initialize();
        tiffOne.displayViewer();

        tiffOnes.push(tiffOne);
    }
}

async function main() {
    // Get Alternatiff elements
    let alternatiffElements = document.querySelectorAll("[type='application/x-alternatiff']");
    // Get all elements which has a tif extentions as source
    let tiffElements = document.querySelectorAll("[src$='tif' i]:not([type='application/x-alternatiff']), [src$='tiff' i]:not([type='application/x-alternatiff'])");

    replaceTiffs(alternatiffElements);
    // TODO: fix ID generation. Low priority, but needs to be fixed :)
    replaceTiffs(tiffElements, alternatiffElements.length);

}

main();
