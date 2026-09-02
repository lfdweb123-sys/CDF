import "server-only";

// Thin abstraction over the Brevo (Sendinblue) transactional email API.
// Requires BREVO_API_KEY, BREVO_SENDER_EMAIL and BREVO_SENDER_NAME env vars.
// Nothing else in the codebase should call the Brevo REST API directly —
// swapping providers later only means editing this file.

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
}

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export async function sendTransactionalEmail(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "CDF — Cabinet de Contrôle Opérationnel";

  if (!apiKey || !senderEmail) {
    // In local/dev environments without Brevo configured, log instead of failing
    // the caller's request (e.g. a form submission must still succeed).
    console.warn(
      "[brevo] BREVO_API_KEY / BREVO_SENDER_EMAIL missing — email not sent:",
      params.subject
    );
    return;
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      replyTo: params.replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[brevo] send failed", res.status, body);
  }
}

export function baseEmailTemplate(opts: { title: string; bodyHtml: string }): string {
  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#10172a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #dee2e8;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:#0b1526;padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:0.04em;">CDF</span>
                <div style="color:#bcd0e2;font-size:12px;margin-top:2px;">Cabinet de Contrôle Opérationnel &amp; Prévention des Pertes</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <h1 style="font-size:18px;margin:0 0 16px;color:#0b1526;">${opts.title}</h1>
                <div style="font-size:14px;line-height:1.6;color:#3a4453;">${opts.bodyHtml}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#f8f9fb;border-top:1px solid #dee2e8;">
                <div style="font-size:12px;color:#71798a;">CDF — « Vous ne pouvez pas être partout. Nous vérifions pour vous. »</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
