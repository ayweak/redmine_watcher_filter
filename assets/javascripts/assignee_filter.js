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
                    return $(this).val();
                });
            };
        } else if ($("#watchers")[0]) {
            // For edit issue page
            return function() {
                return $("#watchers").find("a.user.active").map(function() {
                    return $(this).attr("href").replace(/^.+\/(\d+)$/, "$1");
                });
            };
        } else {
            return null;
        }
    })();

    if (!getWatcherIds) {
        return;
    }

    getOptgroup = function(id, label, element) {
        var optgroup = $("#" + id);

        if (!optgroup[0]) {
            optgroup = $("<optgroup/>").insertAfter(element).attr("id", id).attr("label", label);
        }

        return optgroup;
    };

    compareString = function(element1, element2) {
        var text1 = $(element1).text();
        var text2 = $(element2).text();

        if (text1 < text2) {
            return -1;
        } else if (text1 > text2) {
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

        if (sorted) {
            return;
        }

        // Exclude options that belong to any unknown optgroup.
        excludeOptionSelector = "optgroup"
                              + "[id!='assignee_optgroup_watchers']"
                              + "[id!='assignee_optgroup_others']"
                              + " option";
        options = $(this).find("option:not(" + excludeOptionSelector + ")").toArray();

        if (options.length <= 2) {
            return;
        }

        otherOptgroup = getOptgroup("assignee_optgroup_others", "Others", options[1]);
        watcherOptgroup = getOptgroup("assignee_optgroup_watchers", "Watchers", options[1]);

        options = options.slice(2).sort(compareString);

        watcherIds = getWatcherIds();

        $.each(options, function() {
            if ($.inArray($(this).val(), watcherIds) !== -1) {
                watcherOptgroup.append(this);
            } else {
                otherOptgroup.append(this);
            }
        });

        sorted = true;
    });
});
