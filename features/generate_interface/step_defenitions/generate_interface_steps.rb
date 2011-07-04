When /^I attach the "(.*)" file at "(.*)" to "(.*)"$/ do |type, path, field|
  attach_file(field, path)
end