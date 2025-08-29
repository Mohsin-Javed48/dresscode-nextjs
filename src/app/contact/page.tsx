"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Package,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
      <div className="bg-black text-white py-2 px-4 text-center text-sm relative">
        <span>Sign up and get 20% off your first order. </span>
        <span className="underline cursor-pointer font-medium">
          Sign Up Now
        </span>
        <X className="w-4 h-4 absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer" />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              CONTACT US
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about our products or need assistance? We&apos;re
              here to help you find the perfect pieces for your wardrobe.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-14 p-2 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-black mb-2">Phone</h3>
              <p className="text-gray-600 text-sm mb-3">
                Call us for immediate assistance
              </p>
              <p className="font-medium text-black">+92 300 1234567</p>
              <p className="text-sm text-gray-500">Mon-Sat 9AM-8PM</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-14 p-2 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-black mb-2">Email</h3>
              <p className="text-gray-600 text-sm mb-3">
                Send us a detailed message
              </p>
              <p className="font-medium text-black">info@dresscode.pk</p>
              <p className="text-sm text-gray-500">Response within 24hrs</p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-14 p-2 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-black mb-2">Address</h3>
              <p className="text-gray-600 text-sm mb-3">Visit our showroom</p>
              <p className="font-medium text-black text-sm">
                123 Fashion Street, Lahore, Punjab, Pakistan
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-14 p-2 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-black mb-2">Hours</h3>
              <p className="text-gray-600 text-sm mb-3">Our business hours</p>
              <p className="font-medium text-black text-sm">Mon-Sat: 9AM-8PM</p>
              <p className="text-sm text-gray-500">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="bg-gray-50 py-12  flex items-center justify-center">
        <div className="w-full max-w-3xl px-4">
          {" "}
          {/* Centered container with max width */}
          <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 text-center">
            Get In Touch
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Fill out the form below and we&apos;ll get back to you as soon as
            possible. We&apos;re here to help with any questions about our
            products, orders, or services.
          </p>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="order">Order Support</option>
                <option value="product">Product Information</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="return">Returns & Exchanges</option>
                <option value="wholesale">Wholesale Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
              Visit Our Showroom
            </h2>
            <p className="text-gray-600 text-lg">
              Experience our collection in person at our flagship location in
              Lahore
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-4 lg:min-h-16 border rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16  text-gray-600 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">
                Interactive Map Coming Soon
              </p>
              <p className="text-gray-600 text-sm">
                123 Fashion Street, Lahore, Punjab, Pakistan
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
