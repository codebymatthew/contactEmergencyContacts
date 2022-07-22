// MIDDLEWARE / MODULES
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

// PARAMETERS
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const mongoPW = process.env.MONGODB_PW
const mongoID = process.env.MONGODB_ID
const PORT = 8000
const connectionString = `mongodb+srv://focodevsproject001:${mongoPW}@cluster0.rrtbx.mongodb.net/?retryWrites=true&w=majority`
const twilio = require('twilio')
const client = new twilio(accountSid, authToken)

MongoClient.connect(connectionString, { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  const db = client.db('emergency-messaging-system')
  const numbersCollection = db.collection('numbers')
  const messagesCollection = db.collection('messages')
  app.set('view engine', 'ejs')
  app.use(express.static(__dirname + '/public'))
  app.use(cors())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(express.urlencoded({extended: true}))

    app.post('/submit-form', (req, res) => {
      numbersCollection.insertOne(req.body)
        .then(result => {
          console.log(result)
          res.redirect('/')
        })
        .catch(error => console.error(error))
      })
    app.post('/message-form', (req, res) => {
      console.log(req.body.message)
      messagesCollection.insertOne(req.body)
      .then(result=> {
        res.redirect('/')
      })
      .catch(error => console.error(error))
    })


    app.get('/', async (req, res) => {
      let contactVar = await numbersCollection.find().toArray()
      let messagesVar = await messagesCollection.find().toArray()  
      console.log(contactVar)
      console.log(messagesVar)
      res.render('index.ejs', {contacts: contactVar, messages: messagesVar})
    })

    app.post('/send-message', (req, res) => {
      console.log(req.body)
    })

  })
  .catch(error => console.error(error))
    



app.listen(process.env.PORT || PORT, () => {
  console.log(`The server is currently running on port: ${PORT}`)
})



// client.messages
//         .create({
//             body: req.body.smsMessage,
//             to: req.body.phoneNumber,
//             from: '+12525955686'
//         })
//         .then((message) => console.log(message.sid))