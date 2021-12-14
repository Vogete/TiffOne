async function getEnabledState() {
    let isEnabledKey = "isEnabled";

    // This is necessary because the chrome.* API
    // does not support Promises or async/await
    let isEnabledResult = await (function() {
        return new Promise(function(resolve) {
            chrome.storage.local.get([isEnabledKey], function(result) {
                resolve(result);
            });
        });
    })();

    return isEnabledResult[isEnabledKey];
}

async function setEnabledState(state) {
    // TODO: make it cross platform
    chrome.storage.local.set({isEnabled: state}, function() {
    });
}

function setBrowserIcon(iconName) {
    const iconPath = `../assets/${iconName}`;

    // TODO: make it cross platform
    chrome.action.setIcon({path: iconPath});
}
