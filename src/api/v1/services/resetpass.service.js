const {client} = require("@common/Redis");

module.exports = {
    findEmail: (email) => {
        return new Promise((resolve, reject) => {
            client.get(email, async (err, reply) => {
                if(err) reject(err)
                resolve(reply);
            });
        })
    },
    delEmail: (email) => {
        return new Promise((resolve, reject) => {
            client.del(email, async (err, reply) => {
                if(err) reject(err)
                resolve(reply);
            });
        })
    }
}