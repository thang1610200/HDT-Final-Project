const {google} = require('googleapis');
const config = require('@config/drive.config');
const stream = require('stream');

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const REDIRECT_URL = config.REDIRECT_URL;
const REFESH_TOKEN = config.REFESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token: REFESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oAuth2Client
})
var that = module.exports = {
    setPublic: async(id) => {
        try{
            await drive.permissions.create({
                fileId: id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
        })
    }
    catch(err){
        console.error(err);
    }
    },
    uploadFile: async(fileObject) => {
        try{
        const bufferStream = new stream.PassThrough();
        bufferStream.end(fileObject.buffer);
            const {data} = await drive.files.create({
                media: {
                    mimeType: fileObject.mimeType,
                    body: bufferStream,
                },
                requestBody: {
                    name: fileObject.originalname,
                    parents: ['1m3KuXgVzSiuuVnGx4Xp7FtUV8vHObeXt']
                },
                fields: 'id,name',
            })
            await that.setPublic(data.id);
            return data;
        }
        catch(err){
            console.error(err);
        }
    }
}
