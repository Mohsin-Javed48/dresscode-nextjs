const Contact = require("../models/contact");

async function handleCreateContact(req, res) {
  try {
    const body = req.body;

    const contact = await Contact.create({
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      subject: body.subject,
      message: body.message,
    });

    return res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "Contact creation failed" });
  }
}

module.exports = {
  handleCreateContact,
};
