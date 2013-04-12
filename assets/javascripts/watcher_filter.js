// -*- coding: utf-8 -*-

(function() {
    var FILTER_FORM_ID = "watcher_filter_form";
    var NONMEMBER_SELECT_ID = "watcher_filter_nonmember_select";
    var GROUP_SELECT_ID = "watcher_filter_group_select";
    var ROLE_SELECT_ID = "watcher_filter_role_select";
    var NAME_KEYWORD_INPUT_ID = "watcher_filter_name_keyword_input";
    var APPLY_BUTTON_ID = "watcher_filter_apply_button";
    var CLEAR_BUTTON_ID = "watcher_filter_clear_button";
    var CHECK_BUTTON_ID = "watcher_filter_check_button";
    var UNCHECK_BUTTON_ID = "watcher_filter_uncheck_button";

    var CHECKBOX_NAME = "issue[watcher_user_ids][]";
    var ISSUE_FORM_ID = "issue-form";
    var WATCHERS_FORM_ID = "watchers_form";
    var NEW_WATCHER_FORM_DIV_ID = "ajax-modal";

    var NONMEMBER_SHOW = "SHOW";
    var NONMEMBER_HIDE = "HIDE";
    var NONMEMBER_ONLY = "ONLY";

    var noNameKeywordInput = true;

    function init() {
        var nonmemberSelect = document.getElementById(NONMEMBER_SELECT_ID);
        var groupSelect = document.getElementById(GROUP_SELECT_ID);
        var roleSelect = document.getElementById(ROLE_SELECT_ID);
        var nameKeywordInput = document.getElementById(NAME_KEYWORD_INPUT_ID);
        var applyButton = document.getElementById(APPLY_BUTTON_ID);
        var clearButton = document.getElementById(CLEAR_BUTTON_ID);
        var checkButton = document.getElementById(CHECK_BUTTON_ID);
        var uncheckButton = document.getElementById(UNCHECK_BUTTON_ID);
        var issueForm = document.getElementById(ISSUE_FORM_ID);
        var newWatcherFormDiv = document.getElementById(NEW_WATCHER_FORM_DIV_ID);

        document.getElementById(WATCHERS_FORM_ID).parentNode.insertBefore(
            document.getElementById(FILTER_FORM_ID),
            document.getElementById(WATCHERS_FORM_ID).nextSibling
        );

        addEventListener(
            nonmemberSelect,
            "change",
            function() { filterWatchers(); dehighlightApplyButton(); }
        );

        addEventListener(
            groupSelect,
            "change",
            function() { filterWatchers(); dehighlightApplyButton(); }
        );

        addEventListener(
            roleSelect,
            "change",
            function() { filterWatchers(); dehighlightApplyButton(); }
        );

        addEventListener(
            nameKeywordInput,
            "focus",
            function() { setBlankNameKeyword(); }
        );

        addEventListener(
            nameKeywordInput,
            "blur",
            function() { setDefaultNameKeyword(); }
        );

        addEventListener(
            applyButton,
            "click",
            function() { filterWatchers(); dehighlightApplyButton(); }
        );

        addEventListener(
            clearButton,
            "click",
            function() { clearConditions(); filterWatchers(); dehighlightApplyButton(); }
        );

        addEventListener(
            checkButton,
            "click",
            function() { checkWatchers(); }
        );

        addEventListener(
            uncheckButton,
            "click",
            function() { uncheckWatchers(); }
        );

        addEventListener(
            issueForm,
            "submit",
            function() {
                var controlIds = [
                    NONMEMBER_SELECT_ID,
                    GROUP_SELECT_ID,
                    ROLE_SELECT_ID,
                    NAME_KEYWORD_INPUT_ID
                ];
                disableControls(controlIds);
                window.setTimeout(function() { enableControls(controlIds); }, 1000);
            }
        );

        addEventListener(
            newWatcherFormDiv,
            "submit",
            function() { highlightApplyButton(); }
        );
    }

    function addEventListener(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, func);
        }
    }

    function setBlankNameKeyword() {
        var nameKeywordInput = document.getElementById(NAME_KEYWORD_INPUT_ID);

        if (noNameKeywordInput) {
            nameKeywordInput.value = "";
            noNameKeywordInput = false;
        }
    }

    function setDefaultNameKeyword() {
        var nameKeywordInput = document.getElementById(NAME_KEYWORD_INPUT_ID);
        var value = trim(nameKeywordInput.value);

        if (value === "") {
            nameKeywordInput.value = nameKeywordInput.defaultValue;
            noNameKeywordInput = true;
        } else {
            nameKeywordInput.value = value;
            noNameKeywordInput = false;
        }
    }

    function clearConditions() {
        var nonmemberSelect = document.getElementById(NONMEMBER_SELECT_ID);
        var groupSelect = document.getElementById(GROUP_SELECT_ID);
        var roleSelect = document.getElementById(ROLE_SELECT_ID);
        var nameKeywordInput = document.getElementById(NAME_KEYWORD_INPUT_ID);

        nonmemberSelect.selectedIndex = getDefaultSelectedIndex(nonmemberSelect);
        groupSelect.selectedIndex = getDefaultSelectedIndex(groupSelect);
        roleSelect.selectedIndex = getDefaultSelectedIndex(roleSelect);
        nameKeywordInput.value = nameKeywordInput.defaultValue;
        noNameKeywordInput = true;
    }

    function getDefaultSelectedIndex(select) {
        for (var i = 0; i < select.options.length; i++) {
            if (select.options[i].defaultSelected) {
                return i;
            }
        }

        return 0;
    }

    function highlightApplyButton() {
        document.getElementById(APPLY_BUTTON_ID).className += " highlight";
    }

    function dehighlightApplyButton() {
        var applyButton = document.getElementById(APPLY_BUTTON_ID);
        var classes = applyButton.className.split(/\s+/);
        var index = indexOf(classes, "highlight");

        if (index >= 0) {
            classes.splice(index, 1);
            applyButton.className = classes.join(" ");
        }
    }

    function filterWatchers() {
        var evaluates = buildEvalFunction();
        var checkboxes = document.getElementsByName(CHECKBOX_NAME);

        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = checkboxes[i];
            checkbox.parentNode.style.display = evaluates(checkbox) ? "inline" : "none";
        }
    }

    function buildEvalFunction() {
        var nonmemberCond = getNonmemberCondition();
        var allMemberIds;
        var evaluates;

        if (nonmemberCond === NONMEMBER_ONLY) {
            allMemberIds = getAllMemberIds();
            evaluates = function(checkbox) {
                return indexOf(allMemberIds, checkbox.value) < 0;
            };
        } else {
            var selectedMemberIds = getSelectedMemberIds();
            var nameKeyword = getNameKeyword().toLowerCase();

            var isTarget = function(checkbox) {
                var name = checkbox.parentNode.lastChild.nodeValue.toLowerCase();
                return indexOf(selectedMemberIds, checkbox.value) >= 0
                    && name.indexOf(nameKeyword) >= 0;
            };

            if (nonmemberCond === NONMEMBER_HIDE) {
                evaluates = function(checkbox) { return isTarget(checkbox); };
            } else {
                allMemberIds = getAllMemberIds();
                evaluates = function(checkbox) {
                    return isTarget(checkbox)
                        || indexOf(allMemberIds, checkbox.value) < 0;
                };
            }
        }

        return evaluates;
    }

    function getNonmemberCondition() {
        var nonmemberSelect = document.getElementById(NONMEMBER_SELECT_ID);
        return nonmemberSelect.options[nonmemberSelect.selectedIndex].value;
    }

    function getAllMemberIds() {
        var groupSelect = document.getElementById(GROUP_SELECT_ID);
        return groupSelect.options[getDefaultSelectedIndex(groupSelect)].value.split(",");
    }

    function getSelectedMemberIds() {
        var groupSelect = document.getElementById(GROUP_SELECT_ID);
        var roleSelect = document.getElementById(ROLE_SELECT_ID);
        var groupValues = groupSelect.options[groupSelect.selectedIndex].value.split(",");
        var roleValues = roleSelect.options[roleSelect.selectedIndex].value.split(",");
        var memberIds = [];

        for (var i = 0; i < groupValues.length; i++) {
            for (var j = 0; j < roleValues.length; j++) {
                if (groupValues[i] === roleValues[j]) {
                    memberIds.push(groupValues[i]);
                    break;
                }
            }
        }

        return memberIds;
    }

    function getNameKeyword() {
        return noNameKeywordInput
            ? ""
            : trim(document.getElementById(NAME_KEYWORD_INPUT_ID).value);
    }

    function checkWatchers() {
        setWatcherChecked(true);
    }

    function uncheckWatchers() {
        setWatcherChecked(false);
    }

    function setWatcherChecked(value) {
        var checkboxes = document.getElementsByName(CHECKBOX_NAME);

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].parentNode.style.display !== "none") {
                checkboxes[i].checked = value;
            }
        }
    }

    function enableControls(controlIds) {
        setControlDisabled(controlIds, false);
    }

    function disableControls(controlIds) {
        setControlDisabled(controlIds, true);
    }

    function setControlDisabled(controlIds, value) {
        for (var i = 0; i < controlIds.length; i++) {
            document.getElementById(controlIds[i]).disabled = value;
        }
    }

    function indexOf(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === element) {
                return i;
            }
        }

        return -1;
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
