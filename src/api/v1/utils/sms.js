const config = require('@config/sms.config');

const accountSid = config.SID;
const authToken = config.AUTHTOKEN;
const client = require('twilio')(accountSid,authToken);
const from = '15673613507';

const sendSMS = async (to,text) => {
    await client.messages.create({
        from,
        to,
        body: text
    })
}

module.exports = {
    sendSMS : sendSMS
}