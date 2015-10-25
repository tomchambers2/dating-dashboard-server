var Firebase = require("firebase")
var fs = require('fs')
var db = new Firebase("https://tinder-bot.firebaseio.com/")

db.authWithCustomToken(process.env.TINDER_FIREBASE_TOKEN, function(error, result) {
	return db.child('users').child('demo').on('value', function(s){
        fs.writeFile('export.json', JSON.stringify(s.val()), function(err) {
            if (err) return console.log(err)
            console.log('complete')
        })
	})
})
