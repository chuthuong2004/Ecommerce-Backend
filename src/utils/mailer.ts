import nodemailer, { SendMailOptions } from "nodemailer";
import config from "../config/default";
import log from "../logger";

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const smtp = config.smtp;

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});
export interface IPayloadMailer {
  email: string;
  subject: string;
  message: string;
}
async function sendEmail(payload: IPayloadMailer) {
  const mailOptions: SendMailOptions = {
    from: smtp.user,
    to: payload.email,
    subject: payload.subject,
    html: payload.message,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      log.error(err, "Error sending email");
      return;
    }
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
