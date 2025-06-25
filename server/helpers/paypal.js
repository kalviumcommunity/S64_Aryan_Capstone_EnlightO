const paypal = require("paypal-rest-sdk");

// Set up PayPal SDK configuration
try {
  // Verify we have the required environment variables
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_SECRET_ID;
  
  if (!clientId || !clientSecret) {
    console.error('CRITICAL ERROR: Missing PayPal credentials in environment variables');
    console.error('Make sure PAYPAL_CLIENT_ID and PAYPAL_SECRET_ID are set in your .env file');
  }
  
  // Configure the PayPal SDK
  paypal.configure({
    mode: "sandbox", // Change to "live" for production
    client_id: clientId,
    client_secret: clientSecret,
  });
  
  console.log('PayPal SDK configured successfully');
} catch (error) {
  console.error('Failed to configure PayPal SDK:', error);
}

// Helper function to create a payment
const createPayment = (paymentData) => {
  return new Promise((resolve, reject) => {
    paypal.payment.create(paymentData, (error, payment) => {
      if (error) {
        console.error('PayPal payment creation error:', error);
        return reject(error);
      }
      return resolve(payment);
    });
  });
};

// Helper function to execute a payment
const executePayment = (paymentId, executePaymentData) => {
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, executePaymentData, (error, payment) => {
      if (error) {
        console.error('PayPal payment execution error:', error);
        return reject(error);
      }
      return resolve(payment);
    });
  });
};

module.exports = {
  paypal,
  createPayment,
  executePayment
};
