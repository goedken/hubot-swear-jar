Helper = require('hubot-test-helper')
chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

helper = new Helper('../src/swear-jar.js')

describe 'swear-jar', ->
  beforeEach ->
    @robot =
      respond: sinon.spy()
      hear: sinon.spy()

    require('../src/swear-jar.js')(@robot)
#    @room = helper.createRoom()

#  afterEach ->
#    @room.destroy()
#
#  it 'hears swear words', ->
#    @room.user.say('Alex', 'damn').then =>
#      expect(@room.messages).to.eql [
#        ['Alex', 'damn']
#        ['hubot', 'That\'s $0.50 that you\'re putting in the swear jar, @Alex']
#      ]
