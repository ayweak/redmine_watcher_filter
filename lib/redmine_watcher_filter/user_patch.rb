# -*- coding: utf-8-unix -*-

require_dependency 'user'

module WatcherFilter
  module UserPatch
    def self.included(base)
      base.class_eval do
        unloadable

        scope :not_in_any_group, lambda {
          includes(:groups).references(:groups).where("#{table_name_prefix}groups_users#{table_name_suffix}.id IS NULL")
        }
      end
    end
  end
end

ActionDispatch::Reloader.to_prepare do
  if not User.included_modules.include?(WatcherFilter::UserPatch)
    User.send(:include, WatcherFilter::UserPatch)
  end
end
