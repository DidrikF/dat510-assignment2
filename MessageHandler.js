const crypto = require('crypto')
const readline = require('readline');
const fs = require('fs');

module.exports = class MessageHandler {
    constructor (connection, program) {
        this.connection = connection;
        this.aes_key = null;
        this.aes_key_established = false;
        this.public_key_of_other = null;
        this.cipher = null;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: program.username + "> "
        })

        this.rl.pause();

        this.rl.on('line', (line) => {
            switch (line.trim()) {
                case '.exit':
                    rl.close();
                    break;
                case '.new_keys':
                    // initiate new key exchange

                    break;
                case '.print_keys':


                    break;
                case '.help':

                    break;
                default:
                    // send message
                    this.handle_sending_of_message(line)

                    break;
            }
            this.rl.prompt();
        }).on('resume', () => {
            this.rl.prompt();
        }).on('close', () => {
            console.log('Have a great day!');
            process.exit(0);
        });
    }

    handle_sending_of_message (line) {
        if (!this.aes_key || !this.aes_key_established) return
        console.log(line)
        switch (message.type) {
            case /^\.file (.*)$/:
    
                break;
            default:
                console.log('Received unknown message type: ', message.type)
                break;
        }
    }


    handle_reception_of_message (data) {
        
        const message = JSON.parse(data)

        switch (message.type) {
            case 'file':
    
                break;
            case 'text':
    
                break;
            default:
                console.log('Received unknown message type: ', message.type)
                break;
        }
    }

    setup_cipher () {
        this.cipher = crypto.createCipher('aes128', this.aes_key)
    }



}



