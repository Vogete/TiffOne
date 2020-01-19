// helper.js is imported in popup.html

async function getEnabledState() {
    let isEnabledKey = "isEnabled";

    // This is necessary because the chrome.* API
    // does not support Promises or async/await
    // let isEnabledResult = await (function() {
    //     return new Promise(function(resolve) {
    //         chrome.storage.local.get([isEnabledKey], function(result) {
    //             resolve(result);
    //         });
    //     });
    // })();

    let isEnabledResult = await browser.storage.local.get([isEnabledKey]);

    return isEnabledResult[isEnabledKey];
}

async function setEnabledState(state) {
    // TODO: make it cross platform
    // chrome.storage.local.set({isEnabled: state}, function() {
    // });
    browser.storage.local.set({isEnabled: state});
}

function setBrowserIcon(iconName) {
    const iconPath = `../assets/${iconName}`;

    // TODO: make it cross platform
    // chrome.browserAction.setIcon({path: iconPath});
    browser.browserAction.setIcon({path: iconPath});
}
