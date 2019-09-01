// Code exectution on tab load:
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {

        chrome.tabs.insertCSS({file:"css/variables.css"});
        chrome.tabs.insertCSS({file:"css/styles-fullscreen.css"});
        chrome.tabs.insertCSS({file:"css/styles.css"});
        chrome.tabs.insertCSS({file:"css/font-awesome.min.css"});

        chrome.tabs.executeScript({file: "libs/tiff.min.js"});
        chrome.tabs.executeScript({file: "js/TiffOne.js"});
        chrome.tabs.executeScript({file: "js/main.js"});

    }
});
