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

        this.rl.on('line', (line) => {
            // console.log('Got line: ', line)
            switch (line.trim()) {
                case '.exit':
                    this.rl.close();
                    console.log('Bye, bye, exiting the process.')
                    process.exit(0)
                    break;
                case '.new_keys':
                    // initiate new key exchange
                    console.log('Not implemented, sorry')
                    break;
                case '.print_keys':
                    console.log('AES Key: ', this.aes_key);
                    console.log('Public Key of other: ', this.public_key_of_other)

                    break;
                case '.help':
                    console.log('.exit => Exit program')
                    console.log('.new_keys => Run ECDH and establish new AES key')
                    console.log('.print_keys => Print AES key and public key of other')
                    console.log('.help => Print help')
                    console.log('.file ./path/to/file.txt => Send encrypted file')
                    console.log('Some message text => Send encrypted message')
                    break;
                default:
                    this.handle_sending_of_message(line)
                    break;
            }
            this.rl.prompt();
        }).on('resume', () => {
            this.rl.prompt();
        }).on('close', () => {
            console.log('Exiting...\nHave a great day!');
            process.exit(0);
        });
    }

    handle_sending_of_message (line) {
        // console.log('Handling sending with line: ', line)
        if (!this.aes_key || !this.aes_key_established) {
            console.log('Cannot send message when aes_keys are not established.')
            return;
        }
        const parsed = RegExp(/^(\.\w+) (.*)$/).exec(line) || [];
        let command = 'none';
        let filePath = '';
        if (parsed.length > 1) {
            command = parsed[1]
            if (command === '.file' && parsed.length === 3) {
                filePath = parsed[2]
            }
        }

        const message = {
            username: this.program.username,
        };

        switch (command) {
            case '.file':
                try {
                    const file = fs.readFileSync(filePath)
                    message.type = 'file';
                    message.file = file
                    const pathElements = filePath.split('/');
                    message.fileName = pathElements[pathElements.length - 1];
                } catch (error) {
                    console.log('Cannot send file! Failed to read file with error: ', error);
                    return;
                }

                break;
            default:
                message.type = 'text';
                message.text  = line;
                break;
        }

        this.encrypt_and_send_message(message);
    }


    handle_reception_of_message (data) {
        const message = this.decrypt_message(data);
        if (message === null) return;
        // console.log('Handle reception of message: ', message)
        switch (message.type) {
            case 'file':
                console.log('\n'+message.username+'> '+ 'Got file with name: ' + message.fileName);
                console.log('Saving to ./files');
                try {
                    const file = Buffer.from(message.file.data);
                    fs.writeFileSync('./files/'+message.fileName, file);
                } catch (error) {
                    console.log('Failed to write file to file system with error: ', error)
                }
                break;
            case 'text':
                console.log('\n'+message.username+'> '+message.text);
                break;
            default:
                console.log('Received unknown message type: ', message.type)
                break;
        }
        this.rl.prompt();
    }

    encrypt_and_send_message (message) {
        this.setup_cipher()
        // console.log('Encrypting and sending message: ', message)
        let encrypted;
        try {
            encrypted = this.cipher.update(JSON.stringify(message), 'utf8', 'hex');
            encrypted += this.cipher.final('hex');
        } catch (error) {
            console.log('Failed to encrypt message with error: ', error);
            return
        }
        console.log('Encrypted message to send: ', encrypted);

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
        // console.log('Decrypting data: ', data)
        let decrypted;
        try {
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

