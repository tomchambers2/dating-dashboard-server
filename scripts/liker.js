'use strict';

var Tinder = require('../lib/tinder')
var dirtyFacebookAuth = require('../lib/dirty-facebook-auth')
var _ = require('lodash')
var getMessage = require('../lib/get-message')
var evaluatePerson = require('../lib/person-evaluator')
var Redis = require('../lib/redis-client')
var redis = new Redis()
var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")
var moment = require('moment')

setTimeout(function() {
	process.exit(0)
},1000*60*3);

function updateUser(username, cookie, lastLike) {
	dirtyFacebookAuth.getCredentials(username, cookie, function(err, credentials) {
		if (err) return next(err)
		var tinder = new Tinder(credentials.facebookUserId, credentials.token)

		function recordAction(params) {
			params.timestamp = Date.now()
			db.child('users/'+username+'/data/actions').push(params, function(err) {
				if (err) console.error(err)
			})
			redis.incr('action_total')
		}

		function generateMatches() {
			tinder.getNearbyUsers(function(err, data) {
				if (err) return console.error(err)
				data.forEach(function(match) {
					var evaluation = evaluatePerson(match)
					if (evaluation.passed) {
						tinder.like(match._id, function(err, res, reply) {
							recordAction({ 
								type: 'like',
								match: match,
								score: evaluation.score
							})
						})
					} else {
						tinder.dislike(match._id, function(err, res, reply) {
							recordAction({
								type: 'dislike',
								match: match,
								score: evaluation.score
							})
						})					
					}
				})
			})
		}

		function doUpdates() {
			tinder.getUpdates(1000 * 60 * 60 * 24, function updateCallback(err, updates) {
				if (err) return console.error(err)

				var matches = updates.matches

			// db.child('users/'+username+'/data').once('value', function(s) {
			// 	var updates = s.val()

		 //    	if (err) return console.error(err)

		 //    	var matches = _.values(updates.matches)

				matches = matches.filter(function(match) {
					if (!match.person) return false
					return true
				})

		    	matches = matches.map(function(match) {
		    		if (!match.person) return false;
		    		if (!match.messages || match.messages.length === 0) match.status = 0;
		    		var lastMessage = _.last(match.messages)
		    		if (lastMessage && lastMessage.from===me) match.status = 1;
		    		if (lastMessage && lastMessage.to===me) match.status = 2;
		    		//if (match.messages && match.messages.length >= 6) match.status = 3;
		    		//temp disable 6 message limit
		    		return match
		    	})

		    	matches.forEach(function(match) {
		    		if (match.status===0) {
		    			getMessage(null, function(reply) {
		    				console.log('Send message',reply)
			    			tinder.sendMessage(match._id, reply, function() {
			    				console.log('Recording message',match.person.name,reply)
			    				recordAction({
			    					type: 'message',
			    					text: reply,
			    					match: match.person
			    				})
			    			})
		    			})
		    		} else if (match.status===2) {
			    		if (_.last(match.messages).timestamp+1000*60*60>Date.now()) {
			    			return console.log('Matchs last match was < 1 hour ago, skip')
			    		}	    			
		    			getMessage(_.last(match.messages).message, function (reply) {
		    				console.log('Send message',reply)
			    			tinder.sendMessage(match._id, reply, function() {
			    				console.log('Recording message',match.person.name,reply)
			    				recordAction({
			    					type: 'message',
			    					text: reply,
									match: match.person
			    				})
			    			})
		    			})
		    		}
		    	})
		    })
		}

		doUpdates()
		generateMatches()
	})
}

var me = '56263e05a2243aa61beac69d';

console.info("Running liker script")

db.authWithCustomToken(process.env.TINDER_FIREBASE_TOKEN, function(error, result) {
	if (error) return console.error(error)
		db.child('users').once('value', function(s) {
			var users = s.val()
			for (var user in users) {
				updateUser(users[user].name, users[user].cookie, users[user].lastLike || 0)				
			}
		})
})