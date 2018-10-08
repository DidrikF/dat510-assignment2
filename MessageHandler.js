const crypto = require('crypto')
const readline = require('readline');
const fs = require('fs');
const { isJson } = require('./helpers')

module.exports = class MessageHandler {
    constructor (connection, program) {
        this.connection = connection;
        this.aes_key = null;
        this.aes_key_established = false;
        this.public_key_of_other = null;
        this.cipher = null;
        this.decipher = null;
        this.program = program;
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: program.username + "> "
        })

        // this.rl.pause();

        this.rl.on('line', (line) => {
            console.log('Got line: ', line)
            switch (line.trim()) {
                case '.exit':
                    rl.close();
                    console.log('Bye, bye, exiting the process.')
                    process.exit(0)
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
        console.log('Handling sending with line: ', line)
        if (!this.aes_key || !this.aes_key_established) {
            console.log('Cannot send message when aes_keys are not established.')
            return;
        }
        const parsed = RegExp(/^(\.\w+) (.*)$/).exec(line) || [];
        // console.log(parsed)
        let command = 'none';
        let filePath = '';
        if (parsed.length > 1) {
            command = parsed[1]
            if (command === '.file' && parsed.length === 3) {
                filePath = parsed[2]
            }
        }
        // console.log('Command: ', command, 'File path: ', filePath)

        const message = {
            username: this.program.username,
        };

        switch (command) {
            case '.file':
                console.log('Encrypting and sending file with name: ', filePath);
                
                try {
                    const file = fs.readFileSync(filePath);
                    message.type = 'file';
                    message.file = file;
                    const pathElements = filePath.split('/');
                    message.fileName = pathElements[pathElements.length - 1];
                } catch (error) {
                    console.log('Cannot send file! Failed to read file with error: ', error);
                    return;
                }

                break;
            default:
                console.log('Encrypting and sending line: ', line)
                message.type = 'text';
                message.text  = line;
                break;
        }

        this.encrypt_and_send_message(message);
    }


    handle_reception_of_message (data) {
        const message = this.decrypt_message(data);
        if (message === null) return;
        console.log('Handle reception of message: ', message)

        switch (message.type) {
            case 'file':

                break;
            case 'text':
    
                break;
            default:
                console.log('Received unknown message type: ', message.type)
                break;
        }
        this.rl.prompt();
    }

    encrypt_and_send_message (message) {
        this.setup_cipher()
        console.log('Encrypting and sending message: ', message)
        let encrypted;
        try {
            //encrypted = Buffer.concat([Buffer.from(this.cipher.update(JSON.stringify(message)), "utf8", 'hex'), Buffer.from(this.cipher.final('hex'))]);
            encrypted = this.cipher.update(JSON.stringify(message), 'utf8', 'hex');
            encrypted += this.cipher.final('hex');
        } catch (error) {
            console.log('Failed to encrypt message with error: ', error);
            return
        }
        console.log('Encrypted message to send: ', encrypted);


        //const decrypted = Buffer.concat([Buffer.from(this.decipher.update(encrypted, 'hex', 'utf8')), Buffer.from(this.decipher.final('utf8'))]);
        //let decrypted = this.decipher.update(encrypted, 'hex', 'utf8');
        //decrypted += this.decipher.final('utf8');
        
        //console.log('Decrypted: ', decrypted)
        try {

            this.connection.write(encrypted);
            this.connection.write('\n');
        } catch (error) {
            console.log('Failed to write message to connection with error: ', error);
        }
    }

    decrypt_message (data) {
        this.setup_cipher();
        if (isJson(data)) return JSON.parse(data);
        console.log('Decrypting data: ', data)
        let decrypted;
        try {
            //decrypted = Buffer.concat([Buffer.from(this.decipher.update(data, 'hex', 'utf8')), Buffer.from(this.decipher.final('utf8'))]);
            decrypted = this.decipher.update(data, 'hex', 'utf8');
            decrypted += this.decipher.final('utf8');
        } catch (error) {
            console.log('Failed to decrypt data with error: ', error);
            return null;
        }
        return JSON.parse(decrypted.toString());
    }

    setup_cipher () {
        if (!this.aes_key) throw new Error('Cannot create aes cipher object without an aes_key.')
        this.cipher = crypto.createCipher('aes128', this.aes_key);
        this.decipher = crypto.createDecipher('aes128', this.aes_key);
    }



}



