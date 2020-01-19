// Popup.js is imported in popup.html

async function onOffSwitchClicked(event) {
    let switchButton = event.srcElement;
    let isChecked = switchButton.checked;

    setEnabledState(isChecked);
    setStatusIndicator(isChecked);
}

async function setOnOffSwitchState(onOffSwitch) {
    let isEnabled = await getEnabledState();

    onOffSwitch.checked = isEnabled;
    setStatusIndicator(isEnabled);
}

function setStatusIndicator(status) {
    let statusIndicator = document.getElementById("status-indicator");

    if (status == true) {
        statusIndicator.innerText = "ON";
        statusIndicator.classList.remove("color-error");
        statusIndicator.classList.add("color-ok");
        setBrowserIcon("TiffOne_logo_48px.png");
        return;
    }
    statusIndicator.innerText = "OFF";
    statusIndicator.classList.remove("color-ok");
    statusIndicator.classList.add("color-error");
    setBrowserIcon("TiffOne_logo_48px_grey.png");
}

let onOffSwitch = document.getElementById("onOffSwitch");
onOffSwitch.addEventListener("click", onOffSwitchClicked);

setOnOffSwitchState(onOffSwitch);
