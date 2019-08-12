function buttonClickListener(event) {
    let button = event.srcElement;
    let canvas = getTiffViewerRootElement(button).getElementsByClassName("tiff-canvas")[0];
    // let canvas = button.closest(".tiff-viewer").getElementsByClassName("tiff-canvas")[0];

    switch (button.name) {
        case "tiffPageChange":
            switch (button.value) {
                case "nextPage":
                    nextPage(canvas);
                    break;
                case "previousPage":
                    previousPage(canvas);
                    break;
                default:
                    break;
            }
            break;
        case "tiffPrint":

            console.log("print");
            break;
        default:
            break;
    }
}
