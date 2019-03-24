# -*- coding: utf-8-unix -*-

require_dependency 'watchers_controller'

module WatcherFilter
  module WatchersControllerPatch
    def self.included(base)
      base.send(:include, InstanceMethods)
      base.class_eval do
        unloadable
        alias_method_chain :users_for_new_watcher, :extra_condition
      end
    end

    module InstanceMethods
      # based on redmine v3.3.0 app/controllers/watchers_controller.rb#L116
      def users_for_new_watcher_with_extra_condition
        scope = nil
        if params[:q].blank? && @project.present?
          scope = @project.users
        else
          scope = User.all.limit(100)
        end
        if params[:cfv_q].present?
          scope = scope.joins(:custom_values => :custom_field).
            merge(CustomValue.like(params[:cfv_q])).merge(CustomField.visible)
        end
        if params[:group_id].present?
          if params[:group_id].to_i > 0
            scope = scope.in_group(params[:group_id])
          else
            scope = scope.not_in_any_group
          end
        end
        if params[:role_id].present?
          scope = scope.joins(:members => :roles).
            where("#{Role.table_name}.id = ?", params[:role_id]).uniq
        end
        users = scope.active.visible.sorted.like(params[:q]).to_a
        if @watchables && @watchables.size == 1
          users -= @watchables.first.watcher_users
        end
        users
      end
    end
  end
end

ActionDispatch::Reloader.to_prepare do
  if not WatchersController.included_modules.include?(WatcherFilter::WatchersControllerPatch)
    WatchersController.send(:include, WatcherFilter::WatchersControllerPatch)
  end
end
