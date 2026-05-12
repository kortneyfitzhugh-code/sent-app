import { Resend } from "resend";

// Lazy so missing key only blows up at send time, not at module load — keeps
// the dev experience usable without RESEND_API_KEY in .env.local.
let _resend: Resend | null = null;
function client(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not configured");
  _resend = new Resend(key);
  return _resend;
}

export function getFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Sent <team@sentapp.io>";
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://sentapp.io";
}

export type SendResult = { ok: true; id: string } | { ok: false; error: string };

export async function sendEmail(args: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  try {
    const { data, error } = await client().emails.send({
      from: getFromAddress(),
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.replyTo ? { replyTo: args.replyTo } : {}),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, id: data?.id ?? "" };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Team invite email. Same Fire & Night palette and Bebas wordmark used in the
// Supabase confirm-signup template — see supabase/templates/confirm-signup.html.
export function teamInviteEmail(args: {
  inviterName: string;
  teamName: string;
  inviteUrl: string;
}): { subject: string; html: string } {
  const { inviterName, teamName, inviteUrl } = args;
  const subject = `${inviterName} invited you to ${teamName} · Sent`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#0D0D0D;color:#F0ECE4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0D0D0D;padding:40px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;background:#141414;border:1px solid #1E1E1E;border-radius:14px;padding:40px 32px;">

          <tr><td style="padding-bottom:8px;">
            <span style="font-family:'Bebas Neue',Impact,sans-serif;font-size:32px;letter-spacing:0.28em;color:#F0ECE4;text-transform:uppercase;">SENT</span>
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#E85A1E;margin-left:6px;vertical-align:middle;"></span>
          </td></tr>
          <tr><td style="padding-bottom:36px;">
            <span style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6A6A6A;">Born in prayer. Built for purpose.</span>
          </td></tr>

          <tr><td>
            <h1 style="font-family:'Bebas Neue',Impact,sans-serif;font-weight:400;font-size:36px;line-height:1.05;letter-spacing:0.04em;margin:0 0 16px;color:#F0ECE4;text-transform:uppercase;">
              You have been invited.
            </h1>
          </td></tr>

          <tr><td style="padding-bottom:24px;">
            <p style="font-size:15px;line-height:1.6;color:#F0ECE4;margin:0;">
              <strong style="color:#F0ECE4;">${escapeHtml(inviterName)}</strong> has invited you to join the team for <strong style="color:#F0ECE4;">${escapeHtml(teamName)}</strong> on Sent.
            </p>
          </td></tr>

          <tr><td style="padding-bottom:24px;">
            <p style="font-size:14px;line-height:1.6;color:#6A6A6A;margin:0;">
              Sent is an apostolic church-planting and ministry-formation companion. Joining the team means you can be assigned tasks from the planter's modules and walk this season with them.
            </p>
          </td></tr>

          <tr><td style="padding-bottom:28px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td bgcolor="#E85A1E" style="border-radius:6px;">
                <a href="${escapeHtmlAttr(inviteUrl)}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#F0ECE4;text-decoration:none;font-weight:600;">
                  Accept invitation →
                </a>
              </td>
            </tr></table>
          </td></tr>

          <tr><td style="padding-bottom:32px;">
            <p style="font-size:12px;line-height:1.6;color:#6A6A6A;margin:0;">
              Or paste this link into your browser:<br />
              <a href="${escapeHtmlAttr(inviteUrl)}" style="color:#F0ECE4;word-break:break-all;text-decoration:underline;">${escapeHtml(inviteUrl)}</a>
            </p>
          </td></tr>

          <tr><td style="border-top:1px solid #1E1E1E;padding-top:24px;">
            <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6A6A6A;margin:0 0 8px;">Nehemiah 2:18</p>
            <p style="font-style:italic;font-size:13px;line-height:1.6;color:#F0ECE4;margin:0;">
              "They said, 'Let us rise up and build.' So they strengthened their hands for this good work."
            </p>
          </td></tr>

          <tr><td style="padding-top:32px;">
            <p style="font-size:11px;line-height:1.6;color:#6A6A6A;margin:0;">
              This invitation expires in 14 days. If you didn't expect it, ignore this email — nothing was provisioned for you.
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  return { subject, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeHtmlAttr(s: string): string {
  return escapeHtml(s);
}
