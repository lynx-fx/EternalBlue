const transport = require("./sendMail.js");

const EMAIL_STYLE = `
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #0F172A;
  background-color: #F8FDF9;
  padding: 40px 20px;
`;

const CARD_STYLE = `
  max-width: 560px;
  margin: 0 auto;
  background: #ffffff;
  padding: 48px;
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(5, 150, 105, 0.05);
  border: 1px solid #E2E8F0;
`;

const BUTTON_STYLE = `
  background-color: #059669;
  color: #ffffff;
  text-decoration: none;
  padding: 16px 32px;
  border-radius: 16px;
  display: inline-block;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

exports.welcomeMail = async (userName, email, verificationLink) => {
  let mail = await transport.sendMail({
    from: `"VoyageAI Intelligence" <${process.env.EMAIL}>`,
    to: email,
    subject: "Welcome to your next adventure - VoyageAI",
    html: `
    <div style="${EMAIL_STYLE}">
      <div style="${CARD_STYLE}"> 
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="background: #059669; width: 48px; hieght: 48px; border-radius: 12px; display: inline-block; padding: 10px;">
             <img src="https://img.icons8.com/ios-filled/50/ffffff/compass.png" width="28" height="28" style="display: block; margin: 0 auto;"/>
          </div>
          <h1 style="color: #064E3B; font-size: 24px; font-weight: 800; margin-top: 16px; text-transform: uppercase; letter-spacing: -0.02em;">VoyageAI</h1>
        </div>
        
        <h2 style="color: #0F172A; text-align: center; font-size: 20px; font-weight: 800; margin-bottom: 24px;">WELCOME TO THE FUTURE OF TRAVEL</h2>
        <p>Hi ${userName},</p>
        <p>Your passport to a smarter way of exploring the world is almost ready. We've synchronized our global databases with your new profile.</p>
        <p>Please verify your destination email to unlock your personal travel advisor and real-time safety matrix.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationLink}" style="${BUTTON_STYLE}">
             Initialize Verification
          </a>
        </div>
        
        <p style="font-size: 13px; color: #64748B;">If you did not execute this registration, please ignore this transmission.</p>
        <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 32px 0;">
        <p style="color: #94A3B8; font-size: 11px; text-align: center; font-weight: bold; letter-spacing: 0.05em;">&copy; ${new Date().getFullYear()} VOYAGEAI CORE SYSTEMS. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  `,
  });

  if (mail.accepted.length <= 0) {
    console.log("Signup mail not sent.");
  }

  return mail;
}

exports.forgotPasswordMail = async (email, link) => {
  let mail = await transport.sendMail({
    from: `"VoyageAI Security" <${process.env.EMAIL}>`,
    to: email,
    subject: "Security Alert: Password Reset Request - VoyageAI",
    html: `
        <div style="${EMAIL_STYLE}">
          <div style="${CARD_STYLE}"> 
            <div style="text-align: center; margin-bottom: 32px;">
               <div style="background: #0F172A; width: 48px; hieght: 48px; border-radius: 12px; display: inline-block; padding: 10px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/key.png" width="28" height="28" style="display: block; margin: 0 auto;"/>
               </div>
               <h1 style="color: #0F172A; font-size: 24px; font-weight: 800; margin-top: 16px; text-transform: uppercase; letter-spacing: -0.02em;">VoyageAI</h1>
            </div>

            <h2 style="color: #0F172A; text-align: center; font-size: 20px; font-weight: 800; margin-bottom: 24px;">SECURITY TOKEN ISSUED</h2>
            <p>We received a request to update the digital access signature for your VoyageAI account.</p>
            <p>Use the secure link below to reset your credentials. This token will remain active for <strong>10 minutes</strong> before self-destructing.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${link}" style="${BUTTON_STYLE}">
                 Authorize Reset
              </a>
            </div>
            
            <p style="font-size: 13px; color: #64748B;">If you did not request this authorization, please secure your account immediately or ignore this message.</p>
            <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 32px 0;">
            <p style="color: #94A3B8; font-size: 11px; text-align: center; font-weight: bold; letter-spacing: 0.05em;">&copy; ${new Date().getFullYear()} VOYAGEAI SECURITY PROTOCOLS.</p>
          </div>
        </div>
      `,
  });

  if (mail.accepted.length <= 0) {
    console.log("Forgot password mail not sent.");
  }

  return mail;
}

exports.verifyEmailMail = async (userName, email, verificationLink) => {
  let mail = await transport.sendMail({
    from: `"VoyageAI Intelligence" <${process.env.EMAIL}>`,
    to: email,
    subject: "Action Required: Verify Your Identity - VoyageAI",
    html: `
        <div style="${EMAIL_STYLE}">
          <div style="${CARD_STYLE}"> 
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="background: #059669; width: 48px; hieght: 48px; border-radius: 12px; display: inline-block; padding: 10px;">
                 <img src="https://img.icons8.com/ios-filled/50/ffffff/shield.png" width="28" height="28" style="display: block; margin: 0 auto;"/>
              </div>
              <h1 style="color: #064E3B; font-size: 24px; font-weight: 800; margin-top: 16px; text-transform: uppercase; letter-spacing: -0.02em;">VoyageAI</h1>
            </div>

            <h2 style="color: #0F172A; text-align: center; font-size: 20px; font-weight: 800; margin-bottom: 24px;">IDENTITY VERIFICATION</h2>
            <p>Hi ${userName},</p>
            <p>To ensure total synchronization with our global intelligence network, please confirm your email address.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationLink}" style="${BUTTON_STYLE}">
                 Verify Status
              </a>
            </div>
            
            <p style="font-size: 13px; color: #64748B;">Once verified, your advisory dashboard will be fully operational.</p>
            <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 32px 0;">
            <p style="color: #94A3B8; font-size: 11px; text-align: center; font-weight: bold; letter-spacing: 0.05em;">&copy; ${new Date().getFullYear()} VOYAGEAI CORE SYSTEMS.</p>
          </div>
        </div>
      `,
  });

  if (mail.accepted.length <= 0) {
    console.log("Verification mail not sent.");
  }

  return mail;
}