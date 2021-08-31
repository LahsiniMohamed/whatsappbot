const axios = require('axios');
const FormData = require('form-data');
const b64toBlob = require('../utils/functions')
var mime = require('mime-types')
const conf = require('dotenv').config()

const port = process.env.PORT || 8080

const path = process.env.PATH || 'document'

const getMessages = async (message)=>{

    const {from , id, author, type} = message

    console.log('message from',message.from)
    console.log('message id',message.id)
    console.log('message author',message.author)
    console.log('message type',message.type)
    console.log('has media', message.hasMedia)

    const chat = await message.getChat()

    const {isGroup, name} = chat
    console.log('message sender name', chat.name)
    try {
        if (message.hasMedia){
            const media = await message.downloadMedia()

            console.log('message mimetype', media.mimetype)
            console.log('message filename', media.filename)
            const b64Data = media.data

            var savePath = ''
            /*
            if(isGroup){
              savePath = name
            }*/
            if(name){
              savePath = name
            }
            if (!media.filename){
              const fileExtension = mime.extension(media.mimetype);
              console.log('extensions :', fileExtension)
              media.filename = id.id+'.'+fileExtension

            }
            /*
            const blob = b64toBlob(b64Data,media.mimetype)
            /*
            const file = File(blob,'document')

            
            
            var formData = new FormData();*/
/*
            formData.append("data",'b64Data');
            formData.append("name",media.filename)
            formData.append("mimetype",media.mimetype)

            formData.append('document', blob,media.filename)
            */
            var data = {
              blob : b64Data,
              name : media.filename,
              mimetype : media.mimetype,
              savePath : savePath
            }

            console.log('finished making file', media.filename,savePath)
            axios({
                method: "post",
                url: `http://localhost:8080/document`,
                data: data,
                headers: { 
                  'Content-Type': 'application/json'
                },
              })
            .then(function (response) {
                  //handle success
                  console.log('sent',media.filename);
                })
            .catch(function (err) {
                  //handle error
                  console.log('error sending file',media.filename);
                });
            
        }
    } catch (error) {
        console.log('error trying to download document')
        throw error
    }

}

module.exports = getMessages;