const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const twilio = require('twilio')
const client = new twilio(accountSid, authToken)

client.messages
        .create({
            body: insideBody,
            to: inputedNumber,
            from: '+12525955686'
        })
        .then((message) => console.log(message.sid))
