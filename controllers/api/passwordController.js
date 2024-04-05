// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Common Response
const { response } = require('../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { User } = require('../../models/User');

const store = async (req, res) => {
  try {
    const validator = new Validator(req.body, {
      currentPassword: 'required',
      password: 'required|same:confirmPassword',
      confirmPassword: 'required|same:password'
    });
    const matched = await validator.check();
    if (!matched) {
      return response(res, validator.errors, 'validation', 422);
    }

    let errors = {};
    const { id } = req.user;
    const {
      currentPassword,
      password
    } = req.body;

    const user = await User.findOne({
      where: {
        [Op.and]: [
          { role: { [Op.ne]: 'admin' } },
          { status: { [Op.eq]: 'active' } },
          { id: { [Op.eq]: id } }
        ]
      }
    });
    if (!user) {
      return response(res, req.body, 'User not found.', 404);
    }

    if (!(await bcrypt.compare(currentPassword, user?.password))) {
      errors['currentPassword'] = {
        message: 'Current password mismatched.',
        rule: 'same'
      };
    }

    if (Object.keys(errors).length) {
      return response(res, errors, 'validation', 422);
    }

    user.password = bcrypt.hashSync(password, salt); // generate a hash
    await user.save();

    // Mail
    const subject = 'Password changed successfully.';
    const content = `<div>
      <p>Your password has been changed successfully.</p>
      <p>Password: ${password}</p>
      <p>You can also use your registered email & mobile as username.</p>
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

    return response(res, user, 'User change password successfull.', 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
}

module.exports = {
  store
};