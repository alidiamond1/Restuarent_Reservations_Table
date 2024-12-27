const { MailSlurp } = require('mailslurp-client');

const sendEmail = async (options) => {
  // Create a MailSlurp client
  const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

  try {
    // Create an inbox
    const { id: inboxId, emailAddress } = await mailslurp.createInbox();

    // Send the email
    await mailslurp.sendEmail(inboxId, {
      to: [options.email],
      subject: options.subject,
      body: options.message,
    });

    console.log(`Email sent to ${options.email} from ${emailAddress}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;