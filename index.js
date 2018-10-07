const net = require('net');

const program = require('commander');
const axios = require('axios');

const EllipticCurve = require('./elliptic-curve');
const { modulo_of_fraction, store_keys, get_keys, isJson } = require('./helpers');
const MessageHandler = require('./MessageHandler');



// Code diffie-hellman algorithm 


// Setup AES communication between the two parties

// Enable sending of messages
// Enable sending of files!


const random_org_api_key = 'd70ec30e-8eeb-4c72-ab8c-3ad7749908e1';


program
    .version('0.1.0')
    .option('-i, --ip [ip_address]', 'The ip address to connect to or bind the server to.', 'localhost')
    .option('-o, --port [number]', 'Port to listen on, or connect to', 3000)
    .option('-m, --mode [type]', 'Start in client or server mode', 'server')
    .option('-a, --a [coefficient]', 'The "a" coefficient for the elliptic curve equation', 1)
    .option('-b, --b [coefficient]', 'The "b" coefficient for the elliptic curve equation', 1)
    .option('-g, --generator [point]', 'The generator (starting point) for the elliptic curve', [3, 10])
    .option('-p, --prime [number]', 'The prime ensuring the group is finite and limited to Zp', 23)
    .option('-c, --cardinality [number]', 'The cardinality of the elliptic curve over Zp', 27)
    .option('-u, --username <name>', 'Username to be displayed next to your messages.')
    .option('-s, --spawn-keys [boolean]', 'Spawn new private and public key', true)
    .option('-f, --file [path]', 'Path to file to send', undefined)
    .parse(process.argv);


/**
 * First a public and private key pair is established. This is done either by using a TRNG to get a private key
 * and then calculate a public key, or the previously generated keys are loaded from a file.
 */

if (program.spawnKeys || true) {
    var EC = new EllipticCurve(program.a, program.b, program.generator, program.prime, program.cardinality); // 2,3,[3,6], 97,5
    var private_key = null;
    var public_key = null;

    // True random source to generate private key:
    axios.post('https://api.random.org/json-rpc/1/invoke', {
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
            "apiKey": random_org_api_key,
            "n": 1,
            "min": 2,
            "max": 27,
            "replacement": true
        },
        "id": 1
    }).then(response => {
        private_key = response.data.result.random.data[0];
        console.log('private_key: ', private_key);

        public_key = EC.generate_public_key(private_key);
        console.log('public_key: ', public_key);

        store_keys(private_key, public_key);

        start_client_or_server();

    })
        .catch(error => {
            // console.log('Failed to get true random number for private key');
            console.log(error);

        });

} else {
    const keys = get_keys()

    var private_key = keys.private_key;
    var public_key = keys.public_key;

    start_client_or_server()
}


/**
 * The network communication code.
 * Either the TCP server is started or a TCP client will try to connect to the server.
 * Various event listeners are registered, most notably the 'data' handler which invokes
 * processing of messages.
 */


function start_client_or_server() {
    if (program.mode === 'server') {
        let messageHandler

        const server = net.createServer((connection) => {
            console.log('client connected');
            messageHandler = new MessageHandler(connection, program);

            connection.write(JSON.stringify({
                type: 'public_key',
                username: program.username,
                public_key: public_key,
            }))

            connection.on('data', (data) => {
                // console.log(data.toString())
                if (isJson(data)) {
                    const message = JSON.parse(data);

                    if (message.type === 'public_key') {
                        messageHandler.public_key_of_other = message.public_key;
                        messageHandler.aes_key = EC.generate_symmetric_key(message.public_key, private_key);
                        console.log(messageHandler.aes_key)
                        connection.write(JSON.stringify({
                            type: 'aes_key_established'
                        }));
                        if (messageHandler.aes_key_established) messageHandler.rl.resume();
                    } else if (message.type === 'aes_key_established') {
                        messageHandler.aes_key_established = true;
                        if (messageHandler.aes_key) messageHandler.rl.resume();
                    }
                }

                if (messageHandler.aes_key_established && messageHandler.aes_key) {
                    messageHandler.handle_reception_of_message(data)
                }

            })

            connection.on('error', (err) => {
                console.log('Connection error: ', err)
            })

            connection.on('end', () => {
                console.log('client disconnected');
            });

        });


        server.on('error', (err) => {
            console.log('Server error: ', err);
            server.close();
            process.exit(1);
        });

        server.listen(program.port, () => {
            console.log('server bound to port: ', program.port);
        });


    } else if (program.mode === 'client') {

        let messageHandler;

        const connection = net.createConnection({ port: program.port }, () => {
            console.log('connected to server on port: ', program.port);
            messageHandler = new MessageHandler(connection, program)

            connection.write(JSON.stringify({
                type: 'public_key',
                username: program.username,
                public_key: public_key,
            }));
        });

        connection.on('data', (data) => {
            // console.log(data.toString());

            if (isJson(data)) {
                const message = JSON.parse(data);
                console.log(message)
                if (message.type === 'public_key') {
                    messageHandler.public_key_of_other = message.public_key;
                    messageHandler.aes_key = EC.generate_symmetric_key(message.public_key, private_key);
                    console.log(messageHandler.aes_key)
                    connection.write(JSON.stringify({
                        type: 'aes_key_established'
                    }));

                    if (messageHandler.aes_key_established) messageHandler.rl.resume();
                } else if (message.type === 'aes_key_established') {
                    messageHandler.aes_key_established = true;

                    if (messageHandler.aes_key) messageHandler.rl.resume();
                }
            }

            

            if (messageHandler.aes_key_established && messageHandler.aes_key) {
                messageHandler.handle_reception_of_message(data)
            }
            
        });

        connection.on('error', (err) => {
            console.log(err);
            process.exit(1);
        })

        connection.on('end', () => {
            console.log('disconnected from server');
        });


    } else if (program.mode === 'test') {

        // not in use atm

    } else {
        console.log('Only "client" and "server" are valid modes to run the program in');
    }
}



