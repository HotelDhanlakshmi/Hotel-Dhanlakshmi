const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.apiUrl = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
  }

  /**
   * Send OTP via WhatsApp
   * @param {string} mobile - Mobile number (without +91)
   * @param {string} otp - 6-digit OTP
   * @returns {Promise<Object>} - API response
   */
  async sendOTP(mobile, otp) {
    try {
      // Format mobile number for WhatsApp (add country code)
      const whatsappNumber = `91${mobile}`; // India country code

      const messageData = {
        messaging_product: "whatsapp",
        to: whatsappNumber,
        type: "template",
        template: {
          name: "hotel_dhanlakshmi_otp", // Template name (you'll create this)
          language: {
            code: "en"
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp
                }
              ]
            }
          ]
        }
      };

      const response = await axios.post(this.apiUrl, messageData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('WhatsApp OTP sent successfully:', response.data);
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };

    } catch (error) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      
      // Fallback to simple text message if template fails
      return await this.sendSimpleOTP(mobile, otp);
    }
  }

  /**
   * Send simple text OTP (fallback method)
   * @param {string} mobile - Mobile number
   * @param {string} otp - 6-digit OTP
   * @returns {Promise<Object>} - API response
   */
  async sendSimpleOTP(mobile, otp) {
    try {
      const whatsappNumber = `91${mobile}`;
      
      const messageData = {
        messaging_product: "whatsapp",
        to: whatsappNumber,
        type: "text",
        text: {
          body: `🍽️ *Hotel Dhanlakshmi*\n\nYour OTP for order verification is: *${otp}*\n\nValid for 5 minutes only.\n\nThank you for choosing us! 🙏`
        }
      };

      const response = await axios.post(this.apiUrl, messageData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('WhatsApp simple OTP sent:', response.data);
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };

    } catch (error) {
      console.error('WhatsApp Simple Message Error:', error.response?.data || error.message);
      throw new Error('Failed to send WhatsApp OTP');
    }
  }

  /**
   * Send order confirmation via WhatsApp
   * @param {string} mobile - Mobile number
   * @param {Object} orderData - Order details
   * @returns {Promise<Object>} - API response
   */
  async sendOrderConfirmation(mobile, orderData) {
    try {
      const whatsappNumber = `91${mobile}`;
      
      const itemsList = orderData.items.map(item => 
        `• ${item.name} x${item.quantity} - ₹${item.price * item.quantity}`
      ).join('\n');

      const messageText = `🎉 *Order Confirmed!*\n\n*Hotel Dhanlakshmi*\n\n*Order ID:* ${orderData.id}\n*Total Amount:* ₹${orderData.total}\n\n*Items:*\n${itemsList}\n\n*Delivery Address:*\n${orderData.address.name}\n${orderData.address.street}\n${orderData.address.city}, ${orderData.address.pincode}\n\n*Estimated Delivery:* 30-40 minutes\n\nThank you for your order! 🍽️`;

      const messageData = {
        messaging_product: "whatsapp",
        to: whatsappNumber,
        type: "text",
        text: {
          body: messageText
        }
      };

      const response = await axios.post(this.apiUrl, messageData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };

    } catch (error) {
      console.error('WhatsApp Order Confirmation Error:', error.response?.data || error.message);
      throw new Error('Failed to send order confirmation');
    }
  }

  /**
   * Send order status update via WhatsApp
   * @param {string} mobile - Mobile number
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} - API response
   */
  async sendStatusUpdate(mobile, orderId, status) {
    try {
      const whatsappNumber = `91${mobile}`;
      
      const statusMessages = {
        'preparing': '👨‍🍳 Your order is being prepared in our kitchen!',
        'ready': '✅ Your order is ready for pickup/delivery!',
        'out-for-delivery': '🚚 Your order is out for delivery!',
        'delivered': '🎉 Your order has been delivered! Enjoy your meal!'
      };

      const statusText = statusMessages[status] || 'Your order status has been updated.';
      
      const messageText = `*Hotel Dhanlakshmi*\n\n*Order ID:* ${orderId}\n\n${statusText}\n\nThank you for choosing us! 🍽️`;

      const messageData = {
        messaging_product: "whatsapp",
        to: whatsappNumber,
        type: "text",
        text: {
          body: messageText
        }
      };

      const response = await axios.post(this.apiUrl, messageData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };

    } catch (error) {
      console.error('WhatsApp Status Update Error:', error.response?.data || error.message);
      throw new Error('Failed to send status update');
    }
  }

  /**
   * Verify webhook signature
   * @param {string} signature - X-Hub-Signature-256 header
   * @param {string} body - Request body
   * @returns {boolean} - Verification result
   */
  verifyWebhook(signature, body) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.WHATSAPP_APP_SECRET)
      .update(body)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }
}

module.exports = new WhatsAppService();
