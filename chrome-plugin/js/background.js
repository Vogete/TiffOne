/**
 *  Executing Chrome specific code
 */
async function loadChrome() {

    // On extension install, set the extension to enabled
    chrome.runtime.onInstalled.addListener(function() {
            setEnabledState(true);
    });

    // Code exectution on tab load:
    chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {

            let isEnabled = await getEnabledState();
            if (!isEnabled) {
                setBrowserIcon("TiffOne_logo_48px_grey.png");
                return;
            }

            chrome.tabs.insertCSS({file:"css/variables.css", allFrames: true});
            chrome.tabs.insertCSS({file:"css/styles-fullscreen.css", allFrames: true});
            chrome.tabs.insertCSS({file:"css/styles.css", allFrames: true});
            chrome.tabs.insertCSS({file:"css/font-awesome.min.css", allFrames: true});

            chrome.tabs.executeScript({file: "libs/tiff.min.js", allFrames: true});
            chrome.tabs.executeScript({file: "js/TiffOne.js", allFrames: true});
            chrome.tabs.executeScript({file: "js/main.js", allFrames: true});

        }
    });
}

async function loadFirefox() {
    // TODO: load scripts and CSS for firefox
}


// Opera 8.0+ (tested on Opera 42.0)
let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+ (tested on Firefox 45 - 53)
let isFirefox = typeof InstallTrigger !== 'undefined';

// Internet Explorer 6-11
//   Untested on IE (of course). Here because it shows some logic for isEdge.
let isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+ (tested on Edge 38.14393.0.0)
let isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+ (tested on Chrome 55.0.2883.87)
// This does not work in an extension:
// let isChrome = !!window.chrome && !!window.chrome.webstore;
// The other browsers are trying to be more like Chrome, so picking
// capabilities which are in Chrome, but not in others is a moving
// target.  Just default to Chrome if none of the others is detected.
let isChrome = !isOpera && !isFirefox && !isIE && !isEdge;

// Blink engine detection (tested on Chrome 55.0.2883.87 and Opera 42.0)
let isBlink = (isChrome || isOpera) && !!window.CSS;

/* The above code is based on code from: https://stackoverflow.com/a/9851769/3773011 */
//Verification:
// let log = console.log;
// if(isEdge) log = alert; //Edge console.log() does not work, but alert() does.
// log('isChrome: ' + isChrome);
// log('isEdge: ' + isEdge);
// log('isFirefox: ' + isFirefox);
// log('isIE: ' + isIE);
// log('isOpera: ' + isOpera);
// log('isBlink: ' + isBlink);


if (isBlink) {
    loadChrome();
} else if (isFirefox) {
    loadFirefox();
}

// TODO: cleanup and refactor a bit (especially if firefox support is added)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "TiffOne-Iframe-load"){
        chrome.tabs.insertCSS({file:"css/variables.css", allFrames: true});
        chrome.tabs.insertCSS({file:"css/styles-fullscreen.css", allFrames: true});
        chrome.tabs.insertCSS({file:"css/styles.css", allFrames: true});
        chrome.tabs.insertCSS({file:"css/font-awesome.min.css", allFrames: true});

        chrome.tabs.executeScript({file: "libs/tiff.min.js", allFrames: true});
        chrome.tabs.executeScript({file: "js/TiffOne.js", allFrames: true});
        chrome.tabs.executeScript({file: "js/main.js", allFrames: true});
    }
    sendResponse();
});
