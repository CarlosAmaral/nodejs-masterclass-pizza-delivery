/**
 * Request handlers
 */

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const mockCart = require("../mock/cart.json");

// Define handlers
let handlers = {};

// Ping Handler
handlers.users = (data, cb) => {
  const acceptableMethods = ["get", "post", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._users = {};

// Users - GET
// Required fields: email
handlers._users.get = (data, cb) => {
  const email = typeof data.queryString.email == "string" &&
    data.queryString.email.trim().length > 0
      ? data.queryString.email.trim()
      : false;

  if (email) {
    _data.read("users", email, (err, data) => {
      if (!err && data) {
        cb(200, data);
      } else {
        cb(404, { Error: "Not found" });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers._users.post = (data, cb) => {
  //Required fields: name, email and streetAddress
  const name = typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;
  const email = typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  const streetAddress = typeof data.payload.streetAddress == "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;

  if (name && email && streetAddress) {
    _data.read("users", email, (err, data) => {
      if (err) {
        const verifyEmail = helpers.isEmailValid(email);
        if (verifyEmail) {
          const userObj = {
            name: name,
            email: email,
            streetAddress: streetAddress
          };
          _data.create("users", email, userObj, err => {
            if (!err) {
              cb(200, { Success: "User successfully created!" });
            } else {
              console.log(err);
              cb(500, { Error: "Could not create record!" });
            }
          });
        } else {
          cb(500, { Error: "Wrong email format" });
        }
      } else {
        cb(500, { Error: "An user with that email already exists" });
      }
    });
  } else {
    cb(400, {
      Error: "Missing required fields: name, email or Street Address"
    });
  }
};

// Users - PUT
// Required: name, email, streetAddress
handlers._users.put = (data, cb) => {
  //Required fields
  const name = typeof data.payload.name == "string" && data.payload.name.trim().length > 0
      ? data.payload.name.trim()
      : false;
  const email = typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;
  const streetAddress = typeof data.payload.streetAddress == "string" &&
    data.payload.streetAddress.trim().length > 0
      ? data.payload.streetAddress.trim()
      : false;

  if (email) {
    if (name || streetAddress) {
      _data.read("users", email, (err, userData) => {
        if (!err && userData) {
          if (name) {
            userData.name = name;
          }

          if (streetAddress) {
            userData.streetAddress = streetAddress;
          }

          _data.update("users", email, userData, (err) => {
            if (!err) {
              cb(200, { status: "Successfully updated!" });
            } else {
              cb(500, { Error: "Couldnt update the file" });
            }
          });
        } else {
          cb(400, { Error: "The specified user does not exist" });
        }
      });
    }
  } else {
    cb(400, { Error: "Missing required fields: name, email or streetAddress" });
  }
};

// Users - DELETE
// Required: email
handlers._users.delete = (data, cb) => {
  const email = typeof data.queryString.email == "string" &&
    data.queryString.email.trim().length > 0
      ? data.queryString.email.trim()
      : false;

  if (email) {
    _data.read("users", email, (err, data) => {
      if (!err && data) {
        _data.delete("users", email, err => {
          if (!err) {
            cb(200, { status: "success" });
          } else {
            cb(500, { Error: "Could not delete user" });
          }
        });
      } else {
        cb(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    cb(400, { Error: "Missing required field" });
  }
};

handlers.tokens = (data, cb) => {
  const acceptableMethods = ["get", "post", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._tokens = {};

//Tokens - Get
//Required fields: id
handlers._tokens.get = (data, cb) => {
  const id = typeof data.queryString.id == "string" &&
    data.queryString.id.trim().length == 20
      ? data.queryString.id.trim()
      : false;

  if (id) {
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        cb(200, data);
      } else {
        cb(404, { Error: "Can't find token" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

//Tokens - Post
// Required fields: email
handlers._tokens.post = (data, cb) => {
  const email = typeof data.payload.email == "string" &&
    data.payload.email.trim().length > 0
      ? data.payload.email.trim()
      : false;

  if (email) {
    _data.read("users", email, (err, data) => {
      if (!err && data) {
        const tokenId = helpers.createRandomString(20);
        const expires = Date.now() + 1000 * 60 * 60;
        const tokenObj = {
          id: tokenId,
          expires: expires,
          email: email
        };
        _data.create("tokens", tokenId, tokenObj, (err, data) => {
          if (!err) {
            cb(200, tokenObj);
          } else {
            cb(500, { Error: "Unable to create token" });
          }
        });
      } else {
        cb(404, { Error: "An user with that email does not exist" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};
//Tokens - Put
// Required fields: id and extend
handlers._tokens.put = (data, cb) => {
  const id = typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;
  const extend = typeof data.payload.extend == "boolean" && data.payload.extend == true
      ? data.payload.extend
      : false;

  if (id && extend) {
    _data.read("tokens", id, (err, data) => {
      if (!err && data) {
        if (data.expires > Date.now()) {
          data.expires = Date.now() + 1000 * 60 * 60;
          _data.update('tokens', id, data, (err) => {
            if (!err) {
              cb(200, { Success: "The Token was extended successfully." });
            } else {
              cb(500, { Error: "The Token wasn't updated" });
            }
          });
        } else {
          cb(400, { Error: "The Token has expired and can't be extended." });
        }
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};
//Tokens - Delete
// Required fields: id
handlers._tokens.delete = (data, cb) => {
  const id = typeof data.queryString.id == "string" &&
    data.queryString.id.trim().length == 20
      ? data.queryString.id.trim()
      : false;

  if (id) {
    _data.delete("tokens", id, (err, data) => {
      if (!err) {
        cb(200, { Success: "Token successfully deleted." });
      } else {
        cb(404, { Error: "Can't find token" });
      }
    });
  } else {
    cb(400, { Error: "Missing required fields" });
  }
};

handlers.cart = (data, cb) => {
  const acceptableMethods = ["get", "post"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._cart[data.method](data, cb);
  } else {
    cb(405);
  }
};

handlers._cart = {};

//Cart - Get
//Required fields: id and availableItems
handlers._cart.get = (data, cb) => {

  const availableItems = typeof data.queryString.availableItems == "boolean" && data.queryString.availableItems == true
    ? data.queryString.availableItems
    : false;
  
  const id = typeof data.queryString.id == "string" && data.queryString.id.trim().length == 20
    ? data.queryString.id.trim()
    : false;

  if(id && availableItems){
    handlers._tokens.get(data, (status, response) => {
      if(status === 200){
        if(availableItems){
          cb(status, mockCart)
        } else {
            cb();
        }
      } else {
        cb(403, {Error: "Cannot retrieve shopping cart because you are not logged in"})
      }
    })
  }else {
    cb(400, {Error: "Missing required field"})
  }
};

//Cart - Get
//Required fields: id and cart
handlers._cart.post = (data, cb) => {
  const cart = Array.isArray(data.payload.cart) && data.payload.cart.length > 0 
    && mockCart.map(i => data.payload.cart.map(k => k.item).indexOf(i.item) > -1);

  const id = typeof data.payload.id == "string" && data.payload.id.trim().length == 20
    ? data.payload.id.trim()
    : false;

  if (id && cart.includes(true)) {
    const dataObj = { queryString: { id: data.payload.id } }
    handlers._tokens.get(dataObj, (status, response) => {
      if (status === 200) {
        _data.read("users", response.email, (err, response) => {
          if (!err) {
            response.cart = data.payload.cart;
            _data.update("users", response.email, response, async (error) => {
              if (!error && await helpers.submitPayment() && await helpers.sendEmail(response)) {
                cb(200, { Success: "Successfully added shopping cart to user and processed the order" })
              } else {
                cb(500, { Error: "Error updating the cart and submiting your order" })
              }
            });
          } else {
            cb(500, { Error: "Error updating the cart and submiting your order" })
          }
        })
      } else {
        cb(403, { Error: "Cannot update shopping cart and submit your order because you are not logged in" })
      }
    })
  } else {
    cb(400, { Error: "Missing required field" })
  }
};

// Ping Handler
handlers.ping = (data, cb) => {
  cb(200);
};

// Not found handler
handlers.notFound = (data, cb) => {
  cb(404);
};

module.exports = handlers;
