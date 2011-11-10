(function() {
    var defaultNameValue = "";
    var noNameInput = true;

    function init() {
        var groupSelectId = "watcher_filter_group_select";
        var roleSelectId = "watcher_filter_role_select";
        var nameInputId = "watcher_filter_name_input";
        var applyButtonId = "watcher_filter_apply_button";
        var clearButtonId = "watcher_filter_clear_button";
        var checkButtonId = "watcher_filter_check_button";
        var uncheckButtonId = "watcher_filter_uncheck_button";
        var checkboxName = "issue[watcher_user_ids][]";

        var groupSelect = document.getElementById(groupSelectId);
        var roleSelect = document.getElementById(roleSelectId);
        var nameInput = document.getElementById(nameInputId);
        var applyButton = document.getElementById(applyButtonId);
        var clearButton = document.getElementById(clearButtonId);
        var checkButton = document.getElementById(checkButtonId);
        var uncheckButton = document.getElementById(uncheckButtonId);

        defaultNameValue = nameInput.value;

        addEventListener(
            groupSelect,
            "change",
            function() {
                filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );

        addEventListener(
            roleSelect,
            "change",
            function() {
                filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );

        addEventListener(
            nameInput,
            "focus",
            function() { setBlankName(nameInputId); }
        );

        addEventListener(
            nameInput,
            "blur",
            function() { setDefaultName(nameInputId); }
        );

        addEventListener(
            applyButton,
            "click",
            function() {
                filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );

        addEventListener(
            clearButton,
            "click",
            function() {
                clearConditions(groupSelectId, roleSelectId, nameInputId);
                filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );

        addEventListener(
            checkButton,
            "click",
            function() {
                checkWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );

        addEventListener(
            uncheckButton,
            "click",
            function() {
                uncheckWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName);
            }
        );
    }

    function addEventListener(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, func);
        }
    }

    function setBlankName(nameInputId) {
        var nameInput = document.getElementById(nameInputId);

        if (noNameInput) {
            nameInput.value = "";
        }
    }

    function setDefaultName(nameInputId) {
        var nameInput = document.getElementById(nameInputId);
        var value = nameInput.value.replace(/^\s+|\s+$/g, "");

        if (value === "") {
            nameInput.value = defaultNameValue;
            noNameInput = true;
        } else {
            nameInput.value = value;
            noNameInput = false;
        }
    }

    function clearConditions(groupSelectId, roleSelectId, nameInputId) {
        var groupSelect = document.getElementById(groupSelectId);
        var roleSelect = document.getElementById(roleSelectId);
        var nameInput = document.getElementById(nameInputId);

        groupSelect.selectedIndex = 0;
        roleSelect.selectedIndex = 0;
        nameInput.value = defaultNameValue;
        noNameInput = true;
    }

    function filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName) {
        var func = function(checkbox, condition) {
            checkbox.parentNode.style.display = condition ? "inline" : "none";
        };

        updateWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName, func);
    }

    function checkWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName) {
        var func = function(checkbox, condition) {
            if (condition) {
                checkbox.checked = true;
            }
        };

        updateWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName, func);
    }

    function uncheckWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName) {
        var func = function(checkbox, condition) {
            if (condition) {
                checkbox.checked = false;
            }
        };

        updateWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName, func);
    }

    function updateWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName, func) {
        var userIds = getUserIds(groupSelectId, roleSelectId);
        var name = noNameInput
                 ? ""
                 : document.getElementById(nameInputId).value.toLowerCase();
        var checkboxes = document.getElementsByName(checkboxName);

        for (var i = 0; i < checkboxes.length; i++) {
            var userId = checkboxes[i].value;
            var userName = checkboxes[i].parentNode.lastChild.nodeValue.toLowerCase();
            var j;

            for (j = 0; j < userIds.length; j++) {
                if (userIds[j] === userId && userName.indexOf(name) >= 0) {
                    break;
                }
            }

            func(checkboxes[i], j < userIds.length);
        }
    }

    function getUserIds(groupSelectId, roleSelectId) {
        var groupSelect = document.getElementById(groupSelectId);
        var roleSelect = document.getElementById(roleSelectId);
        var groupValues = groupSelect.options[groupSelect.selectedIndex].value.split(",");
        var roleValues = roleSelect.options[roleSelect.selectedIndex].value.split(",");
        var userIds = [];

        for (var i = 0; i < groupValues.length; i++) {
            for (var j = 0; j < roleValues.length; j++) {
                if (groupValues[i] === roleValues[j]) {
                    userIds.push(groupValues[i]);
                    break;
                }
            }
        }

        return userIds;
    }

    if (window.addEventListener) {
        window.addEventListener("load", init, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", init);
    }
})();
