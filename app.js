const express = require('express');
const { engine } = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser')


const dotenv = require('dotenv');
dotenv.config();


const app = express()

// App Engine Configuration

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Static Files

app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parsing

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Homepage

app.get('/', (req, res, next) => {
    res.render('home')
})

app.post('/send', (req, res) => {

    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

    // Nodemailer transporter
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.user,
            pass: process.env.pass
        },
        tis: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: 'mertadev@hotmail.com', // sender address
        to: ['mertarinci96@gmail.com', 'gulayabvi@gmail.com'], // list of receivers
        subject: "Mert's Emailer Test Mail", // Subject line
        text: 'I am a test email, ignore me! (Seni cok seviyorum guzel esim.)', // plain text body
        html: output // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            res.render('home', { msg: 'There is an error sending your email.' })
            console.log(err)
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.render('home', { msg: 'Email has been sent' });
    });

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})