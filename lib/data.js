const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data/')

// Create file
lib.create = (dir, file, data, cb) => {

    // Check if folder exists, if not create it
    lib.createDir(lib.baseDir + dir);
    
    // Write to a file and close it
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {

        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            cb(false)
                        } else {
                            cb('Error closing the file')
                        }
                    })
                } else {
                    cb('Error closing the file')
                }
            })
        } else {
            cb('Couldnt create the file, it might exist already')
        }
    })
};

// Create directory
lib.createDir = (dir) => {
    if (fs.existsSync(dir)) {
        return false;
    } else {
        fs.mkdir(dir, (err) => {
            if(err){
                return err;
            }
        });
    }
}


// Read file
lib.read = (dir, file, cb) => {

    fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        if (!err && data) {
            cb(false, helpers.parseJsonToObject(data));
        } else {
            cb(err, data);
        }
    });
}

// Update file
lib.update = (dir, file, data, cb) => {
    fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err) => {
                if (!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fs.close(fileDescriptor, () => {
                                if (!err) {
                                    cb(false)
                                } else {
                                    cb('Error closing the file')
                                }
                            })
                        } else {
                            cb('Error closing the file')
                        }
                    })
                } else {
                    cb("Error truncating the file")
                }
            })
        } else {
            return cb("Couldnt open the file for updating, it may not exist yet")
        }
    });
}

lib.delete = (dir, file, cb) => {
    //Unlink

    fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            cb(false)
        } else {
            cb('Error deleting the file')
        }
    })
}

module.exports = lib;