'use strict';

var natural = require('natural')
var speak = require('speakeasy-nlp')
var nlp = require('nlp_compromise')
var sentiment = require('sentiment')
var data = require('../data/training-data.json')
var Pandorabot = require('pb-node');
var _ = require ('lodash')

var options = {
  url: 'https://aiaas.pandorabots.com',
  app_id: process.env.PB_APP_ID,
  user_key: process.env.PB_USER_KEY,
  botname: 'manlove'
};

var bot = new Pandorabot(options);

var classifier = new natural.BayesClassifier()

function train(data) {
	data.forEach(function(phrase) {
		classifier.addDocument(phrase.document, phrase.category)
	})

	classifier.train()
}

function getPositiveScore(message) {
	return sentiment(message)
}

function getNegativeScore(message) {
	return sentiment(message)
}

train(data)

module.exports = function getMessage(message, cb) {
	console.log('processing',message)
	if (!message) return cb(_.sample(['Hi...','How\'s it going','How are you']))

	// var topCategory = classifier.classify(message)
	// var fullResults = classifier.getClassifications(message)

	bot.talk({ input: message }, function (err, res) {
	  if (!err)  {
	  	if (!res.responses[0]) return cb('Oh...');
	  	return cb(res.responses[0])
	  } else {
	  	console.log(err)
	  }
	});
}
