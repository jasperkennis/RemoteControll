class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    raise env["omniauth.auth"].inspect
  end
end