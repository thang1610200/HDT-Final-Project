const mongoose = require("mongoose");
const {v4: uuidv4} = require("uuid");
const random = require("randomstring");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("module-alias/register");
const fs = require("fs");
const {client} = require("@common/Redis");

const user = new mongoose.Schema({
    id: String,
    fullname: String,
    email: String,
    phone: String,
    isEmailActive: {type: Boolean, default: false},
    isPhoneActive: {type: Boolean, default: false},
    status: {type: Boolean, default: false},
    password: String,
    role: {type: String, default: 'User'},
    address: String,
    avatar: {type: String, default: "1odDXJgjRfaKMdnPY84OyOu4DU-UJ49j3"},
    email_code: String,
    phone_code: String,
    createAt: Date,
    updateAt: Date
})

user.pre('save',function() {
    const salts = bcrypt.genSaltSync(10);
    this.id = uuidv4()
    this.password = bcrypt.hashSync(this.password,salts);
    this.email_code = random.generate(25);
    this.phone_code = random.generate(25);
    this.createAt = new Date();
    this.updateAt = new Date();
})

user.methods.ComparePass = function(plaintext){
    return bcrypt.compareSync(plaintext, this.password);
}

user.methods.GenerateAccessToken = function(){
    return new Promise( (resolve, reject) => {
        const option = {
            expiresIn : '24h',
            algorithm: 'RS256'
        }
        const private_key = fs.readFileSync('./src/api/v1/keys/privatekey.pem');
        jwt.sign({id: this.id, role: this.role},private_key ,option, (err,token) => {
            if(err) reject(err);
            client.set(this.id,token,'EX',24 * 60 * 60, (err, reply) => {
                if(err) reject(err);
                resolve(token);
            })
        })
    });
}

module.exports = mongoose.model("User",user);