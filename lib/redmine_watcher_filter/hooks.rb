# -*- coding: utf-8 -*-

module WatcherFilter
  class Hooks < Redmine::Hook::ViewListener
    def view_issues_form_details_bottom(context={})
      action = context[:request].parameters[:action]
      project_id = context[:request].parameters[:project_id]

      if (action != 'new' && action != 'create') || !project_id then
        return ''
      end

      project = Project.find(project_id)
      user_ids = project.members.collect {|member| member.user_id}

      groups = get_groups(project, user_ids)
      roles = get_roles(project, user_ids)

      context[:controller].send(
        :render_to_string,
        {
          :partial => 'hooks/redmine_watcher_filter/watcher_filter',
          :locals => { :groups => groups, :roles => roles }
        }
      )
    end

    private
    def get_groups(project, user_ids)
      groups = []
      groups << [
        '<<' + l(:watcher_filter_select_all_groups) + '>>',
        user_ids * ','
      ]

      non_group_user_ids = user_ids.clone

      project.principals.find(
        :all,
        :include => :users,
        :conditions => [ 'type = ?', 'Group' ],
        :order => 'lastname'
      ).each do |group|
        ids = group.users.collect {|user| user.id}
        groups << [ group.lastname, ids * ',' ]
        non_group_user_ids -= ids
      end

      if not non_group_user_ids.empty? then
        groups << [
          '<<' + l(:watcher_filter_select_non_group) + '>>',
          non_group_user_ids * ','
        ]
      end

      return groups
    end

    private
    def get_roles(project, user_ids)
      roles = []
      roles << [
        '<<' + l(:watcher_filter_select_all_roles) + '>>',
        user_ids * ','
      ]

      non_role_user_ids = user_ids.clone

      Role.find(
        :all,
        :include => [ :members => :user ],
        :conditions => [ 'members.project_id = ?', project.id ],
        :order => 'name'
      ).each do |role|
        ids = []
        role.members.each do |member|
          if member.user then
            ids << member.user_id
          end
        end
        roles << [ role.name, ids * ',' ]
        non_role_user_ids -= ids
      end

      if not non_role_user_ids.empty? then
        roles << [
          '<<' + l(:watcher_filter_select_non_role) + '>>',
          non_role_user_ids * ','
        ]
      end

      return roles
    end
  end
end
