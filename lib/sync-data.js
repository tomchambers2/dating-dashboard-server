'use strict'

var Tinder = require('./tinder')
var _ = require('lodash')
// var Redis = require('./redis-client')
// var redis = new Redis()
//var dirtyFacebookAuth = require('../lib/dirty-facebook-auth')
var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")
var dirtyFacebookAuth = require('./dirty-facebook-auth')

var me = '56263e05a2243aa61beac69d';

setTimeout(function() {
	process.exit(0)
},1000*60*3);

function syncData(username, facebookUser) {
	var tinder = new Tinder(facebookUser.facebookUserId, facebookUser.token)

	var userDb = db.child('users/'+username+'/data')

	return userDb.child('lastUpdate').once('value', function(data) {
		tinder.getUpdates(Date.now() - data.val() || 1000*60*60*14, function updateCallback(err, updates) {
			if (err) return console.error(err)
			updates.matches.forEach(function(match) {
				match.viewed = false
				userDb.child('matches').child(match._id).update(match, function() {
				})
			})
			updates.blocks.forEach(function(block) {
				userDb.child('blocks').push(block, function() {
				})
			})
			userDb.child('lastUpdate').set(Date.now(), function() {
				generateStats(username)
			})
		})
	})
}

function generateStats(username) {
	var userDb = db.child('users/'+username+'/data')

	userDb.child('blocks').once('value', function(data) {
		userDb.child('stats').update({ 
			blocks: _.size(data.val())
		})
	})

	userDb.child('actions').once('value', function(data) {
		var actions = data.val()
		userDb.child('stats').update({ 
			actions: {
				total: _.size(actions),
				dislikes: _.size(_.where(actions, { type: 'dislike' })),
				likes: _.size(_.where(actions, { type: 'like' })),
				messages: _.size(_.where(actions, { type: 'message' }))
			}
		})
	})	

	userDb.child('matches').once('value', function(data) {
		var matches = data.val()

		var stats = {
			totalMessages: 0,
			distribution: [],
			firstLines: {},
			dates: {},
			matches: _.size(matches)
		}

		for (var key in matches) {
			var match = matches[key]

    		if (match.messages && match.messages.length) {
				stats.totalMessages += match.messages.length
				stats.distribution[match.messages.length] = stats.distribution[match.messages.length] ? stats.distribution[match.messages.length]+1 : 1
	    		
	    		if (match.messages[0].from===me) {
	    			var firstMessage = match.messages[0].message.replace(/[.]+/,'')
		    		if (match.messages.length>1) {
		    			stats.firstLines[firstMessage] = stats.firstLines[firstMessage] + 1 || 1
		    		} else {
		    			stats.firstLines[firstMessage] = stats.firstLines[firstMessage] || 0
		    		}
	    		}  
				
	    		//dates
	    			//if there is a message with one of the 'date' lines, record whether there is a message after that
	    			//simply return { success: Number, failure: Number }
    		}
		}
    	for (var i = 0; i < stats.distribution.length; i++) {
    		if (!stats.distribution[i]) stats.distribution[i] = 0
    	};		

		userDb.child('stats').update(stats, function(err) {
			if (err) console.log(err)
			return console.log('Finished stats generation')
		})
	})
}

db.authWithCustomToken(process.env.TINDER_FIREBASE_TOKEN, function(error, result) {
	if (error) return console.error(error)
	console.log('Authenticated firebase')

	return db.child('users').once('value', function(s) {
		var users = s.val()
		for (var user in users) {
			dirtyFacebookAuth.getCredentials(users[user].name, users[user].cookie, function(err, facebookUser) {
				syncData(users[user].name, facebookUser)
			})
		}
		return
	})
})