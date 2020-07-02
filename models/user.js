const mongoose = require("mongoose");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const csrf = require("csurf");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, auto: true},
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    }
});

const User = (module.exports = mongoose.model("User", UserSchema));

// TODO refresh -will be done by the middleware
// TODO along with blocklist


// getting user from refresh token (refresh token contains an id)
module.exports.getDataAndVerifyToken = function(refreshToken, callback){
    const decodedPayload = jwt.verify(refreshToken, 'secret');

    return decodedPayload;

}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByEmail = function(email, callback) {
    User.findOne(email, callback);
};

module.exports.registerUser = async function(newUser) {


    // TODO: REVISIT BEST WAY TO SALT PASSWORD
    let salt = bcrypt.genSalt(10, (err, result) => {
        //console.log(result);
    });
    //console.log(newUser.password);
    const password = newUser.password;


    const hash = await argon2.hash(newUser.password, { type: argon2.argon2id });

    newUser.password = hash;

    newUser = new User(newUser);
    newUser.save();

    return await this.loginUser(password, hash, newUser._id);
};

module.exports.loginUser = async function(candidatePassword, hash, _id) {
    const isVerified = await argon2.verify(hash, candidatePassword);
        if(isVerified){
            // generate access & refresh
            const accessToken = this.generateJwtAccessToken();
            const refreshToken = this.generateJwtRefreshToken(_id);

            const tokenArray = [
                {
                    accessToken
                },
                {
                    refreshToken
                }
            ];

            return tokenArray;
        }
        else{
            // deny access
            const err = new Error('access denied');
            throw err;
        }

};

module.exports.logoutUser = async function(callback) {
    // tell browser to clear tokens from storage
};

// ACCESS TOKEN
module.exports.generateJwtAccessToken = function() {
    return jwt.sign({
        // ACCESS POLICIES

    }, "MY_SECRET", {expiresIn: 900});
};

// REFRESH TOKEN
module.exports.generateJwtRefreshToken = function(_id) {
    return jwt.sign({
        // ID
        _id: _id
    }, "MY_SECRET", {expiresIn: 1209600});
};

// VAlIDATE ACCESS TOKEN
module.exports.validateJwtAccessToken = async function(token) {
    let result = false;
    if(!token){
        return result;
    }

    // TODO check block list
    console.log(token)
    const verdict = await jwt.verify(token, "MY_SECRET", function(err, decoded){
        if (err){
            // need to determine why it failed - block list, access policies, or invalid
            console.log(err);
            return result;
        }
        else{
            result = true;
            return result;
        }
    });

    return verdict;
};

// VALIDATE REFRESH TOKEN
module.exports.validateJwtRefreshToken = async function(token) {
    let result = false;
    if(!token){
        console.log('please sign in');
        return result;
    }

    // TODO check block list
    console.log(token)
    const verdict = await jwt.verify(token, "MY_SECRET", function(err, decoded){
        if (err){
            // need to determine why it failed
            console.log(err);
            console.log('please sign in');
            return result;
        }

        else {
            // update access token
            console.log('grant access');
            result = true;
            return result;
        }
    });

    return verdict;
};

