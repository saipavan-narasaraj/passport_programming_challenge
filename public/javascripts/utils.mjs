
/* 
    This file contains resuable helper function 
*/

// Function to build html elements for list of factories from JSON data
export function buildFactories(data) {
    let root = document.getElementById("factoryRoot")
    let fragment = document.createDocumentFragment();
    data.forEach((factory) => {
        let factoryList = createFactoryTemplate(factory.name, factory.minRange, factory.maxRange)
        let childNodes = createChildrenTemplate(factory.name, factory.children)
        factoryList.appendChild(childNodes)
        fragment.appendChild(factoryList);
    })
    root.appendChild(fragment)
    if (isTouchDevice() === false) {
        $('[data-toggle="tooltip"]').tooltip()
    }
}

// Function to build html elements for new factory and append it to DOM
export function newFactory(data) {
    let root = document.getElementById("factoryRoot")
    let fragment = document.createDocumentFragment();
    let factoryList = createFactoryTemplate(data.name, data.minRange, data.maxRange)
    let childNodes = createChildrenTemplate(data.name, data.children)
    factoryList.appendChild(childNodes)
    fragment.appendChild(factoryList);
    root.appendChild(fragment)
    if (isTouchDevice() === false) {
        $('[data-toggle="tooltip"]').tooltip()
    }
}

// Function to remove factory from DOM
export function removeFactory(name) {
    let factories = document.querySelectorAll('li[data-factory-name]');
    let needToDelete = document.querySelector(`li[data-factory-name='${name}']`);
    let factoriesArray = Array.from(factories)
    let nodeIndex = factoriesArray.indexOf(needToDelete)
    factories[nodeIndex].remove();
}

// Function to update factory element in DOM
export function updateFactory(factory) {
    let factoryNode = document.querySelector(`li[data-factory-name='${factory.name}']`);
    factoryNode.querySelector('.badge').innerHTML = `${factory.minRange} : ${factory.maxRange}`
    let childNodes = createChildrenTemplate(factory.name, factory.children)
    if (childNodes) {
        factoryNode.querySelector('ul').remove();
        factoryNode.append(childNodes)
    }
}
// Function to update factory DOM nodes with new name.
export function updateFactoryName(data) {
    let factoryNode = document.querySelector(`li[data-factory-name='${data.oldName}']`);
    factoryNode.setAttribute("data-factory-name", data.newName)
    factoryNode.getElementsByClassName("factory-name")[0].textContent = data.newName
}

// Function to construct DOM nodes for factories.
function createFactoryTemplate(factoryName, minRange, maxRange) {
    let li = document.createElement('li')
    let div = document.createElement('div');
    let nameDiv = document.createElement('div');
    li.setAttribute("data-factory-name", factoryName)
    div.setAttribute("class", "row")
    nameDiv.setAttribute("class", "col-4 col-md-7 factory-name")
    nameDiv.textContent = factoryName;
    let range = genetarateMicroButtons("range", factoryName, minRange, maxRange)
    let editNameButton = genetarateMicroButtons("editName", factoryName)
    let editChildrenButton = genetarateMicroButtons("editChildren", factoryName)
    let deleteButton = genetarateMicroButtons("delete", factoryName)
    div.appendChild(nameDiv)
    div.appendChild(range)
    div.appendChild(editNameButton)
    div.appendChild(editChildrenButton)
    div.appendChild(deleteButton)
    li.appendChild(div)
    return li
}

// Function to construct DOM nodes for children.
function createChildrenTemplate(factoryName, children) {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < children.length; i++) {
        let li = document.createElement('li');
        li.setAttribute("class", "chilren-name")
        li.textContent = children[i]
        fragment.appendChild(li);
    }
    let ul = document.createElement('ul');
    ul.setAttribute("data-factory-name", factoryName)
    ul.appendChild(fragment)
    return ul
}

