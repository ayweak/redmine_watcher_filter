# -*- coding: utf-8-unix -*-

require 'redmine'

require_dependency 'redmine_watcher_filter/hooks'
require_dependency 'redmine_watcher_filter/custom_value_patch'
require_dependency 'redmine_watcher_filter/user_patch'
require_dependency 'redmine_watcher_filter/watchers_controller_patch'
require_dependency 'redmine_watcher_filter/watchers_helper_patch'

Redmine::Plugin.register :redmine_watcher_filter do
  name 'Redmine Watcher Filter plugin'
  author 'ayweak'
  description 'Filter issue watchers by group, role and custom field values.'
  version '4.0.0-alpha'
  url 'https://github.com/ayweak/redmine_watcher_filter'
  author_url 'https://github.com/ayweak'
end
