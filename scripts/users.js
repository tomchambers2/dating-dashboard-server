var Firebase = require("firebase")
var db = new Firebase("https://tinder-bot.firebaseio.com/")

db.authWithCustomToken(process.env.TINDER_FIREBASE_TOKEN, function(error, result) {
	db.child('users').child('-K1KeY9TgG8SsfvXM7xD').update({
	name: 'demo', 
		cookie: 

		[
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "act",
    "path": "/",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "1445346756433%2F6",
    "id": 1
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "c_user",
    "path": "/",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "100010511586826",
    "id": 2
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "csm",
    "path": "/",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "2",
    "id": 3
},
{
    "domain": ".facebook.com",
    "expirationDate": 1508285331.114951,
    "hostOnly": false,
    "httpOnly": true,
    "name": "datr",
    "path": "/",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "kDQkVisghYnhEkpTswadQqNc",
    "id": 4
},
{
    "domain": ".facebook.com",
    "expirationDate": 1453122345.903974,
    "hostOnly": false,
    "httpOnly": true,
    "name": "fr",
    "path": "/",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "0d3sraftVZbQYJwGB.AWWjefbIcPl-jyP-CReyYer_kMU.BWJDSR.64.AAA.0.AWVUWX-Y",
    "id": 5
},
{
    "domain": ".facebook.com",
    "expirationDate": 1445951145.903499,
    "hostOnly": false,
    "httpOnly": false,
    "name": "locale",
    "path": "/",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "en_GB",
    "id": 6
},
{
    "domain": ".facebook.com",
    "expirationDate": 1508418345.904317,
    "hostOnly": false,
    "httpOnly": true,
    "name": "lu",
    "path": "/",
    "secure": true,
    "session": false,
    "storeId": "0",
    "value": "RAxqm8zSLj-6fTG3sn0HjwAA",
    "id": 7
},
{
    "domain": ".facebook.com",
    "expirationDate": 1924992000,
    "hostOnly": false,
    "httpOnly": false,
    "name": "oo",
    "path": "/",
    "secure": false,
    "session": false,
    "storeId": "0",
    "value": "1",
    "id": 8
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "p",
    "path": "/",
    "secure": false,
    "session": true,
    "storeId": "0",
    "value": "-2",
    "id": 9
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": false,
    "name": "presence",
    "path": "/",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "EDvF3EtimeF1445346780EuserFA21B10511586826A2EstateFDutF1445346780348EatF1445346780081Et2F_5b_5dElm2FnullEuct2F1445345937BEtrFA2loadA2EtwF487259288Esb2F0CEchFDp_5f1B10511586826F0CC",
    "id": 10
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "s",
    "path": "/",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "Aa67JjnsjkC7xIOB.BWJjwp",
    "id": 11
},
{
    "domain": ".facebook.com",
    "hostOnly": false,
    "httpOnly": true,
    "name": "xs",
    "path": "/",
    "secure": true,
    "session": true,
    "storeId": "0",
    "value": "216%3A1xvDIU0CehyK2A%3A2%3A1445346345%3A-1",
    "id": 12
}
]
	})
})
