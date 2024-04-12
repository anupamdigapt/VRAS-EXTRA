// Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../config/mailer');
const ejs = require('ejs');

const sendEmail = async (req, res) => {
    try {
        const validator = new Validator(req.body, {
            name: 'required',
            mobile: 'required|digits:10',
            email: 'required|email',
            message: 'required'
        });
        const matched = await validator.check();
        if (!matched) {
            return response(res, validator.errors, 'validation', 422);
        }

        let errors = {};
        const {
            name,
            mobile,
            email,
            message
        } = req.body;

        if (Object.keys(errors).length) {
            return response(res, errors, 'validation', 422);
        }

        // Mail
        const subject = 'Contact Email.';
        const content = `<div>
            <p>Name: ${name}</p>
            <p>Mobile: ${mobile}</p>
            <p>Email: ${email}</p>
            <p>Message: </p>
            <p>${message}</p>
        </div>`;
        const emailContent = await ejs.renderFile(emailTemplatePath, {
            user: 'Super Admin',
            title: subject,
            content: content
        });
        const mailOptions = {
            ...mailOption,
            subject: subject,
            html: emailContent
        };
        await transporter.sendMail(mailOptions);

        return response(res, req.body, 'Contact mail has been sent.', 200);
    } catch (error) {
        return response(res, req.body, error.message, 500);
    }
}

module.exports = {
    sendEmail
};
