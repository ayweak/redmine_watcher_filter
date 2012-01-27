(function() {
    var defaultGroupIndex = 0;
    var defaultRoleIndex = 0;
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

        defaultGroupIndex = groupSelect.selectedIndex;
        defaultRoleIndex = roleSelect.selectedIndex;
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
            function() { setWatcherChecks(checkboxName, true); }
        );

        addEventListener(
            uncheckButton,
            "click",
            function() { setWatcherChecks(checkboxName, false); }
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
            noNameInput = false;
        }
    }

    function setDefaultName(nameInputId) {
        var nameInput = document.getElementById(nameInputId);
        var value = trim(nameInput.value);

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

        groupSelect.selectedIndex = defaultGroupIndex;
        roleSelect.selectedIndex = defaultRoleIndex;
        nameInput.value = defaultNameValue;
        noNameInput = true;
    }

    function filterWatchers(groupSelectId, roleSelectId, nameInputId, checkboxName) {
        var userIds = getUserIds(groupSelectId, roleSelectId);
        var name = noNameInput
                 ? ""
                 : trim(document.getElementById(nameInputId).value).toLowerCase();
        var checkboxes = document.getElementsByName(checkboxName);

        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = checkboxes[i];
            var userId = checkbox.value;
            var userName = checkbox.parentNode.lastChild.nodeValue.toLowerCase();
            var j;

            for (j = 0; j < userIds.length; j++) {
                if (userIds[j] === userId && userName.indexOf(name) >= 0) {
                    break;
                }
            }

            checkbox.parentNode.style.display = j < userIds.length ? "inline" : "none";
        }
    }

    function setWatcherChecks(checkboxName, value) {
        var checkboxes = document.getElementsByName(checkboxName);

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].parentNode.style.display !== "none") {
                checkboxes[i].checked = value;
            }
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

    function trim(str) {
        var result = "";

        if (str !== undefined && str !== null) {
            result = String(str).replace(/^\s+|\s+$/g, "");
        }

        return result;
    }

    if (window.addEventListener) {
        window.addEventListener("load", init, false);
    } else if (window.attachEvent) {
        window.attachEvent("onload", init);
    }
})();
