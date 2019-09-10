async function onOffSwitchClicked(event) {
    let switchButton = event.srcElement;
    let isChecked = switchButton.checked;

    setEnabledState(isChecked);
}

async function setOnOffSwitchState(onOffSwitch) {
    let isEnabled = await getEnabledState();

    // console.log(isEnabled);
    onOffSwitch.checked = isEnabled;
}

let onOffSwitch = document.getElementById("onOffSwitch");
onOffSwitch.addEventListener("click", onOffSwitchClicked);

setOnOffSwitchState(onOffSwitch);
