const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");
const StringDecoder = require("string_decoder").StringDecoder;

const config = require("./lib/config");
const handlers = require("./lib/handlers");
const helpers = require("./lib/helpers");


const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res)
});

httpServer.listen(config.httpPort, () => {
    console.log("Listening to port: ", config.httpPort, "in HTTP mode")
});

// Instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync("./https/key.pem"),
    'cert': fs.readFileSync("./https/cert.pem")
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log("Listening to port: ", config.httpsPort, "in HTTPS mode")
});

const unifiedServer = (req, res) => {

    /**
     * Parse and trim the url to remove added bars at the end
     */

    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    /**
     * Check the http method
     */

    const httpMethod = req.method.toLowerCase();

    /**
    * Parse query string
    */

    const queryString = parsedURL.query;

    /**
     * Parse headers
     */

    const parseHeaders = req.headers;

    /**
     * Parse payload
     */

    const decoder = new StringDecoder('utf-8');

    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })
    req.on('end', () => {
        buffer += decoder.end();

        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            "trimmedPath": trimmedPath,
            "queryString": queryString,
            "method": httpMethod,
            "headers": parseHeaders,
            "payload": helpers.parseJsonToObject(buffer)
        };

        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handlder

            statusCode = typeof (statusCode == 'number') ? statusCode : 200;

            payload = typeof (payload == 'object') ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode)
            res.end(payloadString);
        })
    })
}

const router = {
    "users": handlers.users,
    "tokens": handlers.tokens,
    "cart": handlers.cart
}