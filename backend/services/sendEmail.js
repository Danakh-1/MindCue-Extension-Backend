const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',

		auth: {
			user: 'danasallal33@gmail.com',
			pass: 'Asd@23kn',
		},
	});

	const mailOptions = {
		from: process.env.SMTP_USER,
		to: email,
		subject: subject,
		text: text,
	};

	try {
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.log(error);
	}
};

module.exports = sendEmail;
