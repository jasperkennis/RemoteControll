require 'pusher'

Pusher.app_id = '7972'
Pusher.key = '7132d12d5d3ddf34b09e'
Pusher.secret = 'd683b29be863f1fed7ed'

class ScreenAppCommunicationController < ApplicationController
  def led
    @message = 'Someone activated a led!'

    Pusher['myscreen-input'].trigger('led-activated', @message)
  end
  
  def keyDown
    @message = '{"key": ' + params[:key] + ', "id": ' + params[:id] + '}'

    Pusher['myscreen-input'].trigger('key-down', @message)
  end
  
  def keyUp
    @message = '{"key": ' + params[:key] + ', "id": ' + params[:id] + '}'

    Pusher['myscreen-input'].trigger('key-up', @message)
  end
  
  def newUser
    @message = '{"id": ' + params[:id] + '}'

    Pusher['myscreen-input'].trigger('new-user', @message)
  end

end
