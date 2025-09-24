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
      from: 'noreply@tarihotsauce.com',
      to: [contactEmail],
      subject: 'Your Rebate Request Has Been Submitted!',
      html: `
        <h1>Tari Hot Sauce</h1>
        <p>Hi,</p>
        <p>Thank you for purchasing a Tari product and for uploading your invoice. We've received your submission and started processing your rebate.</p>
        <p>You can expect your rebate to arrive within 24–48 hours. If you have any questions in the meantime, just reply to this email and we'll be happy to help.</p>
        <p>Warmly,<br>The Tari Team</p>
      `
    }

    console.log('📧 Attempting to send email with data:', emailData)
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    console.log('📧 Resend API response status:', response.status)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Email sent successfully:', result)
      return res.status(200).json({ success: true, message: 'Email sent successfully' })
    } else {
      const error = await response.text()
      console.error('❌ Email sending failed:', error)
      console.error('❌ Response status:', response.status)
      return res.status(500).json({ error: `Failed to send email: ${error}` })
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
