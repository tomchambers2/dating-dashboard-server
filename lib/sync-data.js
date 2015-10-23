'use strict'

var Tinder = require('./tinder')
var _ = require('lodash')
// var Redis = require('./redis-client')
// var redis = new Redis()
//var dirtyFacebookAuth = require('../lib/dirty-facebook-auth')
var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")

var me = '56263e05a2243aa61beac69d';

function syncData(facebookUser, lastUpdate) {
	var tinder = new Tinder(facebookUser.facebookUserId, facebookUser.token)

	db.child('lastUpdate').once('value', function(data) {
		tinder.getUpdates(data.val() || 0, function updateCallback(err, updates) {
			updates.matches.forEach(function(match) {
				match.viewed = false
				db.child('matches').child(match._id).update(match, function() {
				})
			})
			updates.blocks.forEach(function(block) {
				db.child('blocks').push(block, function() {
				})
			})
			db.child('lastUpdate').set(Date.now(), function() {
			})
		})
	})
}

function generateStats() {
	db.child('blocks').once('value', function(data) {
		db.child('stats').update({ 
			blocks: _.size(data.val())
		})
	})

	db.child('actions').once('value', function(data) {
		var actions = data.val()
		db.child('stats').update({ 
			actions: {
				total: _.size(actions),
				dislikes: _.size(_.where(actions, { type: 'dislike' })),
				likes: _.size(_.where(actions, { type: 'like' })),
				messages: _.size(_.where(actions, { type: 'message' }))
			}
		})
	})	

	db.child('matches').once('value', function(data) {
		var matches = data.val()

		// console.log(matches)

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
		    		if (match.messages.length>1) {
		    			console.log('yes msg')
		    			stats.firstLines[match.messages[0].message] = stats.firstLines[match.messages[0].message] + 1 || 1
		    		} else {
		    			console.log('no msg')
		    			stats.firstLines[match.messages[0].message] = stats.firstLines[match.messages[0].message] || 0
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

		db.child('stats').update(stats, function(err) {
			if (err) console.log(err)
			console.log('done fine')
		})
	})
}

generateStats()

// dirtyFacebookAuth.getCredentials(function(err, facebookUser) {
// 	console.log(' got creds')
// 	syncData(facebookUser)
// })