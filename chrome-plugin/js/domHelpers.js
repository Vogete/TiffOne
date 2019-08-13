
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

function setDomElementSize(element, width, height) {
    element.setAttribute('style', 'width:' + (width) + '; height: ' + (height));
    return element;
}

function getTiffViewerRootElement(child) {
    return child.closest(".tiff-viewer");
}

function setupPageIndicator(currentPage, totalPages, pageIndicatorElement) {
    for (let i = 1; i <= totalPages; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        pageIndicatorElement.appendChild(option);
    }
    pageIndicatorElement.value = currentPage;
}
