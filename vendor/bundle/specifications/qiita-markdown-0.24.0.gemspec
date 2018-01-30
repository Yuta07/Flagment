# -*- encoding: utf-8 -*-
# stub: qiita-markdown 0.24.0 ruby lib

Gem::Specification.new do |s|
  s.name = "qiita-markdown".freeze
  s.version = "0.24.0"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Ryo Nakamura".freeze]
  s.date = "2017-12-21"
  s.email = ["r7kamura@gmail.com".freeze]
  s.homepage = "https://github.com/increments/qiita-markdown".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.2.0".freeze)
  s.rubygems_version = "2.6.11".freeze
  s.summary = "Qiita-specified markdown processor.".freeze

  s.installed_by_version = "2.6.11" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<gemoji>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<github-linguist>.freeze, ["~> 4.0"])
      s.add_runtime_dependency(%q<html-pipeline>.freeze, ["~> 2.0"])
      s.add_runtime_dependency(%q<mem>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<pygments.rb>.freeze, ["~> 1.0"])
      s.add_runtime_dependency(%q<greenmat>.freeze, ["= 3.2.2.3"])
      s.add_runtime_dependency(%q<sanitize>.freeze, [">= 0"])
      s.add_runtime_dependency(%q<addressable>.freeze, [">= 0"])
      s.add_development_dependency(%q<activesupport>.freeze, ["= 4.2.6"])
      s.add_development_dependency(%q<benchmark-ips>.freeze, ["~> 1.2"])
      s.add_development_dependency(%q<bundler>.freeze, ["~> 1.7"])
      s.add_development_dependency(%q<codeclimate-test-reporter>.freeze, ["= 0.4.4"])
      s.add_development_dependency(%q<pry>.freeze, [">= 0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.1"])
      s.add_development_dependency(%q<rubocop>.freeze, ["= 0.49.1"])
    else
      s.add_dependency(%q<gemoji>.freeze, [">= 0"])
      s.add_dependency(%q<github-linguist>.freeze, ["~> 4.0"])
      s.add_dependency(%q<html-pipeline>.freeze, ["~> 2.0"])
      s.add_dependency(%q<mem>.freeze, [">= 0"])
      s.add_dependency(%q<pygments.rb>.freeze, ["~> 1.0"])
      s.add_dependency(%q<greenmat>.freeze, ["= 3.2.2.3"])
      s.add_dependency(%q<sanitize>.freeze, [">= 0"])
      s.add_dependency(%q<addressable>.freeze, [">= 0"])
      s.add_dependency(%q<activesupport>.freeze, ["= 4.2.6"])
      s.add_dependency(%q<benchmark-ips>.freeze, ["~> 1.2"])
      s.add_dependency(%q<bundler>.freeze, ["~> 1.7"])
      s.add_dependency(%q<codeclimate-test-reporter>.freeze, ["= 0.4.4"])
      s.add_dependency(%q<pry>.freeze, [">= 0"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<rspec>.freeze, ["~> 3.1"])
      s.add_dependency(%q<rubocop>.freeze, ["= 0.49.1"])
    end
  else
    s.add_dependency(%q<gemoji>.freeze, [">= 0"])
    s.add_dependency(%q<github-linguist>.freeze, ["~> 4.0"])
    s.add_dependency(%q<html-pipeline>.freeze, ["~> 2.0"])
    s.add_dependency(%q<mem>.freeze, [">= 0"])
    s.add_dependency(%q<pygments.rb>.freeze, ["~> 1.0"])
    s.add_dependency(%q<greenmat>.freeze, ["= 3.2.2.3"])
    s.add_dependency(%q<sanitize>.freeze, [">= 0"])
    s.add_dependency(%q<addressable>.freeze, [">= 0"])
    s.add_dependency(%q<activesupport>.freeze, ["= 4.2.6"])
    s.add_dependency(%q<benchmark-ips>.freeze, ["~> 1.2"])
    s.add_dependency(%q<bundler>.freeze, ["~> 1.7"])
    s.add_dependency(%q<codeclimate-test-reporter>.freeze, ["= 0.4.4"])
    s.add_dependency(%q<pry>.freeze, [">= 0"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.1"])
    s.add_dependency(%q<rubocop>.freeze, ["= 0.49.1"])
  end
end
