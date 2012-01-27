require 'redmine'

require_dependency 'redmine_watcher_filter/hooks'

Redmine::Plugin.register :redmine_watcher_filter do
  name 'Redmine Watcher Filter plugin'
  author 'ayweak'
  description 'Filter issue watchers by group, role and watcher names.'
  version '0.0.4'
  url 'https://github.com/ayweak/redmine_watcher_filter'
  author_url 'https://github.com/ayweak'
end
