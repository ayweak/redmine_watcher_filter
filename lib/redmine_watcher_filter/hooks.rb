# -*- coding: utf-8-unix -*-

module RedmineWatcherFilter
  class Hooks < Redmine::Hook::ViewListener
    render_on :view_issues_index_bottom, partial: 'hooks/redmine_watcher_filter/watcher_filter'
    render_on :view_issues_new_top, partial: 'hooks/redmine_watcher_filter/watcher_filter'
    render_on :view_issues_form_details_bottom, partial: 'hooks/redmine_watcher_filter/watcher_filter'
  end
end
