import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import log from "../logger";

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});
interface PayloadMailer {
  email: string;
  subject: string;
  message: string;
}
async function sendEmail(payload: PayloadMailer) {
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
