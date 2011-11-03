require 'redmine'

require_dependency 'redmine_watcher_filter/hooks'

Redmine::Plugin.register :redmine_watcher_filter do
  name 'Redmine Watcher Filter plugin'
  author 'ayweak'
  description 'Filter issue watchers by group and role, and check/uncheck them.'
  version '0.0.2'
  url 'https://github.com/ayweak/redmine_watcher_filter'
  author_url 'https://github.com/ayweak'
end
