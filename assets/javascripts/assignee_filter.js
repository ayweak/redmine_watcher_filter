// -*- coding: utf-8 -*-

jQuery(function($) {
    var getWatcherIds;
    var getOptgroup;
    var compareString;
    var sorted;

    getWatcherIds = (function() {
        if ($("#watchers_inputs")[0]) {
            // For new issue page
            return function() {
                return $("input[name='issue[watcher_user_ids][]']:checked").map(function() {
                    return this.value;
                });
            };
        } else if ($("#watchers")[0]) {
            // For edit issue page
            return function() {
                return $("#watchers").find("a.user.active").map(function() {
                    return $(this).attr("href").replace(/^.+\/(\d+)$/, "$1");
                });
            };
        }
    })();

    if (!getWatcherIds) {
        return;
    }

    getOptgroup = function(id, label, afterElement) {
        var optgroup = $("#" + id);

        if (!optgroup[0]) {
            optgroup = $("<optgroup/>").insertAfter(afterElement);
            optgroup.attr("id", id);
            optgroup.attr("label", label);
        }

        return optgroup;
    };

    compareString = function(a, b) {
        var aText = $(a).text();
        var bText = $(b).text();

        if (aText < bText) {
            return -1
        } else if (aText > bText) {
            return 1;
        } else {
            return 0;
        }
    };

    sorted = false;

    $("#all_attributes").on("blur", "#issue_assigned_to_id", function() {
        sorted = false;
    });

    $("#all_attributes").on("mousedown", "#issue_assigned_to_id", function() {
        var excludeOptionSelector;
        var options;
        var watcherOptgroup;
        var otherOptgroup;
        var watcherIds;
        var i;

        if (sorted) {
            return;
        }

        // Exclude options that belong to any unknown optgroup.
        excludeOptionSelector = "optgroup"
                              + "[id!='assignee_optgroup_watchers']"
                              + "[id!='assignee_optgroup_others']"
                              + " option";
        options = $("#issue_assigned_to_id").find("option:not(" + excludeOptionSelector + ")");

        if (options.length <= 2) {
            return;
        }

        watcherOptgroup = getOptgroup("assignee_optgroup_watchers", "Watchers", options[1]);
        otherOptgroup = getOptgroup("assignee_optgroup_others", "Others", watcherOptgroup);

        options = options.slice(2).sort(compareString);

        watcherIds = getWatcherIds();

        for (i = 0; i < options.length; i++) {
            if ($.inArray(options[i].value, watcherIds) !== -1) {
                watcherOptgroup.append(options[i]);
            } else {
                otherOptgroup.append(options[i]);
            }
        }

        sorted = true;
    });
});
