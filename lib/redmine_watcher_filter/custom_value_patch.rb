# -*- coding: utf-8-unix -*-

require_dependency 'custom_value'

module RedmineWatcherFilter
  module CustomValuePatch
    def self.included(base)
      base.class_eval do
        unloadable

        scope :like, lambda {|q|
          if q.present?
            where("LOWER(#{table_name}.value) LIKE LOWER(?)", "%#{sanitize_sql_like(q)}%")
          else
            where({})
          end
        }
      end
    end
  end
end

# ActiveSupport::Reloader.to_prepare do
  if not CustomValue.included_modules.include?(RedmineWatcherFilter::CustomValuePatch)
    CustomValue.include RedmineWatcherFilter::CustomValuePatch
  end
# end
