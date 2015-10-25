var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")

setTimeout(function() {
	process.exit(0)
},1000*3);

db.authWithCustomToken(process.env.TINDER_FIREBASE_TOKEN, function(error, result) {
	return db.set({})
})