/**
 * Create and export configuration variables
 */


const environments = {};

// Staging (default) environment

environments.staging = {
    "httpPort": 3000,
    "httpsPort": 3001,
    "envName": "staging",
    "stripe": {
        "hostname": "api.stripe.com",
        "path_charges": "/v1/charges",
        "key": "sk_test_pLqJ8vLlQOWEy99zN9H8loCu"
    },
    "mailgun": {
        "hostname": "api.mailgun.net",
        "path": "/v3",
        "domain": "sandboxd6655f04aa2c45988630115ad8882a0e.mailgun.org/messages",
        "key": "pubkey-3c5f349229c083658e5fd47c1b809304"
    }
}

// Production environment
environments.production = {
    "httpPort": 5000,
    "httpsPort": 5001,
    "envName": "production",
    "stripe": {
        "url": "api.stripe.com",
        "pathCharges": "/v1/charges",
        "key": "sk_test_pLqJ8vLlQOWEy99zN9H8loCu"
    },
    "mailgun": {
        "hostname": "api.mailgun.net",
        "path": "/v3",
        "domain": "sandboxd6655f04aa2c45988630115ad8882a0e.mailgun.org/messages",
        "key": "pubkey-3c5f349229c083658e5fd47c1b809304"
    }
}

const currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

const envToExport = typeof (environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport;
