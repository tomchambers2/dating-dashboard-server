'use strict'

var Tinder = require('../lib/tinder')
var _ = require('lodash')
var Redis = require('../lib/redis-client')
var redis = new Redis()
var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")

var me = '56263e05a2243aa61beac69d';

function syncData() {
	//get lastUpdate time from firebase. if none, use time 0

	//get data and add to matches
}

module.exports = function(lastUpdate) {
	console.log('Getting updates for front end since:',lastUpdate);

	var tinder = new Tinder(this.facebookUser.facebookUserId, this.facebookUser.token)
	var self = this

	// db.child('actions').limitToLast(20).on('value', function(data) {
	// 	self.emit('actions',_.values(data.val()).reverse())
	// })

    tinder.getUpdates(lastUpdate, function updateCallback(err, updates) {
    	if (err) return console.error(err)

    	var distribution = []
    	updates.matches.forEach(function(match) {
    		distribution[match.messages.length] = distribution[match.messages.length] ? distribution[match.messages.length]+1 : 1
    	})
    	for (var i = 0; i < distribution.length; i++) {
    		if (!distribution[i]) distribution[i] = 0
    	};

    	// var firstLines = {}
    	// updates.matches.forEach(function(match) {
    	// 	if (!match.messages.length) return
    	// 	//get the first message from me. if length > first index, success
    	// 	var firstMessageIndex = _.findIndex(match.messages, { from: me })
    	// 	if (firstMessageIndex < 0) return
    	// 	if (match.messages.length>firstMessageIndex) {
    	// 		firstLines[match.messages[firstMessageIndex].message] = firstLines[match.messages[firstMessageIndex].message] + 1 || 1
    	// 	} else {
    	// 		firstLines[match.messages[firstMessageIndex].message] = firstLines[match.messages[firstMessageIndex].message] || 0
    	// 	}
    	// })    
    	// console.log(firstLines)

    	var firstLines = {}
    	updates.matches.forEach(function(match) {
    		if (!match.messages.length) return
    		if (match.messages[0].from!==me) {
    			return
    		}
    		if (match.messages.length>1) {
    			firstLines[match.messages[0].message] = firstLines[match.messages[0].message] + 1 || 1
    		} else {
    			firstLines[match.messages[0].message] = firstLines[match.messages[0].message] || 0
    		}
    	})     	

    	var success = {}
    	updates.matches.forEach(function(match) {
    		if (!match.messages.length) return
    		if (_.last(match.messages).to===me) {
    			success[match.messages[match.messages.length-2].message] = success[_.last(match.messages).message] + 1 || 1
    		} else {
    			success[_.last(match.messages).message] = success[_.last(match.messages).message] || 0
    		}
    	})

    	redis.get('action_total', function(err, actionTotal) {
	    	var stats = {
	    		blocks: updates.blocks.length,
	    		distribution: distribution,
	    		actionTotal: actionTotal,
	    		success: success,
	    		firstLines: firstLines
	    	}
	    	self.emit('stats', stats)
    	})


    	self.emit('data', updates)
    })


}