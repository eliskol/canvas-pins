let pins = [];
let pinsModule;

async function mainFunc() {
    let moduleItems = document.querySelectorAll("li.context_module_item:not(#context_module_item_blank)");
    console.log(`${moduleItems.length} Module Items!!`);

    // grab pins
    await chrome.storage.local.get("pins").then((result) => {
        pins = result.pins;
        console.log(pins);
    });

    if (pins != []) {
        pinsModule = createPinsModule()
        moveToTop(pinsModule);
    }

    // add pin checkbox to each module item
    moduleItems.forEach(listItem => {
        let containerDiv = listItem.querySelector(".ig-row");
        let pinCheckbox = document.createElement("input");
        pinCheckbox.type = "checkbox";
        pinCheckbox.addEventListener("click", async () => {
            await chrome.storage.local.get("pins").then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
                pins = result.pins
            });
            if (pinCheckbox.checked && !pins.includes(listItem.id)) {
                pins.push(listItem.id);
            }
            else if (!pinCheckbox.checked && pins.includes(listItem.id)) {
                pins.pop(pins.indexOf(listItem.id));
            }
            await chrome.storage.local.set({ "pins": pins }).then(() => {
                console.log("Updated pins");
            });
            await chrome.storage.local.get("pins").then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
            });
            updatePinsModule(pins);
        });
        if (pins.includes(listItem.id)) {
            pinCheckbox.checked = true;
            console.log("checkd");
        }
        containerDiv.appendChild(pinCheckbox);
    });

    updatePinsModule(pins);

}

function moveToTop(moduleItem) {
    let moduleList = document.querySelector("#context_modules");
    moduleList.prepend(moduleItem);
}

function createPinsModule() {
    let pinsModule = document.createElement("div");
    pinsModule.classList.add("context_module");
    pinsModule.classList.add("item-group-condensed");

    let headerDiv = document.createElement("div");
    headerDiv.classList.add("ig-header");
    headerDiv.classList.add("header");

    let headerSpan = document.createElement("span");
    headerSpan.classList.add("ig-header-title");
    headerSpan.innerText = "Pins";

    let contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    headerDiv.appendChild(headerSpan);
    pinsModule.appendChild(headerDiv);
    pinsModule.appendChild(contentDiv);

    return pinsModule;
}

function updatePinsModule(pins) {
    let contentDiv = pinsModule.querySelector("div.content");
    contentDiv.innerHTML = "";
    pins.forEach(listItemId => {
        let listItem = document.querySelector(`#${listItemId}`);
        contentDiv.appendChild(listItem.cloneNode(true));
    });
}

setTimeout(() => {
    mainFunc();
}, 500);