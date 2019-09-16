/*
* @Author: mac
* @Date:   2019-08-02 11:34:28
* @Last Modified by:   mac
* @Last Modified time: 2019-08-02 11:34:36
*/
const crypto = require('crypto')
module.exports = (str)=>{
    const hmac = crypto.createHmac('sha512','Yang')
    hmac.update(str)
    return hmac.digest('hex')
}