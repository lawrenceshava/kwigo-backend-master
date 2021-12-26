*Create user DB*

On a Mongo console

`db.createUser({user: "backend", pwd: "PASSWORD", roles: [{role: "readWrite", db: "kwigo"}]})`