// Function to construct DOM nodes for 'edit','delete' buttons and 'bagdes' to show the range.
function genetarateMicroButtons(type, factoryName, minRange = null, maxRange = null) {
    let div = document.createElement('div');
    let button = document.createElement('button');
    let span = document.createElement('span');
    if (type === "range") {
        div.setAttribute("class", "col-2 col-md-2 d-flex flex-row justify-content-center align-items-center")
        span.setAttribute("class", "badge badge-pill badge-secondary factoryRange")
        span.textContent = `${minRange} : ${maxRange}`
        div.appendChild(span)
        return div
    }
    div.setAttribute("class", "col-2 col-md-1 d-flex flex-row justify-content-center align-items-center")
    button.setAttribute("type", "button")
    button.setAttribute("data-toggle", "tooltip")
    button.setAttribute("data-placement", "top")
    span.setAttribute("data-factory-name", factoryName)
    if (type === "editName") {
        button.setAttribute("data-factory-action", "editName")
        button.setAttribute("class", "btn btn-outline-secondary")
        button.setAttribute("title", "Edit Factory Name")
        span.setAttribute("data-factory-action", "editName")
        span.setAttribute("class", "oi oi-pencil")
    } else if (type === "editChildren") {
        button.setAttribute("data-factory-action", "editChildren")
        button.setAttribute("class", "btn btn-outline-secondary")
        button.setAttribute("title", "Edit Child Nodes")
        span.setAttribute("data-factory-action", "editChildren")
        span.setAttribute("class", "oi oi-cog")
    } else if (type === "delete") {
        button.setAttribute("class", "btn btn-outline-secondary")
        button.setAttribute("data-factory-action", "delete")
        button.setAttribute("title", "Delete Factory")
        span.setAttribute("data-factory-action", "delete")
        span.setAttribute("class", "oi oi-trash")
    }
    button.appendChild(span)
    div.appendChild(button)
    return div
}

// Function to validate fanctory name input.
export function validateFactoryName(name) {
    let errors = [];
    let isValid = true;
    let validNameRegex = /^[a-zA-Z0-9\s]*$/;
    let nameVal = name.val().trim();

    if (!nameVal) {
        errors.push("Factory Name is required")
        isValid = false;
    }
    if (nameVal) {
        if (!validNameRegex.test(nameVal)) {
            errors.push("Factory Name is invalid. Input field must only contain characters a-z, A-z, 0-9 and spaces")
            isValid = false;
        }
    }
    if (nameVal.length < 3 || nameVal.length > 50) {
        errors.push("Factory Name should contain 3 to 50 characers.")
        isValid = false;
    }
    if (isValid) {
        return {
            isValid: true,
            data: {
                "name": nameVal
            }
        }
    } else {
        return {
            isValid: false,
            name: nameVal,
            errors: errors
        }
    }
}

// Function to validate user input.
export function inputValidator(name, min, max, childNodes) {
    let errors = [];
    let isValid = true;
    let minVal = parseInt(Math.round(min.val()));
    let maxVal = parseInt(Math.round(max.val()));
    let childNodesVal = parseInt(Math.round(childNodes.val()));

    let nameVal = name.val().trim();
    let validNameRegex = /^[a-zA-Z0-9\s]*$/;
    let threashold = 100000;

    if (!nameVal) {
        errors.push("Factory Name is required")
        isValid = false;
    }

    if (!minVal) {
        errors.push("Min Range is required")
        isValid = false;
    }

    if (!maxVal) {
        errors.push("Max Range is required")
        isValid = false;
    }

    if (!childNodesVal) {
        errors.push("Number of Child Nodes is required")
        isValid = false;
    }

    if (nameVal && minVal && maxVal && childNodesVal) {
        if (!validNameRegex.test(nameVal)) {
            errors.push("Factory Name is invalid. Input field must only contain characters a-z, A-z, 0-9 and spaces")
            isValid = false;
        }

        if (minVal > threashold) {
            errors.push(`Min Range should be less than ${threashold}`)
            isValid = false;
        }

        if (maxVal > threashold) {
            errors.push(`Max Range should be less than ${threashold}`)
            isValid = false;
        }

        if (nameVal.length < 3 || nameVal.length > 50) {
            errors.push("Factory Name should contain 3 to 50 characers.")
            isValid = false;
        }

        if (minVal <= threashold && maxVal <= threashold && minVal > maxVal) {
            errors.push("Min Range Should be less than Max Range")
            isValid = false;
        }

        if (!childNodesVal || childNodesVal < 1) {
            errors.push("Children should be more than 1 child node")
            isValid = false;
        }

        if (childNodesVal > 15) {
            errors.push("Children should be less than 15 ")
            isValid = false;
        }

        if ((maxVal - minVal) < childNodesVal) {
            errors.push(`Cannot generate ${childNodesVal} unique children within the given range ( ${minVal} - ${maxVal} )`)
            isValid = false;
        }
    }
    if (isValid) {
        return {
            isValid: true,
            data: {
                "name": nameVal,
                "minRange": minVal,
                "maxRange": maxVal,
                "childrenCount": childNodesVal
            }
        }
    } else {
        return {
            isValid: false,
            data: {
                "name": nameVal,
                "minRange": minVal,
                "maxRange": maxVal,
                "childrenCount": childNodesVal
            },
            errors: errors
        }
    }
}
// Disable tooltip on touch devices
function isTouchDevice() {
    return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
}