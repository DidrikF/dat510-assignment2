const net = require('net');
const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');

const program = require('commander');
const axios = require('axios');

const EllipticCurve = require('./elliptic-curve');
const { modulo_of_fraction } = require('./helpers');
const blum_blum_shub = require('./blum-blum-shub');




// Code tcp client server code
// connect to specified IP


// Code diffie-hellman algorithm 

// Code PRNG (RC4 i think)

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
    .option('-s, --spawn [boolean]', 'Spawn new private and public key', true)
    .option('-f, --file [path]', 'Path to file to send', undefined)
    .parse(process.argv);



if (program.spawn || true) {

    var EC = new EllipticCurve(program.a, program.b, program.generator, program.prime, program.cardinality); // 2,3,[3,6], 97,5
    var private_key = null;
    var public_key = null;
    var aes_key = null;

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


function start_client_or_server() {
    if (program.mode === 'server') {
        const server = net.createServer((c) => {
            console.log('client connected');

            setup_readline(c)

            c.write(JSON.stringify({
                type: 'public_key',
                public_key: public_key,
            }))

            c.on('data', (data) => {
                console.log(data.toString())
                const message = JSON.parse(data);
                handleMessage(message);

            })

            c.on('error', (err) => {
                console.log('Connection error: ', err)
            })

            c.on('end', () => {
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
        const client = net.createConnection({ port: program.port }, () => {
            console.log('connected to server on port: ', program.port);

            client.write(JSON.stringify({
                type: 'public_key',
                public_key: public_key,
            }));
        });

        client.on('data', (data) => {
            console.log(data.toString());
            const message = JSON.parse(data);
            handleMessage(message)
        });

        client.on('error', (err) => {
            console.log(err);
            client.close();
            process.exit(1);
        })

        client.on('end', () => {
            console.log('disconnected from server');
        });


    } else if (program.mode === 'test') {

        // not in use atm

    } else {
        console.log('Only "client" and "server" are valid modes to run the program in');
    }
}

function handleMessage(message) {

}


function setup_readline(connection) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: program.username + '> '
    });

    rl.prompt();

    // need access to client and server

    rl.on('line', (line) => {
        switch (line.trim()) {
            case '.exit':
                rl.close();
                break;
            case '.new_keys':
                // initiate new key exchange

                break;
            case /^\.file .*$/:
                // send file

                break;
            default:
                // send message


                break;
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Have a great day!');
        process.exit(0);
    });
}


function store_keys(private_key, public_key) {
    const keys = {
        private_key: private_key,
        public_key: public_key
    }
    try {
        fs.writeFileSync('./keys.txt', JSON.stringify(keys))
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

function get_keys() {
    try {
        const data = fs.readFileSync('./keys.txt');
        const keys = JSON.parse(data);
        return keys
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}



/*
console.log(modulo_of_fraction(-3,6,23))

console.log('----Add [3,10] and [9,7]: ', EC.point_add([3,10], [9,7]))

console.log('----Double [9,7]: ', EC.point_double([3,10]))



for (let i = 0; i <= 97; i++) {
    console.log(EC.point_multiplication([3, 6], i))
}

*/