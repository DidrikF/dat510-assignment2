# dat510-assignment2 - Cryptosystem

## Implementing cryptosystem involving Elliptic Curve Diffie-Hellman key exchage, a Blum Blum Shub CSPRNG and AES to send encrypted messages between client and server

### The contents of the directory

```
dat500-assignment2
│   .gitignore  // Excludes "node-modules" from git
|   blum-blum-shub.js // Exports function that produces cryptographically secure pseudo random numbers (bit string)
|   cipher_text_message.PNG // Screen capture illustrating encrypted message going over the network (captured with wireshark)
|   clear_text_message.PNG // Screen capture illustration clear text message going over the network (captured with wireshark)
|   ellipic-curve.js // Exports class that implements elliptic curve calculations used in Diffi-Hellman key exchange
|   helpers.js // Various helper functions
|   index.js // Program starting point, command line option parsing, client and server code
|   keys.txt // The public and private keys generated on last run of the program
|   MessageHandler.js // Exports class that contains code to encrypt/decrypt messages, parse commands from the command line and handle these commands.
│   package.json    // Declares package dependencies for the project
│   package-lock.json   // Lists the installed packages with exact version numbers
|   picture.png // Picture that can be used to demonstrate sending encrypted files between client and server
|   program_overview.PNG // Illustration showing the general flow of the program
|   README.md // Explains the code and how to run it
|   test.txt // Text file that can be used to demonstrate sending encrypted files between client and server
|   tests.js // Contains tests for various functions and classes, primarily blum-blum-shub and elliptic curve implementations.
│
└───files    // Files that are received over the encrypted connection are stored in this folder
|
└───node_modules // Folder containing installed packages, exogenous to Node.js core packages.
```


### Setup and installation
The assignment was solved using JavaScript and Node.js. To be able to run the programs, Node.js need to be installed.
Download and install Node.js using this link: [https://nodejs.org/en/download/]
The installer should add Node.js to your path. To check that your installation completed successfully you can run `node -v`
to print the current version of Node.js installed on the machine.

Depending on the operating system you are using, the dependencies required may or may not work out of the box. 
If you are having issues with any of the dependencies I recommend deleting the "node_modules" folder and running:
`npm install`. this will reinstall all packages the project depends on. NPM is a package manager for Node, and is installed alongside it by default.

Your should now be ready to run the code.

### About the program

The program is implements Elliptic Curve Diffie-Hellman (ECDF) and Blum Blum Shub CSPRNG to produce a symmetric key to be used with AES to encrypt both files and messages. The program is a command line chat application, where you either start in client or server mode. The server must be started first, otherwise the client will not be able to connect. When you run the program various command line options can be passed to define the inner workings of the program. You can define all public parameters used in the ECDH key exchange, the port and IP you want to bind/connect to, the username we want to appear in the chat with as well as whether or not to create new public/private keys or load old ones from a file.

Command line options:
```
  -V, --version               output the version number
  -i, --ip [ip_address]       The ip address to connect to or bind the server to. (default: localhost)
  -o, --port [number]         Port to listen on, or connect to (default: 3000)
  -m, --mode [type]           Start in client or server mode (default: server)
  -a, --a [coefficient]       The "a" coefficient for the elliptic curve equation (default: 2)
  -b, --b [coefficient]       The "b" coefficient for the elliptic curve equation (default: 2)
  -g, --generator [point]     The generator (starting point) for the elliptic curve (default: 5,1)
  -p, --prime [number]        The prime ensuring the group is finite and limited to Zp (default: 17)
  -c, --cardinality [number]  The cardinality of the elliptic curve over Zp (default: 19)
  -u, --username <name>       Username to be displayed next to your messages. (default: You)
  -s, --spawn-keys [boolean]  Spawn new private and public key (default: true)
  -h, --help                  output usage information
```

Once a symmetric key is successfully established, the users can send messages and files encrypted with AES to one another. You send a file by writing `.file ./path/to/file.txt`, where `.file` is a command that is parsed and recognized by the program. There are other commands as well. Write `.help` to list them. To send a message; simply type your message and press enter.

Program commands:
```
.exit                       => Exit program
.new_keys                   => Run ECDH and establish new AES key
.print_keys                 => Print AES key and public key of other
.help                       => Print help
.file ./path/to/file.txt    => Send encrypted file
Some message text (enter)   => Send encrypted message
```

### Running the code
The easiest way to get going is explained here. There are hard coded default values for the parameters needed to perform the ECDH key exchange, so the user is not required to provide them. The server and client is bound/connects to localhost on port 3000 by default.

#### Starting in server mode

`node index --mode server --username Alice` 

#### Starting in client mode

`node index --mode client --username Bob`

