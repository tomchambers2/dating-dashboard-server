'use strict'

var emitter = require('./lib/eventemitter')

var socketAuth = require('./handlers/socket-auth')
var getUpdates = require('./handlers/get-updates')
var sendMessage = require('./handlers/send-message')
//var onDisconnect = require('./handlers/on-disconnect')

module.exports = function(io) {
	io.use(socketAuth.attachCredentials)

	io.on('connection', function(socket){
		console.log("USER CONNECTED")

		socket.on('update', getUpdates)

		socket.on('send message', sendMessage)

	  	//socket.on('disconnect', onDisconnect)
	})
}