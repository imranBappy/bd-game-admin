const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');


const app = express();
const db_user = "wins65"
const db_password = "s0jjrKUr4yyeH6xn"

// Middleware


app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))




const uri = "mongodb+srv://wins65:s0jjrKUr4yyeH6xn@cluster0.n9sfu.mongodb.net/bd-games?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const clubsCollection = client.db("bd-games").collection("clubs");
    const usersCollection = client.db("bd-games").collection("users");
    const gamesCollection = client.db("bd-games").collection("games");
    const betsCollection = client.db("bd-games").collection("bets");
    const adminCollection = client.db("bd-games").collection("admin");
    const depositCollection = client.db("bd-games").collection("deposit");
    const ansCollection = client.db("bd-games").collection("ans");
    const dashboardCollection = client.db("bd-games").collection("dashboard");
    const withdrawCollection = client.db("bd-games").collection("withdraw");

    // User collection --------------------------------------

    app.post('/register', (req, res) => {
        usersCollection.insertOne(req.body, (err, result) => {
            res.send('success')
        })
    })
    app.get('/get-users', (req, res) => {
        usersCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })
    app.get('/get-single-user/:id', (req, res) => {
        usersCollection.find({ _id: ObjectId(req.params.id) }).toArray((err, docs) => {
            res.send(docs[0])
        })
    })
    app.get('/user-single', (req, res) => {
        let username = req.query.username
        usersCollection.find({ username: username }).toArray((err, docs) => {
            res.send(docs[0])
        })
    })

    app.patch('/user-update', (req, res) => {
        const user = req.body
        usersCollection.updateOne({ _id: ObjectId(user._id) },
            {
                $set: {
                    isActive: user.isActive,
                    balance: user.balance,
                    clubId: user.clubId,
                    password: user.password,
                    phone: user.phone
                }
            }
        ).then(result => {
            console.log(result);
        })
    })

    app.delete('/delete-user/:_id', (req, res) => {
        let _id = req.params._id
        usersCollection.deleteOne({ _id: ObjectId(_id) }, (err, result) => {
            res.send('success')
        })
    })

    // clubs clubsCollection -----------------------------

    app.post('/add-club', (req, res) => {
        clubsCollection.insertOne(req.body, (err, result) => {
            res.send('success')
        })
    })
    app.get('/get-club', (req, res) => {
        clubsCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })

    app.get('/single-club/:id', (req, res) => {
        const id = req.params.id
        clubsCollection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
            res.send(docs[0])
        })
    })

    app.patch('/club-edit-active', (req, res) => {
        const club = req.body
        clubsCollection.updateOne({ _id: ObjectId(club._id) }, {
            $set: {
                isActive: club.isActive,
                members: club.members,
                balance: club.balance,
                password: club.password,
                username: club.username,
                name: club.name
            }
        })
    })

    app.patch('/club-update', (req, res) => {
        const club = req.body
        clubsCollection.updateOne({ _id: ObjectId(club._id) }, {
            $set: {
                isActive: club.isActive, username: club.username, password: club.password
            }
        }).then(result => {
            console.log(result);
        })
    })

    /// gamesCollection -------------------------------
    app.post('/game-add', (req, res) => {
        gamesCollection.insertOne(req.body, (err, result) => {
        })
    })
    app.get('/game-get', (req, res) => {
        gamesCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })
    app.patch('/game-update', (req, res) => {
        const game = req.body
        gamesCollection.updateOne({ _id: ObjectId(game._id) }, {
            $set: {
                name: game.name,
                country1: game.country1,
                country2: game.country2,
                type: game.type,
                date: game.date,
                time: game.time,
                action: game.action,
                isShow: game.isShow,
                isLive: game.isLive
            }
        }).then(result => {
            console.log(result);
        })
    })

    app.delete('/game-delete/:id', (req, res) => {
        let id = req.params.id
        gamesCollection.deleteOne({ "_id": ObjectId(id) });
    })

    // betsCollection ----------- -------------
    app.post('/bet-add', (req, res) => {
        betsCollection.insertOne(req.body, (err, result) => {
        })
    })

    app.get('/bet-gets', (req, res) => {
        betsCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })

    app.get('/bet-get', (req, res) => {
        const id = req.query.id
        betsCollection.find({ gameId: id }).toArray((err, docs) => {
            res.send(docs)
        })
    })
    app.get('/single-bit', (req, res) => {
        const id = req.query.id
        betsCollection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
            res.send(docs[0])
        })
    })

    app.patch('/bet-update', (req, res) => {
        const bet = req.body
        betsCollection.updateOne({ _id: ObjectId(bet._id) }, {
            $set: {
                question: bet.question,
                action: bet.action,
                ans: bet.ans
            }
        }).then(result => {
            console.log(result);
        })
    })

    app.delete('/delete-bet/:_id', (req, res) => {
        let _id = req.params._id
        betsCollection.deleteOne({ _id: ObjectId(_id) }, (err, result) => {
            res.send('success')
        })
    })
    // adminCollection-----------------------
    app.get('/admin-get', (req, res) => {
        adminCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })

    app.post('/admin-post', (req, res) => {
        adminCollection.insertOne(req.body, (err, result) => {
        })
    })

    // Login in Api -----------------------
    app.post('/login-user', (req, res) => {
        // console.log(req.body)
        const { username, password } = req.body
        usersCollection.find({ username: username }).toArray((err, docs) => {
            const user = docs[0]
            if (password === user.password) {
                res.send({ ...user, isLoggedIn: true, })
            } else {
                res.send({
                    isLoggedIn: false,
                })
            }
        })
    })

    app.get('/single-user/:id', (req, res) => {
        let id = req.params.id
        usersCollection.find({ _id: ObjectId(id) }).toArray((err, docs) => {
            res.send(docs[0])
        })
    })

    // depositCollection --------------------------------
    app.post('/user-deposit', (req, res) => {
        depositCollection.insertOne(req.body, (err, result) => {
        })
    })
    app.get('/get-deposit', (req, res) => {
        depositCollection.find({}).toArray((err, docs) => {
            res.send(docs)
        })
    })

    app.patch('/deposit-update', (req, res) => {
        const deposit = req.body
        depositCollection.updateOne({ _id: ObjectId(deposit._id) }, {
            $set: {
                action: deposit.action,
                amount: deposit.amount,
                by: deposit.by,
                method: deposit.method,
                status: deposit.status,
                to: deposit.to,
                username: deposit.username
            }
        })
    })

    // ansCollection ----------- -------------
    app.post('/ans-add', (req, res) => {
        ansCollection.insertOne(req.body, (err, result) => {
        })
    })

    app.get('/all-user-bets', (req, res) => {
        ansCollection.find({}).toArray((err, docs) => res.send(docs))
    })

    app.get('/filter-bets/:id', (req, res) => {
        ansCollection.find({ userId: req.params.id }).toArray((err, docs) => res.send(docs))
    })

    app.patch('/ans-update', (req, res) => {
        const ans = req.body
        ansCollection.updateOne({ _id: ObjectId(ans._id) }, {
            $set: {
                isLoss: ans.isLoss,
                isWin: ans.isWin
            }
        })
    })

    // dashboardCollection ----------- -------------
    app.patch('/update-dashboard', (req, res) => {
        let dashboard = req.body
        dashboardCollection.updateOne({ _id: ObjectId(dashboard._id) }, {
            $set: {
                deposit: dashboard.deposit,
                withdraw: dashboard.withdraw,
                balance: dashboard.balance
            }
        })
    })

    app.get('/get-dashboard', (req, res) => {
        dashboardCollection.find({}).toArray((err, docs) => res.send(docs[0]))
    })

    // withdrawCollection ----------- -------------

    app.post('/add-withdraw-request', (req, res) => {
        withdrawCollection.insertOne(req.body, (err, result) => {
        })
    })
    app.get('/get-withdraw', (req, res) => {
        withdrawCollection.find({}).toArray((err, docs) => res.send(docs))
    })

    app.patch('/withdraw-update', (req, res) => {
        const withdraw = req.body
        withdrawCollection.updateOne({ _id: ObjectId(withdraw._id) }, {
            $set: {
                action: withdraw.action,
                amount: withdraw.amount,
                method: withdraw.method,
                status: withdraw.status,
                to: withdraw.to,
                username: withdraw.username
            }
        })
    })


    console.log('Database connected--!');
});



app.listen(8080, () => console.log('listening on: 8080'))