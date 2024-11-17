const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth:{
        user: "quezera20@gmail.com",
        pass: process.env.PASSW
    }
});

const mailOption = {
    from: '"MyApp" <no-reply@yourdomain.com>',
    to: '',
    subject: 'AKUN ADA TELAH DIHECK',
    // text: 'KIRIMKAN BITCOIN KE NOMOR DIBAWAH\n080808080808\nUNTUK FOLDER KERJA ANDA TIDAK KAMI SEBAR!'
    // html: '<b> Test Node Mailer </b>'
}

transport.sendMail(mailOption, (err, info) => {
    if (err) {
        console.log(err, '-> An Error Mate');
    } else{
        console.log(info.response, '-> this is an info');
    }
});

module.exports = transport;