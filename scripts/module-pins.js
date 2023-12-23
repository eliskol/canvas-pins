let thisCoursePins = [];
let pinsModule;

let thisCourse = String(document.location.pathname.split("/")[2]);

console.log(`Current course: ${thisCourse}`);

async function mainFunc() {
    let moduleItems = document.querySelectorAll("li.context_module_item:not(#context_module_item_blank)");
    console.log(`${moduleItems.length} Module Items!!`);

    // grab pins
    await chrome.storage.local.get(thisCourse).then(async (result) => {
        thisCoursePins = result[thisCourse];
        console.log(`Pins: ${thisCoursePins}`);
        if (!thisCoursePins) {
            thisCoursePins = [];
            let tmp = {};
            tmp[thisCourse] = thisCoursePins;
            await chrome.storage.local.set(tmp).then(() => {
                console.log("Initialized pins for this course.");
            });
        }
    });

    pinsModule = createPinsModule()
    moveToTop(pinsModule);

    // add pin checkbox to each module item
    moduleItems.forEach(listItem => {
        let containerDiv = listItem.querySelector(".ig-row");
        let pinCheckbox = document.createElement("input");
        pinCheckbox.type = "checkbox";
        pinCheckbox.addEventListener("click", async () => {
            await chrome.storage.local.get(thisCourse).then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
                thisCoursePins = result[thisCourse];
            });
            if (pinCheckbox.checked && !thisCoursePins.includes(listItem.id)) {
                thisCoursePins.push(listItem.id);
            }
            else if (!pinCheckbox.checked && thisCoursePins.includes(listItem.id)) {
                thisCoursePins.pop(thisCoursePins.indexOf(listItem.id));
            }
            let tmp = {};
            tmp[thisCourse] = thisCoursePins;
            await chrome.storage.local.set(tmp).then(() => {
                console.log("Updated pins");
                console.log(thisCoursePins);
            });
            await chrome.storage.local.get(thisCourse).then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
            });
            updatePinsModule(thisCoursePins);
        });
        if (thisCoursePins.includes(listItem.id)) {
            pinCheckbox.checked = true;
            console.log("checkd");
        }
        containerDiv.appendChild(pinCheckbox);
    });

    updatePinsModule(thisCoursePins);

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

function updatePinsModule(thisCoursePins) {
    let contentDiv = pinsModule.querySelector("div.content");
    contentDiv.innerHTML = "";
    thisCoursePins.forEach(listItemId => {
        let listItem = document.querySelector(`#${listItemId}`);
        let listItemInPinsModule = listItem.cloneNode(true);
        let listItemInPinsModuleCheckbox = listItemInPinsModule.querySelector("input[type='checkbox']");
        listItemInPinsModuleCheckbox.addEventListener("click", async () => {
            await chrome.storage.local.get(thisCourse).then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
                thisCoursePins = result[thisCourse]
            });
            if (listItemInPinsModuleCheckbox.checked && !thisCoursePins.includes(listItem.id)) {
                thisCoursePins.push(listItem.id);
            }
            else if (!listItemInPinsModuleCheckbox.checked && thisCoursePins.includes(listItem.id)) {
                thisCoursePins.pop(thisCoursePins.indexOf(listItem.id));
                document.querySelectorAll(`#${listItem.id} input[type='checkbox']`)[1].checked = false;
            }
            let tmp = {};
            tmp[thisCourse] = thisCoursePins;
            await chrome.storage.local.set(tmp).then(() => {
                console.log("Updated pins");
            });
            await chrome.storage.local.get(thisCourse).then((result) => {
                console.log("Value currently is " + JSON.stringify(result));
            });
            updatePinsModule(thisCoursePins);
        });
        contentDiv.appendChild(listItemInPinsModule);
    });
}

setTimeout(() => {
    mainFunc();
}, 500);