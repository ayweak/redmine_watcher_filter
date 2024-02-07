# -*- coding: utf-8-unix -*-

require_dependency 'watchers_controller'

module RedmineWatcherFilter
  module WatchersControllerPatch
    # based on redmine v4.0.0 app/controllers/watchers_controller.rb#L119
    def users_for_new_watcher
      scope = nil
      if params[:q].blank? && @project.present?
        scope = @project.users
      else
        scope = User.all.limit(100)
      end

      scope = add_conditions(scope)

      users = scope.active.visible.sorted.like(params[:q]).to_a
      if @watchables && @watchables.size == 1
        users -= @watchables.first.watcher_users
      end
      users
    end

    private
    def add_conditions(scope)
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
                  where("#{Role.table_name}.id = ?", params[:role_id])
      end
      scope
    end
  end
end

WatchersController.prepend RedmineWatcherFilter::WatchersControllerPatch
