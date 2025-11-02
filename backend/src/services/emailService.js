// Email service using Resend
// To use this service, install resend: npm install resend
// Set RESEND_API_KEY in your .env file
// Get your API key from https://resend.com

let Resend;
try {
  Resend = require('resend').Resend;
} catch (error) {
  console.warn('⚠️  Resend package not installed. Email notifications will be logged only.');
  console.warn('   Install with: npm install resend');
}

class EmailService {
  constructor() {
    this.resend = null;
    this.fromEmail = process.env.EMAIL_FROM || 'CareerCraft <noreply@careercraft.ai>';

    if (Resend && process.env.RESEND_API_KEY) {
      this.resend = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Email service initialized with Resend');
    } else {
      console.warn('⚠️  Email service running in development mode (emails will be logged, not sent)');
      console.warn('   Set RESEND_API_KEY in .env to enable email sending');
    }
  }

  async sendEmail({ to, subject, html, text }) {
    try {
      if (this.resend) {
        // Production: Send actual email
        const result = await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject,
          html,
          text
        });

        console.log(`📧 Email sent to ${to}: ${subject}`);
        return { success: true, messageId: result.id };
      } else {
        // Development: Log email
        console.log('\n📧 [DEV MODE] Email would be sent:');
        console.log(`   To: ${to}`);
        console.log(`   Subject: ${subject}`);
        console.log(`   Text: ${text?.substring(0, 100)}...`);
        console.log('');
        return { success: true, messageId: 'dev-mode-' + Date.now() };
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
      throw error;
    }
  }

  // Feedback notification emails
  async sendFeedbackSubmissionConfirmation(email, feedbackData) {
    const subject = 'Feedback Received - Thank You!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; margin: 5px; }
            .badge-${feedbackData.type} { background: #dbeafe; color: #1e40af; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Feedback Received!</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Thank you for taking the time to share your feedback with us. We've received your submission and our team will review it shortly.</p>

              <h3>Your Feedback Details:</h3>
              <p><strong>Subject:</strong> ${feedbackData.subject}</p>
              <p><strong>Type:</strong> <span class="badge badge-${feedbackData.type}">${feedbackData.type.replace('_', ' ')}</span></p>
              <p><strong>Status:</strong> <span class="badge">${feedbackData.status}</span></p>
              <p><strong>Submitted:</strong> ${new Date(feedbackData.createdAt).toLocaleDateString()}</p>

              <p>We typically respond within 1-2 business days. You'll receive an email notification when our team responds to your feedback.</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-feedback" class="button">View Your Feedback</a>

              <p>If you have any urgent concerns, please don't hesitate to reach out to us directly at support@careercraft.ai</p>
            </div>
            <div class="footer">
              <p>CareerCraft AI - Your Career Companion</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Feedback Received - Thank You!

Hi there,

Thank you for taking the time to share your feedback with us. We've received your submission and our team will review it shortly.

Your Feedback Details:
- Subject: ${feedbackData.subject}
- Type: ${feedbackData.type.replace('_', ' ')}
- Status: ${feedbackData.status}
- Submitted: ${new Date(feedbackData.createdAt).toLocaleDateString()}

We typically respond within 1-2 business days. You'll receive an email notification when our team responds to your feedback.

View your feedback at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-feedback

If you have any urgent concerns, please reach out to support@careercraft.ai

CareerCraft AI - Your Career Companion
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendFeedbackResponseNotification(email, feedbackData, response) {
    const subject = `Response to Your Feedback: ${feedbackData.subject}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .response-box { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We've Responded to Your Feedback!</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Our team has responded to your feedback submission. Here are the details:</p>

              <h3>Your Original Feedback:</h3>
              <p><strong>Subject:</strong> ${feedbackData.subject}</p>
              <p>${feedbackData.message}</p>

              <div class="response-box">
                <h3>Our Response:</h3>
                <p>${response.message}</p>
                <p style="color: #666; font-size: 12px; margin-top: 10px;">
                  - ${response.adminEmail} | ${new Date(response.timestamp).toLocaleString()}
                </p>
              </div>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-feedback" class="button">View Full Conversation</a>

              <p>Thank you for helping us improve CareerCraft!</p>
            </div>
            <div class="footer">
              <p>CareerCraft AI - Your Career Companion</p>
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
We've Responded to Your Feedback!

Hi there,

Our team has responded to your feedback submission.

Your Original Feedback:
Subject: ${feedbackData.subject}
${feedbackData.message}

Our Response:
${response.message}
- ${response.adminEmail} | ${new Date(response.timestamp).toLocaleString()}

View the full conversation at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-feedback

Thank you for helping us improve CareerCraft!

CareerCraft AI - Your Career Companion
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendFeedbackAdminNotification(feedbackData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@careercraft.ai';
    const subject = `New Feedback: ${feedbackData.subject}`;

    const priorityEmoji = {
      critical: '🚨',
      high: '⚠️',
      medium: '📢',
      low: '📝'
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1f2937; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; margin: 5px; }
            .priority-${feedbackData.priority} { background: ${feedbackData.priority === 'critical' ? '#fee2e2' : feedbackData.priority === 'high' ? '#fef3c7' : '#dbeafe'}; color: ${feedbackData.priority === 'critical' ? '#991b1b' : feedbackData.priority === 'high' ? '#92400e' : '#1e40af'}; }
            .button { display: inline-block; padding: 12px 24px; background: #1f2937; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${priorityEmoji[feedbackData.priority] || '📝'} New Feedback Received</h2>
            </div>
            <div class="content">
              <p><strong>Subject:</strong> ${feedbackData.subject}</p>
              <p><strong>Type:</strong> <span class="badge">${feedbackData.type.replace('_', ' ')}</span></p>
              <p><strong>Priority:</strong> <span class="badge priority-${feedbackData.priority}">${feedbackData.priority}</span></p>
              <p><strong>From:</strong> ${feedbackData.email || 'Anonymous'}</p>
              <p><strong>Category:</strong> ${feedbackData.category}</p>
              ${feedbackData.rating ? `<p><strong>Rating:</strong> ${'⭐'.repeat(feedbackData.rating)}</p>` : ''}

              <h3>Message:</h3>
              <p>${feedbackData.message}</p>

              ${feedbackData.sentiment ? `
              <p><strong>Sentiment:</strong> ${feedbackData.sentiment.label} (Score: ${feedbackData.sentiment.score.toFixed(2)})</p>
              ` : ''}

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/feedback" class="button">View in Admin Panel</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
${priorityEmoji[feedbackData.priority] || '📝'} New Feedback Received

Subject: ${feedbackData.subject}
Type: ${feedbackData.type.replace('_', ' ')}
Priority: ${feedbackData.priority}
From: ${feedbackData.email || 'Anonymous'}
Category: ${feedbackData.category}
${feedbackData.rating ? `Rating: ${'⭐'.repeat(feedbackData.rating)}` : ''}

Message:
${feedbackData.message}

${feedbackData.sentiment ? `Sentiment: ${feedbackData.sentiment.label} (Score: ${feedbackData.sentiment.score.toFixed(2)})` : ''}

View in admin panel: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/feedback
    `;

    return this.sendEmail({ to: adminEmail, subject, html, text });
  }

  // Review notification emails
  async sendReviewApprovalNotification(email, reviewData) {
    const subject = 'Your Review Has Been Approved!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .stars { color: #fbbf24; font-size: 24px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Review Approved!</h1>
            </div>
            <div class="content">
              <p>Hi ${reviewData.userName || 'there'},</p>
              <p>Great news! Your review has been approved and is now live on our platform.</p>

              <h3>Your Review:</h3>
              <div class="stars">${'⭐'.repeat(reviewData.rating)}</div>
              <p><strong>${reviewData.title}</strong></p>
              <p>${reviewData.review}</p>

              <p>Thank you for taking the time to share your experience with our community. Your insights help others make informed decisions!</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews" class="button">View Your Review</a>
            </div>
            <div class="footer">
              <p>CareerCraft AI - Your Career Companion</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
✅ Review Approved!

Hi ${reviewData.userName || 'there'},

Great news! Your review has been approved and is now live on our platform.

Your Review:
${'⭐'.repeat(reviewData.rating)}
${reviewData.title}
${reviewData.review}

Thank you for taking the time to share your experience with our community!

View your review at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews

CareerCraft AI - Your Career Companion
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendReviewRejectionNotification(email, reviewData, reason) {
    const subject = 'Update on Your Review Submission';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .reason-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Review Update</h1>
            </div>
            <div class="content">
              <p>Hi ${reviewData.userName || 'there'},</p>
              <p>Thank you for submitting your review. After careful consideration, we're unable to approve it at this time.</p>

              <div class="reason-box">
                <h3>Reason:</h3>
                <p>${reason}</p>
              </div>

              <p>We encourage authentic reviews that help our community. If you'd like to submit a revised review that addresses the concerns mentioned above, please feel free to do so.</p>

              <p>If you have any questions about our review guidelines, please don't hesitate to contact us at support@careercraft.ai</p>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews" class="button">Submit a New Review</a>
            </div>
            <div class="footer">
              <p>CareerCraft AI - Your Career Companion</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Review Update

Hi ${reviewData.userName || 'there'},

Thank you for submitting your review. After careful consideration, we're unable to approve it at this time.

Reason:
${reason}

We encourage authentic reviews that help our community. If you'd like to submit a revised review, please feel free to do so.

If you have questions, contact us at support@careercraft.ai

Submit a new review at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews

CareerCraft AI - Your Career Companion
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendReviewResponseNotification(email, reviewData, teamResponse) {
    const subject = `The Team Responded to Your Review`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .response-box { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .stars { color: #fbbf24; font-size: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 The Team Responded!</h1>
            </div>
            <div class="content">
              <p>Hi ${reviewData.userName || 'there'},</p>
              <p>Our team has responded to your review. We truly appreciate your feedback!</p>

              <h3>Your Review:</h3>
              <div class="stars">${'⭐'.repeat(reviewData.rating)}</div>
              <p><strong>${reviewData.title}</strong></p>
              <p>${reviewData.review}</p>

              <div class="response-box">
                <h3>Team Response:</h3>
                <p>${teamResponse.message}</p>
                <p style="color: #666; font-size: 12px; margin-top: 10px;">
                  - ${teamResponse.responderName} | ${new Date(teamResponse.respondedAt).toLocaleString()}
                </p>
              </div>

              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews" class="button">View on Platform</a>

              <p>Thank you for being part of our community!</p>
            </div>
            <div class="footer">
              <p>CareerCraft AI - Your Career Companion</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
💬 The Team Responded to Your Review!

Hi ${reviewData.userName || 'there'},

Our team has responded to your review. We truly appreciate your feedback!

Your Review:
${'⭐'.repeat(reviewData.rating)}
${reviewData.title}
${reviewData.review}

Team Response:
${teamResponse.message}
- ${teamResponse.responderName} | ${new Date(teamResponse.respondedAt).toLocaleString()}

View on platform: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/reviews

Thank you for being part of our community!

CareerCraft AI - Your Career Companion
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }
}

// Export singleton instance
module.exports = new EmailService();
