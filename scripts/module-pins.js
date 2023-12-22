console.log("Hi!");

let pins = [];

async function mainFunc() {
    let moduleItems = document.querySelectorAll("li.context_module_item:not(#context_module_item_blank)");
    console.log(`${moduleItems.length} Module Items!!`);

    // grab pins
    await chrome.storage.local.get("pins").then((result) => {
        pins = result.pins;
        console.log(pins);
    });

    // add pin checkbox to each module item
    moduleItems.forEach(listItem => {
        let containerDiv = listItem.querySelector(".ig-row");
        let pinCheckbox = document.createElement("input");
        pinCheckbox.type = "checkbox";
        pinCheckbox.addEventListener("click", async () => {
            if (pinCheckbox.checked) {
                // moveToTop(listItem);
                if (!pins.includes(listItem.id)){
                    pins.push(listItem.id);
                    await chrome.storage.local.set({ "pins": pins }).then(() => {
                        console.log("Updated pins");
                    });
                    await chrome.storage.local.get("pins").then((result) => {
                        console.log("Value currently is " + JSON.stringify(result));
                    });
                }
            }
            else {

            }
        });
        if (pins.includes(listItem.id)) {
            pinCheckbox.checked = true;
            console.log("checkd");
        }
        containerDiv.appendChild(pinCheckbox);
    });

}

function moveToTop(moduleItem) {
    let moduleList = document.querySelector("#context_modules");
    moduleList.prepend(moduleItem);
}

setTimeout(() => {
    mainFunc();
}, 750);