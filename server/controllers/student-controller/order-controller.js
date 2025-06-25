const paypalHelper = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses");

// Helper function to get cleaned CLIENT_URL
function getClientUrl() {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  // Remove any trailing characters that might be incorrectly added to the URL
  return clientUrl.replace(/\(.*$/, '');
}

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    // Log all parameters to help with debugging
    console.log("Payment Request Parameters:", { 
      userId, userName, userEmail, instructorId, instructorName,
      courseImage, courseTitle, courseId, coursePricing 
    });

    // Validate required fields
    if (!userId || !courseId || !coursePricing) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
        error: "userId, courseId, and coursePricing are required"
      });
    }

    // Ensure pricing is a valid number
    const price = parseFloat(coursePricing);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price value",
        error: `Price must be a positive number, received: ${coursePricing}`
      });
    }

    const clientUrl = getClientUrl();
    console.log("Using Client URL:", clientUrl);

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${clientUrl}/payment-return`,
        cancel_url: `${clientUrl}/payment-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: courseTitle,
                sku: courseId,
                price: price.toFixed(2),
                currency: 'USD', // Using USD for better PayPal compatibility
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD', // Using USD for better PayPal compatibility
            total: price.toFixed(2),
          },
          description: courseTitle,
        },
      ],
    };

    console.log("PayPal Request Payload:", JSON.stringify(create_payment_json, null, 2));

    try {
      // Use the new promisified createPayment function
      const paymentInfo = await paypalHelper.createPayment(create_payment_json);
      
      const newlyCreatedCourseOrder = new Order({
        userId,
        userName,
        userEmail,
        orderStatus,
        paymentMethod,
        paymentStatus,
        orderDate,
        paymentId,
        payerId,
        instructorId,
        instructorName,
        courseImage,
        courseTitle,
        courseId,
        coursePricing,
      });

      await newlyCreatedCourseOrder.save();

      const approveUrl = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      )?.href;

      if (!approveUrl) {
        throw new Error("Could not find PayPal approval URL in response");
      }

      console.log("PayPal Payment Created, Approval URL:", approveUrl);

      res.status(201).json({
        success: true,
        data: {
          approveUrl,
          orderId: newlyCreatedCourseOrder._id,
        },
      });
    } catch (paypalError) {
      console.log("PayPal Error:", paypalError);
      return res.status(500).json({
        success: false,
        message: "Error while creating PayPal payment!",
        error: paypalError.message || "Unknown PayPal error"
      });
    }
  } catch (err) {
    console.log("Order Creation Error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred during order creation!",
      error: err.message
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    // Validate required parameters
    if (!paymentId || !payerId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
        error: "paymentId, payerId, and orderId are required"
      });
    }

    console.log("Payment Capture Request:", { paymentId, payerId, orderId });
    
    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    try {
      // Execute the PayPal payment
      const executePaymentData = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: 'USD',
              total: parseFloat(order.coursePricing).toFixed(2)
            }
          }
        ]
      };

      // Use the new executePayment function
      const paymentDetails = await paypalHelper.executePayment(paymentId, executePaymentData);
      console.log("Payment executed successfully:", paymentDetails.id);

      // Update the order with payment information
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;

      await order.save();

      //update out student course model
      const studentCourses = await StudentCourses.findOne({
        userId: order.userId,
      });

      if (studentCourses) {
        studentCourses.courses.push({
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        });

        await studentCourses.save();
      } else {
        const newStudentCourses = new StudentCourses({
          userId: order.userId,
          courses: [
            {
              courseId: order.courseId,
              title: order.courseTitle,
              instructorId: order.instructorId,
              instructorName: order.instructorName,
              dateOfPurchase: order.orderDate,
              courseImage: order.courseImage,
            },
          ],
        });

        await newStudentCourses.save();
      }

      //update the course schema students
      await Course.findByIdAndUpdate(order.courseId, {
        $addToSet: {
          students: {
            studentId: order.userId,
            studentName: order.userName,
            studentEmail: order.userEmail,
            paidAmount: order.coursePricing,
          },
        },
      });

      res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } catch (paypalError) {
      console.error("PayPal execution error:", paypalError);
      return res.status(500).json({
        success: false,
        message: "Error executing PayPal payment",
        error: paypalError.message || "Unknown PayPal execution error"
      });
    }
  } catch (err) {
    console.error("Order capture error:", err);
    res.status(500).json({
      success: false,
      message: "Some error occurred during payment capture!",
      error: err.message
    });
  }
};

module.exports = { createOrder, capturePaymentAndFinalizeOrder };
