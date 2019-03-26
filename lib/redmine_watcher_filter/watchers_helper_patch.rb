# -*- coding: utf-8-unix -*-

require_dependency 'watchers_helper'
require_dependency 'principal'
require_dependency 'role'
require_dependency 'member'

module WatcherFilter
  module WatchersHelperPatch
    def self.included(base)
      base.class_eval do
        unloadable

        def render_group_select(project)
          list = []
          if project.present?
            list = [[l(:watcher_filter_not_in_any_group), -1]]
            list.concat(project.principals.where("#{Principal.table_name}.type = ?", 'Group').sorted.map{|g| [g.name, g.id]})
          end
          select_tag 'user_search_by_group', options_for_select(list), :prompt => "#{l(:watcher_filter_group_select)}"
        end

        def render_role_select(project)
          list = []
          if project.present?
            list = Role.joins(:members).where("#{Member.table_name}.project_id = ?", project.id).sorted.uniq.map{|r| [r.name, r.id]}
          end
          select_tag 'user_search_by_role', options_for_select(list), :prompt => "#{l(:watcher_filter_role_select)}"
        end
      end
    end
  end
end

ActiveSupport::Reloader.to_prepare do
  if not WatchersHelper.included_modules.include?(WatcherFilter::WatchersHelperPatch)
    WatchersHelper.include WatcherFilter::WatchersHelperPatch
  end
end
