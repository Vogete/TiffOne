
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
