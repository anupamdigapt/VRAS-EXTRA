 // Validator
const { Validator } = require('node-input-validator');

// Common Response
const { response } = require('../../../../../config/response');

const crypto = require('crypto');
const generateUniqueCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { User } = require('../../../../../models/User');

const forgotPassword = async (req, res) => {
  try {
    const validator = new Validator(req.body, {
      email: 'required|email'
    });
    const matched = await validator.check();
    if (!matched) {
      return response(res, validator.errors, 'validation', 422);
    }

    let errors = {};
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        [Op.and]: [
          { role: { [Op.eq]: 'admin' } },
          { status: { [Op.eq]: 'active' } },
          { email: { [Op.eq]: email } }
        ]
      }
    });
    if (!user) {
      errors['email'] = {
        message: 'The email doesn\'t exists.',
        rule: 'same'
      };
    }

    if (Object.keys(errors).length) {
      return response(res, errors, 'validation', 422);
    }

    user.resetCode = generateUniqueCode();
    user.resetExpiries = new Date(Date.now() + 1 * 60 * 60 * 1000); // Expired in 1 hour;
    await user.save();

    // FrontEnd BaseUrl
    const baseUrl = req.get('Origin') || req.get('Referer') || 'http://vras.co.il:5050';

    // Mail
    const subject = 'Reset Password Link.';
    const content = `<div>
      <p><a href="${baseUrl}/admin/reset-password/${user.resetCode}">Click here</a> to reset your password.</p>
      <p>Alternatively, you can use the bellow code to reset the password.</p>
      <p>Code: ${user.resetCode}</p>
      <p>N.B.: This link/code will expired after 1 hour.</p>
    </div>`;
    const emailContent = await ejs.renderFile(emailTemplatePath, {
      user: user?.name,
      title: subject,
      content: content
    });
    const mailOptions = {
      ...mailOption,
      to: user?.email,
      subject: subject,
      html: emailContent
    };
    await transporter.sendMail(mailOptions);

    return response(res, user, 'Admin reset password mail has been sent.', 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
}

module.exports = {
  forgotPassword
};