import { inputValidator, buildFactories, removeFactory, updateFactory, newFactory } from '/javascripts/utils.mjs';

/*
    Document Object Model (DOM) is ready
*/
$(document).ready(function () {
    let modalView = null;
    const socket = io();

    // Fetch factories list.  
    $.get("/getFactories", function (data) {
        buildFactories(data.data);
        $("#mainAlert").hide();
    }).fail(function (err) {
        errorMessage("feching factories")
    })

    // socket's 'newFactory' event listener.  
    socket.on("newFactory", function (data) {
        newFactory(data)
    });

    // socket's 'deleteFactory' event listener.  
    socket.on("deleteFactory", function (name) {
        removeFactory(name)
    });

    // socket's 'updateFactory' event listener.  
    socket.on("updateFactory", function (data) {
        updateFactory(data.data)
    });

    // onclick click listener for 'Add Factory' button.
    document.getElementById("addFactoryButton").onclick = function (event) {
        modalView = "create";
        document.getElementById("factoryModalLabel").textContent = "Create New Factory"
        document.getElementById('factory-name').disabled = false;
        $('#factoryModal').modal('show');

        // onclick click listener for creating a new factory.
        document.getElementById("generateFactory").onclick = generateFactory;
    }

    // Using Event bubbling to identify 'Edit' / 'Delete' button for factories.
    document.getElementById("factoryRoot").onclick = function (event) {
        event.stopPropagation()
        let element = event.target;
        let parent = element.closest("li[data-factory-name]");
        let name = parent.getAttribute("data-factory-name")
        if (element.hasAttribute("data-factory-action")) {
            let action = element.getAttribute("data-factory-action")
            if (action === "edit") {
                modalView = "edit";
                editFactory(name)
            } else if (action === "delete") {
                deleteFactory(name)
            }
        }
    }
});

// Function to generate new factory.
function generateFactory(event) {
    event.stopPropagation();
    let validator = validateInput();
    if (validator.isValid) {
        $.ajax({
            url: "/createFactory",
            type: "POST",
            data: JSON.stringify(validator.data),
            contentType: 'application/json',
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    $("#mainAlert").hide();
                    $('#factoryModal').modal('hide');
                };
            }
        }).fail(function () {
            $('#factoryModal').modal('hide');
            errorMessage("creating factory")
        })
    } else if (!validator.isValid) {
        $("#madalAlert").show();
        $("#madalAlert").html(validator.errors.join("<br>"))
    }
}

// Function to handle errors.
function errorMessage(message) {
    $("#mainAlert").show();
    $("#mainAlert").html("Server error while " + message);
}

// Function to edit factory.
function editFactory(name) {
    let factoryName = document.querySelector(`li[data-factory-name='${name}'] .factory-name`).textContent
    $("#factory-name").val(factoryName)
    document.getElementById("factoryModalLabel").textContent = "Edit Factory"
    document.getElementById('factory-name').disabled = true;
    $('#factoryModal').modal('show');
    document.getElementById("generateFactory").onclick = function (event) {
        let validator = validateInput();
        console.log(validator);
        if (validator.isValid) {
            $.ajax({
                url: "/updateFactory/" + name,
                type: 'PUT',
                data: JSON.stringify(validator.data),
                contentType: 'application/json',
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if (response.success) {
                        $('#factoryModal').modal('hide');
                    };
                }
            }).fail(function () {
                $('#factoryModal').modal('hide');
                errorMessage("updating factory")
            });

        }
    }
}

// Function to delete factory.
function deleteFactory(name) {
    $.ajax({
        url: "/deleteFactory/" + name,
        type: 'DELETE',
        success: function (response) {
            console.log(response);
        }
    }).fail(function () {
        $('#factoryModal').modal('hide');
        errorMessage("deleting factory")
    });
}


function validateInput() {
    let factoryName = $("#factory-name");
    let factoryMinRange = $("#factory-min-range");
    let factoryMaxRange = $("#factory-max-range");
    let factorychildrenCount = $("#factory-child-nodes");
    return inputValidator(factoryName, factoryMinRange, factoryMaxRange, factorychildrenCount);
}