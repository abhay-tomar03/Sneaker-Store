/**
 * ENHANCED EMAIL SERVICE
 * Supports multiple email providers:
 * - Gmail SMTP (original, fallback)
 * - SendGrid (recommended for production)
 * - Mailgun (alternative)
 * - AWS SES (scalable option)
 */

const nodemailer = require('nodemailer');

// ============================================
// EMAIL SERVICE FACTORY
// ============================================

class EmailService {
  constructor() {
    this.service = process.env.EMAIL_SERVICE || 'gmail';
    this.transporter = null;
    this.initializeService();
  }

  initializeService() {
    switch (this.service) {
      case 'sendgrid':
        this.initializeSendGrid();
        break;
      case 'mailgun':
        this.initializeMailgun();
        break;
      case 'aws-ses':
        this.initializeAWSSES();
        break;
      case 'gmail':
      default:
        this.initializeGmail();
    }
  }

  // ============================================
  // GMAIL (Original)
  // ============================================
  initializeGmail() {
    console.log('📧 Initializing Gmail SMTP service...');
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App-specific password
      },
      logger: true,
      debug: process.env.NODE_ENV === 'development'
    });

    this.verifyConnection();
  }

  // ============================================
  // SENDGRID (Recommended)
  // ============================================
  initializeSendGrid() {
    console.log('📧 Initializing SendGrid Web API...');
    if (!process.env.SENDGRID_API_KEY) {
      console.error('❌ SENDGRID_API_KEY not set');
      return;
    }
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.sgMail = sgMail;
      console.log('✅ SENDGRID Web API initialized');
    } catch (err) {
      console.error('❌ Failed to initialize @sendgrid/mail:', err.message);
    }
    // No Nodemailer transporter for SendGrid Web API
    this.transporter = null;
  }

  // ============================================
  // MAILGUN (Alternative)
  // ============================================
  initializeMailgun() {
    console.log('📧 Initializing Mailgun service...');
    
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      console.error('❌ MAILGUN_API_KEY or MAILGUN_DOMAIN not set');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: `postmaster@${process.env.MAILGUN_DOMAIN}`,
        pass: process.env.MAILGUN_API_KEY
      },
      logger: true,
      debug: process.env.NODE_ENV === 'development'
    });

    this.verifyConnection();
  }

  // ============================================
  // AWS SES (Scalable)
  // ============================================
  initializeAWSSES() {
    console.log('📧 Initializing AWS SES service...');
    
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('❌ AWS credentials not set');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: `email-smtp.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com`,
      port: 587,
      secure: false,
      auth: {
        user: process.env.AWS_ACCESS_KEY_ID,
        pass: process.env.AWS_SECRET_ACCESS_KEY
      },
      logger: true,
      debug: process.env.NODE_ENV === 'development'
    });

    this.verifyConnection();
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  verifyConnection() {
    if (!this.transporter) return;

    this.transporter.verify((error, success) => {
      if (error) {
        console.error(`❌ ${this.service.toUpperCase()} service error:`, error.message);
      } else {
        this.transporter._verified = true;
        if (this.service === 'sendgrid') {
          console.log('✅ SENDGRID email service is ready');
        } else {
          console.log(`✅ ${this.service.toUpperCase()} email service is ready`);
        }
      }
    });
  }

  getFromAddress() {
    return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@sneakhub.com';
  }

  // ============================================
  // ORDER CONFIRMATION EMAIL
  // ============================================
  async sendOrderConfirmationEmail(order, userEmail) {
    try {
      const userId = order.userId || order.user?._id || 'unknown';
      
      const itemsList = order.items
        .map(
          (item) =>
            `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">Qty: ${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.price.toLocaleString()}</td>
        </tr>
      `
        )
        .join('');

      const addressInfo = order.shippingAddress
        ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
        <h3 style="margin-top: 0; color: #333;">Delivery Address</h3>
        <p style="margin: 5px 0; color: #666;">
          <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br/>
          ${order.shippingAddress.address}<br/>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}<br/>
          Phone: ${order.shippingAddress.phone}
        </p>
      </div>
    `
        : '';

      const mailOptions = {
        from: this.getFromAddress(),
        to: userEmail,
        subject: `Order Confirmation - Order #${order._id}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .header p {
                margin: 10px 0 0 0;
                opacity: 0.9;
              }
              .content {
                padding: 30px;
              }
              .order-info {
                background-color: #f9f9f9;
                border-left: 4px solid #667eea;
                padding: 15px;
                margin: 20px 0;
              }
              .order-info p {
                margin: 5px 0;
                color: #333;
              }
              .order-info strong {
                color: #667eea;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              table th {
                background-color: #f5f5f5;
                padding: 10px;
                text-align: left;
                font-weight: 600;
                color: #333;
                border-bottom: 2px solid #667eea;
              }
              .total-section {
                margin: 20px 0;
                padding: 15px;
                background-color: #f9f9f9;
                border-left: 4px solid #667eea;
              }
              .total-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                font-size: 16px;
              }
              .total-final {
                display: flex;
                justify-content: space-between;
                margin: 15px 0;
                font-size: 20px;
                font-weight: bold;
                color: #667eea;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                text-align: center;
                font-weight: 600;
              }
              .button:hover {
                opacity: 0.9;
              }
              .footer {
                background-color: #f5f5f5;
                padding: 20px;
                text-align: center;
                color: #999;
                font-size: 12px;
              }
              .info-box {
                background-color: #e8f4f8;
                border-left: 4px solid #0288d1;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .info-box p {
                margin: 5px 0;
                color: #0288d1;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Order Confirmed!</h1>
                <p>Your order has been received</p>
              </div>

              <div class="content">
                <p style="color: #666; font-size: 16px;">Hi ${order.shippingAddress?.firstName || 'Valued Customer'},</p>
                
                <p style="color: #666; line-height: 1.6;">
                  Thank you for your order! We're excited to get your new sneakers to you. 👟
                </p>

                <div class="order-info">
                  <p><strong>Order Number:</strong> #${order._id}</p>
                  <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <p><strong>Payment Method:</strong> ${this.getPaymentMethod(order.paymentMethod)}</p>
                  <p><strong>Payment Status:</strong> <span style="color: #4caf50; font-weight: 600;">✓ Confirmed</span></p>
                </div>

                <h3 style="color: #333; margin-top: 20px;">📦 Order Items</h3>
                <table>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  ${itemsList}
                </table>

                <div class="total-section">
                  <div class="total-row">
                    <span>Subtotal:</span>
                    <span>₹${(order.totalAmount - (order.shippingCost || 0) - (order.tax || 0)).toLocaleString()}</span>
                  </div>
                  ${order.tax ? `<div class="total-row"><span>Tax:</span><span>₹${order.tax.toLocaleString()}</span></div>` : ''}
                  ${order.shippingCost ? `<div class="total-row"><span>Shipping:</span><span>₹${order.shippingCost.toLocaleString()}</span></div>` : ''}
                  ${order.discount ? `<div class="total-row"><span>Discount:</span><span>-₹${order.discount.toLocaleString()}</span></div>` : ''}
                  <div class="total-final">
                    <span>Total:</span>
                    <span>₹${order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                ${addressInfo}

                <div class="info-box">
                  <p><strong>📦 What's Next?</strong></p>
                  <p>We'll process your order and ship it out soon. You'll receive a tracking number via email as soon as your order ships.</p>
                </div>

                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">Track Your Order</a>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    If you have any questions, feel free to reach out to our support team.
                  </p>
                </div>
              </div>

              <div class="footer">
                <p style="margin: 0;">© 2026 SneakHub. All rights reserved.</p>
                <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
                  This is an automated email. Please don't reply to this email.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      // Determine frontend URL based on environment
      let frontendUrl = process.env.FRONTEND_URL;
      if (!frontendUrl) {
        frontendUrl = process.env.NODE_ENV === 'production'
          ? 'https://sneaker-store-frontend-navy.vercel.app'
          : 'http://localhost:3000';
      }
      // Replace the order link in the HTML
      let htmlWithOrderLink = mailOptions.html.replace(/https?:\/\/(localhost:3000|sneaker-store-frontend-navy\.vercel\.app)\/orders\/[\w\d]+/g, `${frontendUrl}/orders/${order._id}`);

      if (this.service === 'sendgrid' && this.sgMail) {
        const msg = {
          to: userEmail,
          from: this.getFromAddress(),
          subject: mailOptions.subject,
          html: htmlWithOrderLink,
        };
        const info = await this.sgMail.send(msg);
        console.log(`✅ Order confirmation email sent via SENDGRID Web API:`, info[0]?.headers['x-message-id'] || info[0]?.messageId);
        return { success: true, messageId: info[0]?.headers['x-message-id'] || info[0]?.messageId };
      } else {
        const info = await this.transporter.sendMail({ ...mailOptions, html: htmlWithOrderLink });
        console.log(`✅ Order confirmation email sent via ${this.service.toUpperCase()}:`, info.messageId);
        return { success: true, messageId: info.messageId };
      }
    } catch (error) {
      console.error(`❌ Failed to send order confirmation email (${this.service}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // SHIPPING UPDATE EMAIL
  // ============================================
  async sendShippingUpdateEmail(userEmail, orderData, trackingNumber) {
    try {
      const mailOptions = {
        from: this.getFromAddress(),
        to: userEmail,
        subject: `Your Order Has Been Shipped - Tracking #${trackingNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">🚚 Your Order is On The Way!</h2>
            </div>
            <div style="padding: 20px;">
              <p style="color: #333; font-size: 16px;">Hi ${orderData.shippingAddress?.firstName || 'Valued Customer'},</p>
              <p style="color: #666; line-height: 1.6;">Great news! Your order has been shipped.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 10px 0; color: #333;"><strong>📦 Tracking Number:</strong> ${trackingNumber}</p>
                <p style="margin: 10px 0; color: #333;"><strong>Order ID:</strong> ${orderData._id}</p>
              </div>

              <p style="color: #666;">You can track your shipment using the tracking number above on your carrier's website.</p>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderData._id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600;">Track Your Package</a>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
            <div style="background: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
              <p style="margin: 0;">© 2026 SneakHub. All rights reserved.</p>
            </div>
          </div>
        `
      };

      if (this.service === 'sendgrid' && this.sgMail) {
        const msg = {
          to: userEmail,
          from: this.getFromAddress(),
          subject: mailOptions.subject,
          html: mailOptions.html,
        };
        const info = await this.sgMail.send(msg);
        console.log(`✅ Shipping update email sent via SENDGRID Web API:`, info[0]?.headers['x-message-id'] || info[0]?.messageId);
        return { success: true, messageId: info[0]?.headers['x-message-id'] || info[0]?.messageId };
      } else {
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Shipping update email sent via ${this.service.toUpperCase()}:`, info.messageId);
        return { success: true, messageId: info.messageId };
      }
    } catch (error) {
      console.error(`❌ Failed to send shipping update email (${this.service}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // OTP EMAIL
  // ============================================
  async sendOTPEmail(userEmail, otp, firstName = 'User', purpose = 'signup') {
    try {
      let subject = '';
      let heading = '';
      let message = '';

      if (purpose === 'reset') {
        subject = 'Password Reset Code - SneakHub';
        heading = 'Password Reset';
        message = 'Here is the code to reset your password:';
      } else {
        subject = 'Your OTP Verification Code - SneakHub';
        heading = 'Verify Your Email';
        message = 'Your One-Time Password (OTP) for email verification is:';
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">${heading}</h2>
          </div>
          <div style="padding: 20px;">
            <p style="color: #333; font-size: 16px;">Hi ${firstName},</p>
            <p style="color: #666; line-height: 1.6;">${message}</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
              <span style="font-size: 32px; letter-spacing: 4px; color: #667eea; font-weight: bold;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">© 2026 SneakHub. All rights reserved.</p>
          </div>
        </div>
      `;
      if (this.service === 'sendgrid' && this.sgMail) {
        const msg = {
          to: userEmail,
          from: this.getFromAddress(),
          subject,
          html,
        };
        const info = await this.sgMail.send(msg);
        console.log(`✅ OTP email sent via SENDGRID Web API to:`, userEmail);
        return { success: true, messageId: info[0]?.headers['x-message-id'] || info[0]?.messageId };
      } else {
        const mailOptions = {
          from: this.getFromAddress(),
          to: userEmail,
          subject,
          html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent via ${this.service.toUpperCase()} to:`, userEmail);
        return { success: true, messageId: info.messageId };
      }
    } catch (error) {
      console.error(`❌ Failed to send OTP email (${this.service}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // ORDER STATUS UPDATE EMAIL
  // ============================================
  async sendOrderStatusUpdateEmail(userEmail, orderData, newStatus) {
    try {
      const statusMessages = {
        shipped: { emoji: '📦', title: 'Your Order Has Been Shipped!', message: 'Your order is on its way.' },
        delivered: { emoji: '✅', title: 'Your Order Has Arrived!', message: 'Your order has been delivered.' },
        cancelled: { emoji: '❌', title: 'Your Order Has Been Cancelled', message: 'Your order has been cancelled as per your request.' },
        processing: { emoji: '⚙️', title: 'Order Processing', message: 'We\'re preparing your order for shipment.' }
      };

      const statusInfo = statusMessages[newStatus] || statusMessages.processing;

      const subject = `Order ${newStatus.toUpperCase()} - SneakHub`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 28px;">${statusInfo.emoji} ${statusInfo.title}</h2>
          </div>
          <div style="padding: 30px;">
            <p style="color: #666; font-size: 16px;">Hi ${orderData.shippingAddress?.firstName || 'Valued Customer'},</p>
            <p style="color: #666; line-height: 1.6; font-size: 15px;">${statusInfo.message}</p>
            <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 4px;">
              <p style="margin: 5px 0; color: #333;"><strong>Order ID:</strong> ${orderData._id}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> ${newStatus.toUpperCase()}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Updated:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${orderData._id}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: 600;">View Order Details</a>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 13px;">
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0;">© 2026 SneakHub. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; font-size: 11px;">This is an automated email. Please don't reply to this email.</p>
          </div>
        </div>
      `;
      if (this.service === 'sendgrid' && this.sgMail) {
        const msg = {
          to: userEmail,
          from: this.getFromAddress(),
          subject,
          html,
        };
        const info = await this.sgMail.send(msg);
        console.log(`✅ Order status update email sent via SENDGRID Web API:`, info[0]?.headers['x-message-id'] || info[0]?.messageId);
        return { success: true, messageId: info[0]?.headers['x-message-id'] || info[0]?.messageId };
      } else {
        const mailOptions = {
          from: this.getFromAddress(),
          to: userEmail,
          subject,
          html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Order status update email sent via ${this.service.toUpperCase()}:`, info.messageId);
        return { success: true, messageId: info.messageId };
      }
    } catch (error) {
      console.error(`❌ Failed to send order status update email (${this.service}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // PROMOTIONAL EMAIL
  // ============================================
  async sendPromotionalEmail(userEmail, firstName = 'Valued Customer', promoData) {
    try {
      const { title, discount, code, expiryDate, description, buttonText, buttonLink } = promoData;
      const subject = title || 'Exclusive Offer Just for You!';
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
              color: white;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
            }
            .content {
              padding: 40px 20px;
              text-align: center;
            }
            .discount-badge {
              background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
              color: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 36px;
              font-weight: bold;
            }
            .promo-code {
              background: #f5f5f5;
              padding: 15px;
              border: 2px dashed #ec4899;
              border-radius: 8px;
              margin: 20px 0;
            }
            .promo-code p {
              margin: 5px 0;
              color: #333;
            }
            .code {
              font-size: 24px;
              font-weight: bold;
              color: #ec4899;
              font-family: monospace;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #ec4899 0%, #f59e0b 100%);
              color: white;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              margin: 20px 0;
              font-weight: 600;
              font-size: 16px;
            }
            .terms {
              background: #f9f9f9;
              padding: 15px;
              margin: 20px 0;
              border-left: 4px solid #ec4899;
              text-align: left;
              border-radius: 4px;
            }
            .terms li {
              font-size: 13px;
              color: #666;
              margin: 5px 0;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ${title || 'Exclusive Offer'}</h1>
            </div>
            <div class="content">
              <p style="color: #666; font-size: 16px;">Hi ${firstName},</p>
              <p style="color: #666; font-size: 15px; line-height: 1.6;">
                ${description || 'We have a special offer just for you!'}
              </p>
              <div class="discount-badge">
                ${discount || 'Special Offer'}
              </div>
              ${code ? `
                <div class="promo-code">
                  <p style="color: #999; font-size: 13px; margin: 0 0 10px 0;">Use this code to unlock your discount:</p>
                  <p class="code">${code}</p>
                </div>
              ` : ''}
              ${expiryDate ? `
                <p style="color: #ec4899; font-weight: 600; font-size: 14px;">
                  ⏰ Offer expires on ${new Date(expiryDate).toLocaleDateString()}
                </p>
              ` : ''}
              <a href="${buttonLink || '#'}" class="button">
                ${buttonText || 'Shop Now'}
              </a>
              <div class="terms">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #333;">Terms & Conditions:</p>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Valid for a limited time only</li>
                  <li>One code per customer</li>
                  <li>Cannot be combined with other offers</li>
                  <li>Applicable on selected items only</li>
                </ul>
              </div>
              <p style="color: #999; font-size: 14px; margin-top: 25px;">
                Hurry! This offer won't last long. Start shopping now and save big! 🛍️
              </p>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2026 SneakHub. All rights reserved.</p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">
                To unsubscribe from promotional emails, please contact us.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
      if (this.service === 'sendgrid' && this.sgMail) {
        const msg = {
          to: userEmail,
          from: this.getFromAddress(),
          subject,
          html,
        };
        const info = await this.sgMail.send(msg);
        console.log(`✅ Promotional email sent via SENDGRID Web API:`, info[0]?.headers['x-message-id'] || info[0]?.messageId);
        return { success: true, messageId: info[0]?.headers['x-message-id'] || info[0]?.messageId };
      } else {
        const mailOptions = {
          from: this.getFromAddress(),
          to: userEmail,
          subject,
          html,
        };
        const info = await this.transporter.sendMail(mailOptions);
        console.log(`✅ Promotional email sent via ${this.service.toUpperCase()}:`, info.messageId);
        return { success: true, messageId: info.messageId };
      }
    } catch (error) {
      console.error(`❌ Failed to send promotional email (${this.service}):`, error.message);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // HELPER: GET PAYMENT METHOD NAME
  // ============================================
  getPaymentMethod(method) {
    const methods = {
      razorpay: 'Razorpay',
      stripe: 'Stripe',
      cod: 'Cash on Delivery',
      wallet: 'Digital Wallet'
    };
    return methods[method] || method;
  }
}

// ============================================
// EXPORT
// ============================================
const emailService = new EmailService();

module.exports = {
  sendOrderConfirmationEmail: (order, email) => emailService.sendOrderConfirmationEmail(order, email),
  sendOrderStatusUpdateEmail: (email, order, status) => emailService.sendOrderStatusUpdateEmail(email, order, status),
  sendShippingUpdateEmail: (email, order, tracking) => emailService.sendShippingUpdateEmail(email, order, tracking),
  sendOTPEmail: (email, otp, name, purpose) => emailService.sendOTPEmail(email, otp, name, purpose),
  sendPromotionalEmail: (email, name, promo) => emailService.sendPromotionalEmail(email, name, promo),
  transporter: emailService.transporter,
  emailService
};
