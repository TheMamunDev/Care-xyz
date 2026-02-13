import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  date: Date;
  duration: number;
  totalCost: number;
  address: string;
}

export async function sendInvoiceEmail(data: InvoiceData) {
  const {
    orderId,
    customerName,
    customerEmail,
    serviceName,
    date,
    duration,
    totalCost,
    address,
  } = data;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: #E76F51; padding: 20px; text-align: center; color: white;">
        <h1 style="margin: 0;">Care.xyz</h1>
        <p style="margin: 5px 0 0 0;">Booking Confirmation & Invoice</p>
      </div>

      <div style="padding: 20px;">
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Thank you for choosing Care.xyz. Your booking has been confirmed. Below is your invoice and service details.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderId.slice(-6).toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Service Date:</strong> ${new Date(date).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Location:</strong> ${address}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #eee; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #ddd;">Service</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd;">Duration</th>
              <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${serviceName}</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${duration} Hours</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳${totalCost}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Amount:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #E76F51;">৳${totalCost}</td>
            </tr>
          </tfoot>
        </table>

        <p style="font-size: 12px; color: #666;">
          * Payment is completed .<br>
          * You can view your booking from your dashboard.
        </p>
      </div>

      <div style="background-color: #333; color: #aaa; padding: 15px; text-align: center; font-size: 12px;">
        &copy; ${new Date().getFullYear()} Care.xyz. All rights reserved.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Care.xyz Support" <${process.env.SMTP_EMAIL}>`,
      to: customerEmail,
      subject: `Booking Confirmed - Invoice #${orderId.slice(-6).toUpperCase()}`,
      html: htmlContent,
    });
    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
