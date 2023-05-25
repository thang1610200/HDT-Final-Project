require("module-alias/register");
const configVNP = require("@config/vnpay.config");
const {format} = require('date-fns');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    checkout: (req,res,order) => {
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        let tmnCode = configVNP.vnp_TmnCode
        let secretKey = configVNP.vnp_HashSecret;
        let vnpUrl = configVNP.vnp_Url
        let returnUrl = configVNP.vnp_ReturnUrl
    
        let date = new Date();
    
        let createDate = `${format(date, 'yyyyMMddHHmmss')}`;
        let orderId = `${format(date, 'HHmmss')}`
        let amount = order.Total;
        let bankCode = '';
        let orderInfo = "Thanh toan";
        let orderType = '230001';
        let locale = '';
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });  
        let crypto = require("crypto");  
        let hmac = crypto.createHmac('sha512',secretKey);
       let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
       vnp_Params['vnp_SecureHash'] = signed;
       vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
       return res.json({statusCode: 200, vnpUrl});
    },
    sortObject: sortObject
}