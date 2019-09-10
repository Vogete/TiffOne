async function getEnabledState() {
    let isEnabledKey = "isEnabled";

    let isEnabledResult = await (function() {
        return new Promise(function(resolve) {
            chrome.storage.local.get([isEnabledKey], function(result) {
                resolve(result);
            });
        });
    })();

    console.log(isEnabledResult[isEnabledKey]);
    return isEnabledResult[isEnabledKey];
}

async function setEnabledState(state) {
    chrome.storage.local.set({isEnabled: state}, function() {
    });
}
