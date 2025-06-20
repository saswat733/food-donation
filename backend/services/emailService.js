import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendDonationConfirmationEmail = async (donation) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: donation.email,
      subject: "Thank You for Your Food Donation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Thank You for Your Food Donation!</h2>
          <p>Dear ${donation.donorName},</p>
          <p>We've received your donation of <strong>${donation.foodDescription}</strong> scheduled for pickup on ${donation.pickupDate}.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Donation Details</h3>
            <p><strong>Pickup Location:</strong> ${donation.pickupLocation}</p>
            <p><strong>Pickup Time:</strong> ${donation.pickupTime}</p>
            <p><strong>Status:</strong> ${donation.status}</p>
          </div>
          
          <p>Our team will contact you if we need any additional information.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${donation.email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send confirmation email");
  }
};


export const sendWasteCollectionConfirmationEmail = async (request) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: request.email,
      subject: "Your Waste Collection Request Has Been Received",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Thank You for Your Waste Collection Request!</h2>
          <p>Dear ${request.name},</p>
          <p>We've received your request for waste collection of <strong>${
            request.wasteType
          }</strong> scheduled for pickup on ${request.pickupDate}.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Request Details</h3>
            <p><strong>Contact Phone:</strong> ${request.phone}</p>
            <p><strong>Collection Address:</strong> ${request.address}</p>
            <p><strong>Waste Type:</strong> ${request.wasteType}</p>
            <p><strong>Estimated Quantity:</strong> ${request.quantity}</p>
            <p><strong>Scheduled Pickup Date:</strong> ${request.pickupDate}</p>
            ${
              request.notes
                ? `<p><strong>Additional Notes:</strong> ${request.notes}</p>`
                : ""
            }
          </div>
          
          <p>Our waste collection team will review your request and contact you shortly to confirm the pickup details.</p>
          <p>If you have any urgent questions, please reply to this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${request.email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send waste collection confirmation email");
  }
};


export const sendFoodDonationConfirmationEmail = async (donation) => {
  try {
    // Map food types to more readable formats
    const businessTypeMap = {
      catering: "Catering Company",
      restaurant: "Restaurant",
      venue: "Event Venue",
      hotel: "Hotel",
      bakery: "Bakery",
      farm: "Farm/Producer",
      other: "Other",
    };

    const foodTypeMap = {
      "prepared-meals": "Prepared Meals",
      "fresh-produce": "Fresh Produce",
      "packaged-food": "Packaged Food",
      bakery: "Bakery Items",
      dairy: "Dairy Products",
      other: "Other",
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: donation.email,
      subject: "Thank You for Your Food Donation Offer",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">Thank You for Your Generous Offer!</h2>
          <p>Dear ${donation.contactName},</p>
          <p>We've received your food donation offer from <strong>${
            donation.businessName
          }</strong> and truly appreciate your commitment to reducing food waste and helping those in need.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Donation Details</h3>
            <p><strong>Business Type:</strong> ${
              businessTypeMap[donation.businessType]
            }</p>
            <p><strong>Food Type:</strong> ${foodTypeMap[donation.foodType]}</p>
            <p><strong>Quantity:</strong> ${donation.quantity}</p>
            <p><strong>Pickup Time:</strong> ${new Date(
              donation.pickupTime
            ).toLocaleString()}</p>
            <p><strong>Address:</strong> ${donation.address}</p>
            ${
              donation.foodDetails
                ? `<p><strong>Food Details:</strong> ${donation.foodDetails}</p>`
                : ""
            }
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Our team will review your donation offer (usually within 2 hours).</li>
            <li>We'll match you with a nearby organization that can receive your donation.</li>
            <li>You'll receive a confirmation with pickup details.</li>
          </ol>
          
          <p>If you need to make any changes or have questions, please reply to this email or call our donor support line at (555) 123-4567.</p>
          
          <p>Thank you again for your generosity!</p>
          <p>Feeders Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${donation.email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send confirmation email");
  }
};


export const sendContactConfirmationEmail = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contactData.email,
      subject: "Thank You for Contacting Us",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">We've Received Your Message!</h2>
          <p>Dear ${contactData.name},</p>
          <p>Thank you for reaching out to us. We've received your message and our team will get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin-top: 0;">Your Message</h3>
            <p>${contactData.message}</p>
          </div>
          
          <p><strong>What to expect next:</strong></p>
          <ul>
            <li>Our team typically responds within 24-48 hours</li>
            <li>For urgent inquiries, please call our support line at ${
              process.env.CONTACT_PHONE || "(555) 123-4567"
            }</li>
          </ul>
          
          <p>Thank you for your patience and for choosing our service!</p>
          <p>Best regards,<br>Feeders Team</p>
        </div>
      `,
    };

    // Send admin notification
    const adminMailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2e7d32;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p>${contactData.message}</p>
          </div>
          <p>Please respond to this inquiry at your earliest convenience.</p>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(adminMailOptions);

    console.log(`Contact confirmation email sent to ${contactData.email}`);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send contact confirmation email");
  }
};