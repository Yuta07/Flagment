# -*- encoding: utf-8 -*-
# stub: greenmat 3.2.2.3 ruby lib
# stub: ext/greenmat/extconf.rb

Gem::Specification.new do |s|
  s.name = "greenmat".freeze
  s.version = "3.2.2.3"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Natacha Port\u00E9".freeze, "Vicent Mart\u00ED".freeze]
  s.date = "2017-06-16"
  s.description = "A Markdown parser for Qiita, based on Redcarpet.".freeze
  s.email = "nkymyj@gmail.com".freeze
  s.executables = ["greenmat".freeze]
  s.extensions = ["ext/greenmat/extconf.rb".freeze]
  s.extra_rdoc_files = ["COPYING".freeze]
  s.files = ["COPYING".freeze, "bin/greenmat".freeze, "ext/greenmat/extconf.rb".freeze]
  s.homepage = "https://github.com/increments/greenmat".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 2.0.0".freeze)
  s.rubygems_version = "2.6.11".freeze
  s.summary = "A Markdown parser for Qiita, based on Redcarpet.".freeze

  s.installed_by_version = "2.6.11" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_development_dependency(%q<activesupport>.freeze, [">= 0"])
      s.add_development_dependency(%q<nokogiri>.freeze, ["~> 1.6.0"])
      s.add_development_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_development_dependency(%q<rake-compiler>.freeze, ["~> 0.8.3"])
      s.add_development_dependency(%q<rspec>.freeze, ["~> 3.2"])
      s.add_development_dependency(%q<test-unit>.freeze, ["~> 2.5.4"])
    else
      s.add_dependency(%q<activesupport>.freeze, [">= 0"])
      s.add_dependency(%q<nokogiri>.freeze, ["~> 1.6.0"])
      s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
      s.add_dependency(%q<rake-compiler>.freeze, ["~> 0.8.3"])
      s.add_dependency(%q<rspec>.freeze, ["~> 3.2"])
      s.add_dependency(%q<test-unit>.freeze, ["~> 2.5.4"])
    end
  else
    s.add_dependency(%q<activesupport>.freeze, [">= 0"])
    s.add_dependency(%q<nokogiri>.freeze, ["~> 1.6.0"])
    s.add_dependency(%q<rake>.freeze, ["~> 10.0"])
    s.add_dependency(%q<rake-compiler>.freeze, ["~> 0.8.3"])
    s.add_dependency(%q<rspec>.freeze, ["~> 3.2"])
    s.add_dependency(%q<test-unit>.freeze, ["~> 2.5.4"])
  end
end
