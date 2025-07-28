import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const sendEmail = async (options: MailOptions) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY is not set. Skipping email send.');
    // In development, you might want to log the email to the console instead
    console.log('--- Email to be sent ---');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log('------------------------');
    console.log(options.text);
    console.log('------------------------');
    return;
  }

  const msg = {
    ...options,
    from: 'support@justice-bot.com', // Use a verified sender email
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // It's often useful to see the full error response from SendGrid
    if ((error as any).response) {
      console.error((error as any).response.body)
    }
  }
};

export const sendWelcomeEmail = async (email: string, name: string | null) => {
    const subject = 'Welcome to JusticeBot.AI!';
    const text = `Hi ${name || 'there'},\n\nWelcome to JusticeBot.AI! We're excited to have you on board. You can now access all our tools to help you with your legal journey.\n\nThanks,\nThe JusticeBot.AI Team`;
    const html = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Welcome to JusticeBot.AI!</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Welcome to JusticeBot.AI! We're excited to have you on board. You can now access all our tools to help you with your legal journey.</p>
        <p>
          <a href="https://justice-bot.com/dashboard" style="background-color: #D8282D; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
            Go to Your Dashboard
          </a>
        </p>
        <p>Thanks,<br/>The JusticeBot.AI Team</p>
      </div>
    `;

    await sendEmail({ to: email, subject, text, html });
};
