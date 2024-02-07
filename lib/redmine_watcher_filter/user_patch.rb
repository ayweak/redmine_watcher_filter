# -*- coding: utf-8-unix -*-

require_dependency 'user'

module RedmineWatcherFilter
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

# ActiveSupport::Reloader.to_prepare do
  if not User.included_modules.include?(RedmineWatcherFilter::UserPatch)
    User.include RedmineWatcherFilter::UserPatch
  end
# end
