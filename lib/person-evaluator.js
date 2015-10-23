'use strict';

var spellchecker = require('spellchecker')
var natural = require('natural'),
  tokenizer = new natural.WordTokenizer()

function spellCheck(candidate) {
	var words = tokenizer.tokenize(candidate.bio)
	if (!words.length) return 1
	var correct = 0

	words.forEach(function(word) {
		if (!spellchecker.isMisspelled(word)) correct++ 
	})
	console.log('calc',correct, words.length)
	var score = correct / words.length
	return score
}

module.exports = function evaluator(candidate) {
	//test persons face against heuristics

	var spellCheckScore = spellCheck(candidate)

	if (spellCheckScore > 0.9) return { passed: true, score: spellCheckScore }
	return { passed: false, score: spellCheckScore }
}