export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { contactEmail, contactName, restaurantName } = req.body

    // Validate required fields
    if (!contactEmail || !contactName || !restaurantName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const emailData = {
      from: 'Tari Hot Sauce <noreply@tarihotsauce.com>',
      to: [contactEmail],
      subject: '🎉 Your Rebate Request Has Been Submitted!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #242ff8; font-size: 28px; margin-bottom: 10px;">Tari Hot Sauce</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 15px 0;">Hi,</p>
            <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">Thank you for purchasing a Tari product and for uploading your invoice. We've received your submission and started processing your rebate.</p>
            <p style="font-size: 16px; color: #555; margin: 0 0 15px 0;">You can expect your rebate to arrive within 24–48 hours. If you have any questions in the meantime, just reply to this email and we'll be happy to help.</p>
            <p style="font-size: 16px; color: #555; margin: 0;">Warmly,<br>The Tari Team</p>
          </div>
        </div>
      `
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer re_ctqSGDNA_NTfwYJrHRaAQxednbPdUG68k`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Email sent successfully:', result)
      return res.status(200).json({ success: true, message: 'Email sent successfully' })
    } else {
      const error = await response.text()
      console.error('❌ Email sending failed:', error)
      return res.status(500).json({ error: 'Failed to send email' })
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
