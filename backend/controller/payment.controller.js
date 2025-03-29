import crypto from "node:crypto";
import Product from "../models/products.model.js";
import { ApiError } from "../utils/ApiError.js";
import Order from "../models/order.model.js";
import { CreateRazerpayInstance } from "../services/payments.js";
import {
  DOMAIN_URL,
  RAZERPAY_KEY_ID,
  RAZERPAY_KEY_SECRET,
} from "../config/constants.js";
import Shop from "../models/shop.model.js";
import { Commission } from "../models/Commission.model.js";
import { createContact, fetchContactByRefrenceId, fetchFundAccountsByContactId } from "../services/payout_to_refreal.js";

export const CreateOrder = async (req, res) => {
  try {
    const instance = CreateRazerpayInstance();
    const { id, name, phone, email, referral, address } = req.body;
    // Validate required fields
    if (!id || !name || !phone || !address) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Product ID, customer name, and phone number are required"
          )
        );
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    let agent = null;
    console.log("the data in refreal", referral);
    if (referral) {
      agent = await Shop.findOne({
        status: "success",
        isActive: true,
        referralCode: referral,
      });
      if (!agent) {
        console.warn(`Invalid referral code: ${referral}`);
      }
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    // Create order document first
    const newOrder = await Order.create(
      {
        products: [
          {
            product: product.id,
            priceAtPurchase: product.price,
            quantity: 1,
          },
        ],
        totalAmount: product.price,
        referralCode: agent ? referral : undefined, // Only include referralCode if agent is valid
        shop: agent || undefined,
        shippingAddress: address,
        customer: {
          name,
          phoneNumber: phone,
          email: email || undefined,
        },
        paymentStatus: "pending",
      },
      { session }
    );
    console.log();

    // Create Razorpay order
    const razorpayOptions = {
      amount: product.price * 100, // Convert to paise
      currency: "INR",
      receipt: newOrder._id.toString(), // Link Razorpay order to our order
      notes: {
        productName: product.name,
        customerName: name,
        customerPhone: phone,
      },
    };

    // Create Razorpay order using Promise
    const razorpayOrder = await new Promise((resolve, reject) => {
      instance.orders.create(razorpayOptions, (err, order) => {
        if (err) reject(err);
        else resolve(order);
      });
    });

    await session.commitTransaction();
    session.endSession();

    // Return combined response
    return res.status(200).json({
      success: true,
      key_id: RAZERPAY_KEY_ID,
      orderId: newOrder._id,
      razorpayOrder,
      product: {
        name: product.name,
        price: product.price,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order creation error:", error);
    return res.status(500).json(new ApiError(500, "Failed to create order"));
  }
};

export const CapturePayment = async (req, res) => {
  try {
    const instance = CreateRazerpayInstance();
    console.log("the object we setup mann :", req, req.body);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      console.error("Missing payment details in request body");
      return res
        .status(400)
        .redirect(`${DOMAIN_URL}/payment-status?status=failed`);
    }

    // Verify the payment signature
    const generated_signature = crypto
      .createHmac("sha256", RAZERPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .rediect(
          `${DOMAIN_URL}/payment-status?status=failed&order_id=${razorpay_order_id}`
        );
    }

    const razorpay_order_details = await instance.orders.fetch(
      razorpay_order_id
    );
    const razorpay_payment_details = await instance.payments.fetch(
      razorpay_payment_id
    );

    if (
      razorpay_payment_details.status !== "captured" ||
      razorpay_order_details.status !== "paid"
    ) {
      console.error("Payment or order status invalid:", {
        payment_status: razorpay_payment_details.status,
        order_status: razorpay_order_details.status,
      });
      const failorder = await Order.findByIdAndUpdate(
        razorpay_order_details.receipt,
        {
          paymentStatus: "failed",
          paymentDetails: {
            razorpayPaymentId: razorpay_payment_id,
            verificationStatus: "capture_failed",
            error: "not a vaild payment status",
            captureResponse: razorpay_payment_details,
          },
        }
      );

      if (!failorder) {
        console.error("Order not found in database");
        return res.redirect(
          `${DOMAIN_URL}/payment-status?status=failed&order_id=${"null"}`
        );
      }

      return res
        .status(400)
        .redirect(
          `${DOMAIN_URL}/payment-status?status=failed&order_id=${razorpay_order_details.receipt}`
        );
    }

    // Update order status based on payment capture
    const updatedOrder = await Order.findByIdAndUpdate(
      razorpay_order_details.receipt,
      {
        paymentStatus: "completed",
        paymentDetails: {
          razorpayPaymentId: razorpay_payment_id,
          verificationStatus: "success",
          captureResponse: razorpay_order_details,
        },
      },
      { new: true }
    );

    if (updatedOrder.referralCode) {
      const shop = await Shop.findById(updatedOrder.shop);
      if (shop) {
        const commissionAmount = (updatedOrder.totalAmount * shop.commissionRate) / 100;
        const check_fund = fetchContactByRefrenceId(shop._id.toString())
        let fund_ac = null 
        if(!check_fund){
            check_fund = createContact(shop)
            const fund_ac = createFundAccount(check_fund)
        }  

        const newCommission = new Commission({
          shop: shop._id,
          order: updatedOrder._id,
          amount: commissionAmount,
        });
        
        const savedCommission = await newCommission.save();

    }
 
    }

    if (!updatedOrder) {
      console.error("Order not found in database");
      return res.redirect(
        `${DOMAIN_URL}/payment-status?status=failed&order_id=${"null"}`
      );
    }

    return res.redirect(
      `${DOMAIN_URL}/payment-status?status=success&order_id=${updatedOrder._id}`
    );
  } catch (error) {
    console.error("Payment capture error:", error);
    return res.redirect(
      `${DOMAIN_URL}/payment-status?status=failed&order_id=${"null"}`
    );
  }
};

export const RefundPayment = async (req, res) => {
  try {
    const instance = CreateRazerpayInstance();
    const { payment_id, amount } = req.body;
    instance.payments.refund(payment_id, amount, (err, refund) => {
      if (err) {
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      return res.status(200).json(refund);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const GetPayment = async (req, res) => {
  try {
    const instance = CreateRazerpayInstance();
    const { payment_id } = req.params;
    instance.payments.fetch(payment_id, (err, payment) => {
      if (err) {
        return res.status(500).json({
          message: "Something went wrong",
        });
      }
      return res.status(200).json(payment);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};



  // Function to process commission after admin approval
export const processCommission = async (commissionId) => {
    try {
      const commission = await Commission.findById(commissionId).populate('shop');
      if (!commission || commission.status !== 'pending') {
        throw new Error('Invalid or already processed commission.');
      }
  
      const shop = commission.shop;
  
      // Check if contact already exists
      let contact = await fetchContactByRefrenceId(shop._id.toString());
      if (!contact) {
        // Create new contact if not found
        contact = await createContact(shop);
      }
  
      // Check if fund account already exists
      let fundAccount = await fetchFundAccountsByContactId(contact.id);
      if (!fundAccount) {
        // Create new fund account if not found
        fundAccount = await createFundAccount(contact.id, shop.bankDetails);
      }
  
      // Create a payout after admin approval
      // This function should be called after the admin has approved the commission
      const payout = await razorpay.payouts.create({
        account_number: process.env.RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: fundAccount.id,
        amount: commission.amount * 100, // Amount in paise
        currency: 'INR',
        mode: 'IMPS',
        purpose: 'commission_payment',
        queue_if_low_balance: true,
        reference_id: commission._id.toString(),
        narration: `Commission for order ${commission.order}`,
      });
  
      // Update commission status
      commission.status = 'paid';
      commission.payoutId = payout.id;
      await commission.save();
  
      console.log(`Payout ${payout.id} created successfully for commission ${commission._id}.`);
    } catch (error) {
      console.error('Error processing commission payout:', error);
    }
  };