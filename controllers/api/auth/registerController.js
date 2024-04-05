// Validator
const { Validator } = require('node-input-validator');

// Bcrypt for hash password
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10); // generate a salt

// Custom Helper
const { formatedDateTime, formatedDate, futureDate } = require('../../../helpers/custom');

// Common Response
const { response } = require('../../../config/response');

// Mailer
const { transporter, emailTemplatePath, mailOption } = require('../../../config/mailer');
const ejs = require('ejs');

// Model
const { Op } = require('sequelize');
const { Client } = require('../../../models/Client');
const { Subscription } = require('../../../models/Subscription');
const { User } = require('../../../models/User');

const register = async (req, res) => {
  try {
    const validator = new Validator(req.body, {
      subscriptionId: 'required',
      numberOfUsers: 'required|numeric',
      slug: 'required',
      name: 'required',
      mobile: 'required|digits:10',
      email: 'required|email',
      username: 'required',
      password: 'required|same:confirmPassword',
      confirmPassword: 'required|same:password'
    });
    const matched = await validator.check();
    if (!matched) {
      return response(res, validator.errors, 'validation', 422);
    }

    let errors = {};
    const {
      subscriptionId,
      numberOfUsers,
      slug,
      name,
      mobile,
      email,
      username,
      password,
      dateOfBirth,
      gender,
      primaryHand,
      address,
      city,
      country,
      postalCode,
      emergencyContactName,
      emergencyContactPhone,
      medicalConditions,
      allergies,
      startAt,
    } = req.body;

    const slugCount = await Client.count({
      where: {
        slug: { [Op.eq]: slug }
      }
    });
    if (slugCount > 0) {
      errors['slug'] = {
        message: 'The slug already exists.',
        rule: 'unique'
      };
    }

    const nameCount = await Client.count({
      where: {
        name: { [Op.eq]: name }
      }
    });
    if (nameCount > 0) {
      errors['name'] = {
        message: 'The name already exists.',
        rule: 'unique'
      };
    }

    const usernameCount = await User.count({
      where: {
        [Op.and]: [
          { role: { [Op.ne]: 'admin' } },
          { status: { [Op.eq]: 'active' } },
          { username: { [Op.eq]: username } }
        ]
      }
    });
    if (usernameCount > 0) {
      errors['username'] = {
        message: 'The username already exists.',
        rule: 'unique'
      };
    }

    const emailCount = await Client.count({
      where: {
        email: { [Op.eq]: email }
      }
    });
    const userEmailCount = await User.count({
      where: {
        [Op.and]: [
          { role: { [Op.ne]: 'admin' } },
          { status: { [Op.eq]: 'active' } },
          { email: { [Op.eq]: email } }
        ]
      }
    });
    if (emailCount > 0 || userEmailCount > 0) {
      errors['email'] = {
        message: 'The email already exists.',
        rule: 'unique'
      };
    }

    const mobileCount = await Client.count({
      where: {
        mobile: { [Op.eq]: mobile }
      }
    });
    const userMobileCount = await User.count({
      where: {
        [Op.and]: [
          { role: { [Op.ne]: 'admin' } },
          { status: { [Op.eq]: 'active' } },
          { mobile: { [Op.eq]: mobile } }
        ]
      }
    });
    if (mobileCount > 0 || userMobileCount > 0) {
      errors['mobile'] = {
        message: 'The mobile already exists.',
        rule: 'unique'
      };
    }

    if (Object.keys(errors).length) {
      return response(res, errors, 'validation', 422);
    }

    const subscription = await Subscription.findOne({
      where: {
        id: { [Op.eq]: subscriptionId }
      }
    });

    const client = new Client();
    client.subscriptionId = subscriptionId;
    client.numberOfUsers = subscription?.numberOfUsers || numberOfUsers;
    client.slug = slug;
    client.name = name;
    client.email = email;
    client.mobile = mobile;
    if (address) {
      client.address = address;
    }
    if (city) {
      client.city = city;
    }
    if (country) {
      client.country = country;
    }
    if (postalCode) {
      client.postalCode = postalCode;
    }
    if (startAt) {
      client.startAt = formatedDate(startAt);
      client.endAt = futureDate(startAt, subscription?.numberOfDays || 1);
    }
    client.payStatus = 'initiate';
    client.status = 'inactive';
    await client.save();

    const user = new User();
    if (client?.id) {
      user.clientId = client?.id;
    }
    user.name = name;
    user.mobile = mobile;
    user.email = email;
    user.username = username;
    user.password = bcrypt.hashSync(password, salt); // generate a hash
    user.role = 'client';
    if (dateOfBirth) {
      user.dateOfBirth = formatedDate(dateOfBirth);
    }
    if (gender) {
      user.gender = gender;
    }
    if (primaryHand) {
      user.primaryHand = primaryHand;
    }
    if (address) {
      user.address = address;
    }
    if (city) {
      user.city = city;
    }
    if (country) {
      user.country = country;
    }
    if (postalCode) {
      user.postalCode = postalCode;
    }
    if (emergencyContactName) {
      user.emergencyContactName = emergencyContactName;
    }
    if (emergencyContactPhone) {
      user.emergencyContactPhone = emergencyContactPhone;
    }
    if (medicalConditions) {
      user.medicalConditions = medicalConditions;
    }
    if (allergies) {
      user.allergies = allergies;
    }
    user.status = 'inactive';
    await user.save();

    // Mail
    const subject = 'Registration Successful.';
    const content = `<div>
      <p>Congratulations! your profile has been registered successfully.</p>
      <p>Username: ${user?.username}</p>
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

    return response(res, client, 'Client register successfull.', 200);
  } catch (error) {
    return response(res, req.body, error.message, 500);
  }
}

module.exports = {
  register
};