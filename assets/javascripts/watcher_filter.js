// -*- coding: utf-8-unix -*-

var WatcherFilter = WatcherFilter || {
    // based on redmine v4.0.0 public/javascripts/application.js#L553
    observeSearchfield: function(fieldId, cfvFieldId, groupFieldId, roleFieldId, targetId, url) {
        $(['#' + fieldId, '#' + cfvFieldId].join(',')).each(function() {
            var $this = $(this);
            $this.addClass('autocomplete');
            $this.attr('data-value-was', $this.val());
            var check = function() {
                var val = $this.val();
                if ($this.attr('data-value-was') != val){
                    $this.attr('data-value-was', val);
                    WatcherFilter.search(fieldId, cfvFieldId, groupFieldId, roleFieldId, targetId, url);
                }
            };
            var reset = function() {
                if (timer) {
                    clearInterval(timer);
                    timer = setInterval(check, 300);
                }
            };
            var timer = setInterval(check, 300);
            $this.bind('keyup click mousemove', reset);
        });
    },

    search: function(fieldId, cfvFieldId, groupFieldId, roleFieldId, targetId, url) {
        var q = $('#' + fieldId).val();
        var cfvQ = $('#' + cfvFieldId).val();
        var groupId = $('#' + groupFieldId).val();
        var roleId = $('#' + roleFieldId).val();
        $.ajax({
            url: url,
            type: 'get',
            data: { q: q, cfv_q: cfvQ, group_id: groupId, role_id: roleId },
            success: function(data) { if (targetId) { $('#' + targetId).html(data); } },
            beforeSend: function() { $('#' + fieldId).addClass('ajax-loading'); },
            complete: function() { $('#' + fieldId).removeClass('ajax-loading'); }
        });
    }
};
