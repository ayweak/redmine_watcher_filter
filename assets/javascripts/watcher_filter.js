(function() {
    function init() {
        var groupSelectId = "watcher_filter_group_select";
        var roleSelectId = "watcher_filter_role_select";
        var checkButtonId = "watcher_filter_check_button";
        var uncheckButtonId = "watcher_filter_uncheck_button";
        var checkboxName = "issue[watcher_user_ids][]";

        var groupSelect = document.getElementById(groupSelectId);
        var roleSelect = document.getElementById(roleSelectId);
        var checkButton = document.getElementById(checkButtonId);
        var uncheckButton = document.getElementById(uncheckButtonId);

        addEventListener(
            groupSelect,
            "change",
            function() {
                filterWatchers(groupSelectId, roleSelectId, checkboxName);
            }
        );

        addEventListener(
            roleSelect,
            "change",
            function() {
                filterWatchers(groupSelectId, roleSelectId, checkboxName);
            }
        );

        addEventListener(
            checkButton,
            "click",
            function() {
                checkWatchers(groupSelectId, roleSelectId, checkboxName);
            }
        );

        addEventListener(
            uncheckButton,
            "click",
            function() {
                uncheckWatchers(groupSelectId, roleSelectId, checkboxName);
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

    function filterWatchers(groupSelectId, roleSelectId, checkboxName) {
        var func = function(checkbox, condition) {
            checkbox.parentNode.style.display = condition ? "inline" : "none";
        };

        updateWatchers(groupSelectId, roleSelectId, checkboxName, func);
    }

    function checkWatchers(groupSelectId, roleSelectId, checkboxName) {
        var func = function(checkbox, condition) {
            checkbox.checked = condition ? true : false;
        };

        updateWatchers(groupSelectId, roleSelectId, checkboxName, func);
    }

    function uncheckWatchers(groupSelectId, roleSelectId, checkboxName) {
        var func = function(checkbox, condition) {
            checkbox.checked = condition ? false : true;
        };

        updateWatchers(groupSelectId, roleSelectId, checkboxName, func);
    }

    function updateWatchers(groupSelectId, roleSelectId, checkboxName, func) {
        var groupSelect = document.getElementById(groupSelectId);
        var roleSelect = document.getElementById(roleSelectId);
        var userIds = getUserIds(groupSelect, roleSelect);
        var checkboxes = document.getElementsByName(checkboxName);

        for (var i = 0; i < checkboxes.length; i++) {
            var userId = checkboxes[i].value;
            var j;

            for (j = 0; j < userIds.length; j++) {
                if (userIds[j] === userId) {
                    break;
                }
            }

            func(checkboxes[i], j < userIds.length);
        }
    }

    function getUserIds(groupSelect, roleSelect) {
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
