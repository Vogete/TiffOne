function clickHandler(e) {
    console.log(e);
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("test");
    document.querySelector('button').addEventListener('click', clickHandler);
    document.getElementById("click-this").addEventListener("click", clickHandler);
});
