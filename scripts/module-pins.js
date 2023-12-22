console.log("Hi!");

function main() {
    let moduleItems = document.querySelectorAll("li.context_module_item:not(#context_module_item_blank)");
    console.log(`${moduleItems.length} Module Items!!`);

    moduleItems.forEach(listItem => {
        let containerDiv = listItem.querySelector(".ig-row");
        let pinCheckbox = document.createElement("input");
        pinCheckbox.type = "checkbox";
        pinCheckbox.addEventListener("click", () => {
            if (pinCheckbox.checked) {
                moveToTop(listItem);
            }
            else {

            }
        })
        containerDiv.appendChild(pinCheckbox);
    });

}

function moveToTop(moduleItem) {
    let moduleList = document.querySelector("#context_modules");
    moduleList.prepend(moduleItem);
}

setTimeout(() => {
    main();
}, 750);