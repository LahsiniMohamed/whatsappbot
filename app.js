const qrcode = require('qrcode-terminal');
const fs = require('fs');
const getMessages = require('./messages/messages')

const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    var data = require(SESSION_FILE_PATH);
    if (Object.keys(data).length>0){
        console.log('session already exists')
        sessionCfg = data
    }
}

const client = new Client({ session: sessionCfg });
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

// You also could connect to an existing instance of a browser
// { 
//    puppeteer: {
//        browserWSEndpoint: `ws://localhost:3000`
//    }
// }


// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message', async message => {
	getMessages(message)
});

client.initialize();