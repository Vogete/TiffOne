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

            chrome.scripting.insertCSS({target: {tabId: tabId}, files:["css/variables.css"]});
            chrome.scripting.insertCSS({target: {tabId: tabId}, files:["css/styles-fullscreen.css"]});
            chrome.scripting.insertCSS({target: {tabId: tabId}, files:["css/styles.css"]});
            chrome.scripting.insertCSS({target: {tabId: tabId}, files:["css/font-awesome.min.css"]});

            // chrome.scripting.insertCSS({file:"css/styles-fullscreen.css", allFrames: true});
            // chrome.scripting.insertCSS({file:"css/styles.css", allFrames: true});
            // chrome.scripting.insertCSS({file:"css/font-awesome.min.css", allFrames: true});

            chrome.scripting.executeScript({target: {tabId: tabId}, files:["libs/tiff.min.js"]});
            chrome.scripting.executeScript({target: {tabId: tabId}, files:["js/TiffOne.js"]});
            chrome.scripting.executeScript({target: {tabId: tabId}, files:["js/main.js"]});

            addMessageListeners();
        }
    });

}

async function loadFirefox() {
    // TODO: load scripts and CSS for firefox
}

/*
// Opera 8.0+ (tested on Opera 42.0)
let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+ (tested on Firefox 45 - 53)
let isFirefox = typeof InstallTrigger !== 'undefined';

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

// The above code is based on code from: https://stackoverflow.com/a/9851769/3773011 //
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
*/

// had to take out the browser detection script because of Chrome Extension Manifest V3
loadChrome();

function addMessageListeners() {

    // TODO: cleanup and refactor a bit (especially if firefox support is added)
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        // Needed for iframe load to inject the contents into all iframes
        // TODO: clean up code so it only injects into new iframes that has no TiffOne yet
        if (request.type == "TiffOne-Iframe-load"){

            chrome.scripting.insertCSS({file:"css/variables.css", allFrames: true});
            chrome.scripting.insertCSS({file:"css/styles-fullscreen.css", allFrames: true});
            chrome.scripting.insertCSS({file:"css/styles.css", allFrames: true});
            chrome.scripting.insertCSS({file:"css/font-awesome.min.css", allFrames: true});

            chrome.scripting.executeScript({file: "libs/tiff.min.js", allFrames: true});
            chrome.scripting.executeScript({file: "js/TiffOne.js", allFrames: true});
            chrome.scripting.executeScript({file: "js/main.js", allFrames: true});
            sendResponse(true);
        }

        if (request.type == "TiffOne-getTiffFile") {
            // TODO: clean up this mess :) (works, but not nice)
            // If the Tiff content is CORS or a file, the background has to fetch it
            // (Starting from Chrome 80)


            // TODO: Needs to be implemented properly, but fetch() does not work yet with files.
            // https://groups.google.com/a/chromium.org/g/chromium-extensions/c/U6TpTj6C7ac
            fetch(request.message)
                .then(response => console.log(response))
                .catch(errorr => console.error(errorr))

            // TODO: This whole XMLHttpRequest (native JS AJAX calls) needs to be replaced with fetch()
            // But currently fetch does not allow file:// loading. which is annoying.
            // https://developer.chrome.com/docs/extensions/mv3/xhr/
            let xhrPromise = new Promise(function (resolve, reject) {
                const tifFileRegex = new RegExp("^(file:(\\/{3}|\\/{2}))(\\w*)(.*)(\\.(tiff|tif))$", "i");
                const isRegexMatch = tifFileRegex.test(request.message);
                if (!isRegexMatch) {
                    // console.log(`${isRegexMatch}  -  ${request.message}`);
                    reject({
                        status: this.status,
                        statusText: "BLOCKED: invalid file path"
                    });
                }

                let xhr = new XMLHttpRequest();
                xhr.responseType = 'arraybuffer';
                xhr.onload = function (e) {
                    resolve(xhr.response);
                };
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };

                xhr.open("GET", request.message, true);
                xhr.send(null);
            });

            xhrPromise.then(function(tiffArrayBuffer) {
                // blob is needed to
                let blob = new Blob([ tiffArrayBuffer ], { type: 'arraybuffer' });
                sendResponse(URL.createObjectURL(blob));
            });

        }

        // Needed for Async sendResponse
        return true; // keeps the message channel open until `sendResponse` is executed

    });

}
