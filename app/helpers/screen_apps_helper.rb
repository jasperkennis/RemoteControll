module ScreenAppsHelper
  def add_interface_link(name)
    #link_to_function name, @pages do |page|
    #  page.insert_html :bottom, :interfaces, :partial => 'interface' , :object => Interface.new
    #end
    link_to name, "#", "" => h(render(:partial => 'interface', :object => Interface.new)), :class => 'add_interface'
  end
end