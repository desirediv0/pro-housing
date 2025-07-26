# Email Setup Guide

## Current Status

The server is currently running with email logging instead of actual email sending. This prevents email-related errors while allowing the expertise page to work properly.

## To Enable Email Sending

### Option 1: Gmail SMTP (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Update your .env file**:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=587
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="your-16-digit-app-password"
   FROM_EMAIL="your-email@gmail.com"
   ```

### Option 2: Other SMTP Providers

Update your `.env` file with your SMTP provider details:

```env
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASSWORD="your-password"
FROM_EMAIL="your-email@domain.com"
```

### Option 3: Use a Service like SendGrid

1. Sign up for SendGrid
2. Get your API key
3. Update the SendEmail.js file to use SendGrid instead of nodemailer

## Testing Email

After configuring email, restart the server and test by:

1. Submitting a new expertise inquiry
2. Responding to an inquiry from the admin panel

## Current Behavior

When email is not configured:

- ✅ Server runs without errors
- ✅ Expertise page works normally
- ✅ All functionality works except actual email sending
- 📧 Emails are logged to console instead of being sent

This allows you to test all features while setting up email later.
