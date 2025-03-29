import Razorpay from 'razorpay'
import { RAZERPAY_KEY_ID, RAZERPAY_KEY_SECRET } from '../config/constants.js'
import { Commission } from '../models/Commission.model.js'

export const CreateRazerpayInstance = () => {
    return new Razorpay({
        key_id: RAZERPAY_KEY_ID,
        key_secret: RAZERPAY_KEY_SECRET,
    })
    }

    


const razorpay = CreateRazerpayInstance()


// Function to fetch an existing contact by reference ID
const fetchContactByReferenceId = async (referenceId) => {
    try {
      const contacts = await razorpay.contacts.all({ reference_id: referenceId });
      return contacts.items.length ? contacts.items[0] : null;
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  };
  
  // Function to fetch an existing fund account by contact ID
  const fetchFundAccountByContactId = async (contactId) => {
    try {
      const fundAccounts = await razorpay.fundAccount.fetch({ contact: contactId });
      return fundAccounts.items.length ? fundAccounts.items[0] : null;
    } catch (error) {
      console.error('Error fetching fund account:', error);
      return null;
    }
  };
  
  // Function to create a new contact
  const createContact = async (shop) => {
    try {
      const contact = await razorpay.contacts.create({
        name: shop.contactPerson.name,
        email: shop.contactPerson.email,
        contact: shop.contactPerson.phone,
        type: 'vendor',
        reference_id: shop._id.toString(),
      });
      return contact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  };
  
  // Function to create a new fund account
  const createFundAccount = async (contactId, bankDetails) => {
    try {
      const fundAccount = await razorpay.fundAccount.create({
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          name: bankDetails.accountHolderName,
          ifsc: bankDetails.ifscCode,
          account_number: bankDetails.accountNumber,
        },
      });
      return fundAccount;
    } catch (error) {
      console.error('Error creating fund account:', error);
      throw error;
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
      let contact = await fetchContactByReferenceId(shop._id.toString());
      if (!contact) {
        // Create new contact if not found
        contact = await createContact(shop);
      }
  
      // Check if fund account already exists
      let fundAccount = await fetchFundAccountByContactId(contact.id);
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