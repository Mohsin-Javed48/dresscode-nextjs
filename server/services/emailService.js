const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendOTPEmail(email, otp, type = "signup") {
    try {
      const subject =
        type === "signup"
          ? "Verify Your Email - Dresscode"
          : "Reset Your Password - Dresscode";

      const html = this.generateOTPEmailHTML(otp, type);

      const mailOptions = {
        from: `Dresscode <${process.env.GMAIL_USER}>`,
        to: email,
        replyTo: email,
        subject: subject,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("OTP email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending OTP email:", error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderConfirmationEmail(orderData) {
    try {
      const subject = `Order Confirmation - ${orderData.orderNumber} - Dresscode`;

      const html = this.generateOrderConfirmationHTML(orderData);

      const mailOptions = {
        from: `Dresscode <${process.env.GMAIL_USER}>`,
        to: orderData.shippingAddress.email,
        replyTo: process.env.GMAIL_USER,
        subject: subject,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        "Order confirmation email sent successfully:",
        result.messageId
      );
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending order confirmation email:", error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderStatusUpdateEmail(orderData, status) {
    try {
      const subject = `Order Update - ${orderData.orderNumber} - Dresscode`;

      const html = this.generateOrderStatusUpdateHTML(orderData, status);

      const mailOptions = {
        from: `Dresscode <${process.env.GMAIL_USER}>`,
        to: orderData.shippingAddress.email,
        replyTo: process.env.GMAIL_USER,
        subject: subject,
        html: html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(
        "Order status update email sent successfully:",
        result.messageId
      );
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Error sending order status update email:", error);
      return { success: false, error: error.message };
    }
  }

  generateOTPEmailHTML(otp, type) {
    const title =
      type === "signup" ? "Verify Your Email" : "Reset Your Password";
    const message =
      type === "signup"
        ? "Thank you for signing up with Dresscode! Please use the following code to verify your email address:"
        : "You requested to reset your password. Please use the following code to reset your password:";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .otp-code {
            background-color: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #000;
            font-family: 'Courier New', monospace;
          }
          .message {
            margin-bottom: 20px;
            font-size: 16px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DRESSCODE</div>
            <h1>${title}</h1>
          </div>
          
          <div class="message">
            <p>${message}</p>
          </div>
          
          <div class="otp-code">${otp}</div>
          
          <div class="warning">
            <strong>Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </div>
          
          <div class="footer">
            <p>This email was sent by Dresscode. If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 Dresscode. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOrderConfirmationHTML(orderData) {
    const formatPrice = (price) => `$${price.toFixed(2)}`;
    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Dresscode</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .order-number {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            color: #000;
          }
          .order-details {
            margin: 20px 0;
          }
          .order-items {
            margin: 20px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-info {
            flex: 1;
          }
          .item-name {
            font-weight: bold;
            margin-bottom: 5px;
          }
          .item-details {
            color: #666;
            font-size: 14px;
          }
          .item-price {
            font-weight: bold;
            color: #000;
          }
          .pricing-summary {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .pricing-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
          }
          .pricing-row.total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 15px;
          }
          .shipping-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .shipping-info h3 {
            margin-top: 0;
            color: #000;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
          .status-badge {
            display: inline-block;
            background-color: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DRESSCODE</div>
            <h1>Order Confirmation</h1>
            <p>Thank you for your order! We're excited to get your items ready for you.</p>
          </div>
          
          <div class="order-number">
            Order Number: ${orderData.orderNumber}
          </div>

          <div class="order-details">
            <p><strong>Order Date:</strong> ${formatDate(orderData.created_at)}</p>
            <p><strong>Status:</strong> <span class="status-badge">${orderData.status}</span></p>
          </div>

          <div class="order-items">
            <h3>Order Items</h3>
            ${orderData.items
              .map(
                (item) => `
              <div class="item">
                <div class="item-info">
                  <div class="item-name">${item.product.name}</div>
                  <div class="item-details">Size: ${item.size} | Quantity: ${item.quantity}</div>
                </div>
                <div class="item-price">${formatPrice(item.totalPrice)}</div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="pricing-summary">
            <h3>Order Summary</h3>
            <div class="pricing-row">
              <span>Subtotal:</span>
              <span>${formatPrice(orderData.pricing.subtotal)}</span>
            </div>
            <div class="pricing-row">
              <span>Shipping:</span>
              <span>${formatPrice(orderData.pricing.shippingCost)}</span>
            </div>
            ${
              orderData.pricing.discount > 0
                ? `
            <div class="pricing-row">
              <span>Discount:</span>
              <span>-${formatPrice(orderData.pricing.discount)}</span>
            </div>
            `
                : ""
            }
            <div class="pricing-row total">
              <span>Total:</span>
              <span>${formatPrice(orderData.pricing.total)}</span>
            </div>
          </div>

          <div class="shipping-info">
            <h3>Shipping Address</h3>
            <p>
              ${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}<br>
              ${orderData.shippingAddress.address}<br>
              ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}<br>
              ${orderData.shippingAddress.country}
            </p>
            <p><strong>Email:</strong> ${orderData.shippingAddress.email}</p>
            <p><strong>Phone:</strong> ${orderData.shippingAddress.phone}</p>
          </div>

          <div class="footer">
            <p>We'll send you another email when your order ships.</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 Dresscode. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateOrderStatusUpdateHTML(orderData, status) {
    const statusMessages = {
      confirmed: "Your order has been confirmed and is being prepared.",
      processing: "Your order is being processed and will ship soon.",
      shipped: "Great news! Your order has been shipped.",
      delivered: "Your order has been delivered successfully.",
      cancelled: "Your order has been cancelled.",
      returned: "Your order has been returned.",
    };

    const statusMessage =
      statusMessages[status] || "Your order status has been updated.";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - Dresscode</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #000;
            margin-bottom: 10px;
          }
          .order-number {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            font-size: 18px;
            font-weight: bold;
            color: #000;
          }
          .status-update {
            background-color: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
          }
          .status-badge {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .tracking-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">DRESSCODE</div>
            <h1>Order Update</h1>
          </div>
          
          <div class="order-number">
            Order Number: ${orderData.orderNumber}
          </div>

          <div class="status-update">
            <div class="status-badge">${status}</div>
            <p><strong>${statusMessage}</strong></p>
          </div>

          ${
            orderData.trackingNumber
              ? `
          <div class="tracking-info">
            <h3>Tracking Information</h3>
            <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
            <p>You can track your package using the tracking number above.</p>
          </div>
          `
              : ""
          }

          <div class="footer">
            <p>Thank you for choosing Dresscode!</p>
            <p>If you have any questions, please contact our support team.</p>
            <p>&copy; 2024 Dresscode. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
