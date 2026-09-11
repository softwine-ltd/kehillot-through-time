# EmailJS Setup Instructions

This application uses **EmailJS** to send form submissions directly from the browser without a backend server.

## Quick Setup (5 minutes)

### Step 1: Sign up for EmailJS
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free tier)
3. Verify your email address

### Step 2: Create an Email Service
1. Once logged in, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended):
   - **Gmail**: Connect your Gmail account
   - **Outlook**: Connect your Outlook account
   - Or use **SendGrid** for a custom SMTP server
4. Follow the authorization steps
5. Note down the **Service ID** (e.g., `service_xxxxxxx`)

### Step 3: Create an Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Subject:**
```
New Data Suggestion: {{town_name}}, {{country}}
```

**Content (HTML):**
```html
<h2>New Data Suggestion Submitted</h2>

<p><strong>Town:</strong> {{town_name}}</p>
<p><strong>Country:</strong> {{country}}</p>
<p><strong>Coordinates:</strong> {{coordinates}}</p>

<h3>Population Data:</h3>
<pre>{{entries}}</pre>

<p><strong>Comment:</strong> {{comment}}</p>

<hr>

<p><strong>Submitted by:</strong> {{user_name}}</p>
<p><strong>Email:</strong> {{user_email}}</p>
<p><strong>Submitted at:</strong> {{submitted_at}}</p>
```

**Content (Plain Text):**
```
New Data Suggestion Submitted

Town: {{town_name}}
Country: {{country}}
Coordinates: {{coordinates}}

Population Data:
{{entries}}

Comment: {{comment}}

Submitted by: {{user_name}}
Email: {{user_email}}
Submitted at: {{submitted_at}}
```

4. Click **Save**
5. Note down the **Template ID** (e.g., `template_xxxxxxx`)

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key**
3. Copy it (it looks like: `abc123xyz`)

### Step 5: Update Your Code
Open `helpers.js` and find these lines (around line 1790 and 1832):

1. **Replace the Public Key:**
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY"); // Line ~1790
   ```
   Change to:
   ```javascript
   emailjs.init("your_actual_public_key_here");
   ```

2. **Replace the Service ID:**
   ```javascript
   return await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams); // Line ~1832
   ```
   Change to:
   ```javascript
   return await emailjs.send('service_xxxxxxx', 'template_xxxxxxx', templateParams);
   ```

### Step 6: Test It
1. Open your website
2. Click "Suggest Data"
3. Fill out the form and submit
4. Check your email!

## Alternative Options

### Option 1: Use Request Bin (Testing Only)
If you just want to test quickly without signing up:
1. Go to [https://requestbin.com/](https://requestbin.com/)
2. Create a new bin
3. You'll get a URL like `https://yourbin.requestbin.com/xxxxx`
4. Replace the EmailJS code with a simple fetch request

### Option 2: Backend Server
If you prefer a traditional backend:
- **Node.js/Express**: Set up an endpoint and use nodemailer
- **Python/Flask**: Set up an endpoint and use Flask-Mail
- **PHP**: Set up an endpoint and use PHPMailer

Let me know if you need help with any of these alternatives!

## Troubleshooting

**"EmailJS not defined" error:**
- Make sure the EmailJS script is loaded in your HTML

**"Service/Template not found" error:**
- Double-check your Service ID and Template ID
- Make sure they're copied correctly (including underscores)

**Emails not arriving:**
- Check your spam folder
- Verify your email service is connected properly
- Check EmailJS dashboard for error logs

## Security Note
Never commit your actual public key to a public repository. Consider using environment variables or a config file that's git-ignored.

