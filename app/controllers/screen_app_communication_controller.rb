require 'pusher'

Pusher.app_id = '7972'
Pusher.key = '7132d12d5d3ddf34b09e'
Pusher.secret = 'd683b29be863f1fed7ed'

class ScreenAppCommunicationController < ApplicationController
  def led
    @message = 'Someone activated a led!'

    Pusher['myscreen-input'].trigger('led-activated', @message)
  end

end
