import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

interface ReportData {
  reportId: string
  damageType: string
  severity: string
  latitude: number
  longitude: number
  submittedAt: string
}

export async function sendAgencyNotification(
  report: ReportData,
  agencyEmail: string
) {
  const severityColor =
    report.severity === 'high'
      ? '#e74c3c'
      : report.severity === 'medium'
      ? '#f39c12'
      : '#27ae60'

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: agencyEmail,
    subject: `[RoadWatch] New ${report.severity.toUpperCase()} severity road damage report`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a5276;padding:20px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">🚧 New Road Damage Report</h2>
        </div>
        <div style="padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px">
          <p>A new road damage report has been submitted and requires your attention.</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;font-weight:bold;background:#f4f4f4;width:140px">Report ID</td><td style="padding:8px">${report.reportId}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;background:#f4f4f4">Damage Type</td><td style="padding:8px">${report.damageType.replace(/_/g, ' ')}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;background:#f4f4f4">Severity</td>
              <td style="padding:8px"><span style="background:${severityColor};color:white;padding:3px 10px;border-radius:20px;font-size:12px">${report.severity.toUpperCase()}</span></td>
            </tr>
            <tr><td style="padding:8px;font-weight:bold;background:#f4f4f4">Location</td><td style="padding:8px">${report.latitude.toFixed(4)}° N, ${report.longitude.toFixed(4)}° E</td></tr>
            <tr><td style="padding:8px;font-weight:bold;background:#f4f4f4">Submitted</td><td style="padding:8px">${new Date(report.submittedAt).toLocaleString()}</td></tr>
          </table>
          <div style="margin-top:20px;text-align:center">
            <a href="${process.env.NEXTAUTH_URL}/admin/reports/${report.reportId}"
               style="background:#1a5276;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
              View Report in Dashboard →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

export async function sendCitizenUpdate(
  citizenEmail: string,
  reportId: string,
  newStatus: string
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: citizenEmail,
    subject: `[RoadWatch] Your report ${reportId} has been updated`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1a5276;padding:20px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">📋 Report Status Updated</h2>
        </div>
        <div style="padding:24px;border:1px solid #ddd;border-top:none;border-radius:0 0 8px 8px">
          <p>Your road damage report <strong>${reportId}</strong> has been updated.</p>
          <p>New status: <strong style="color:#1a5276">${newStatus.replace(/_/g, ' ').toUpperCase()}</strong></p>
          <p>Thank you for contributing to safer roads in Nigeria.</p>
          <p style="color:#888;font-size:12px">— RoadWatch Nigeria</p>
        </div>
      </div>
    `,
  })
}
