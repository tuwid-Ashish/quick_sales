import axios from 'axios';
import { RAZERPAY_KEY_ID, RAZERPAY_KEY_SECRET } from '../config/constants.js';

const auth = Buffer.from(`${RAZERPAY_KEY_ID}:${RAZERPAY_KEY_SECRET}`).toString('base64');

const razorpayClient = axios.create({
  baseURL: 'https://api.razorpay.com/v1/',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
  },
});


export async function createContact() {
    const contactData = {
        name: shop.contactPerson.name,
        email: shop.contactPerson.email,
        contact: shop.contactPerson.phone,
        type: 'vendor',
        reference_id: shop._id.toString(),
      notes: {
        notes_key_1: 'Tea, Earl Grey, Hot',
      },
    };
  
    try {
      const response = await razorpayClient.post('/contacts', contactData);
      console.log('Contact created successfully:', response.data);
      return response.data.id; // Contact ID
    } catch (error) {
      console.error('Error creating contact:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  
export async function createFundAccount(contactId) {
    const fundAccountData = {
        contact_id: contactId,
        account_type: 'bank_account',
        bank_account: {
          name: bankDetails.accountHolderName,
          ifsc: bankDetails.ifscCode,
          account_number: bankDetails.accountNumber,
        },
      };
  
    try {
      const response = await razorpayClient.post('/fund_accounts', fundAccountData);
      console.log('Fund account created successfully:', response.data);
      return response.data.id; // Fund Account ID
    } catch (error) {
      console.error('Error creating fund account:', error.response ? error.response.data : error.message);
      throw error;
    }
}
export async function fetchContactByRefrenceId(refrenceId) {
    
    try {
      const response = await razorpayClient.post('/contacts', { params: { reference_id: refrenceId } });
      console.log('contact fetch successfully:', response.data);
      return response.data.id; // Fund Account ID
    } catch (error) {
      console.error('Error creating fund account:', error.response ? error.response.data : error.message);
      throw error;
    }
}

export async function fetchFundAccountsByContactId(contactId) {
    try {
      const response = await razorpayClient.get('/fund_accounts', {
        params: { contact_id: contactId },
      });
      const fundAccounts = response.data.items;
      if (fundAccounts.length === 0) {
        console.log('No fund accounts found for contact ID:', contactId);
        return [];
      }
      console.log('Fund accounts:', fundAccounts);
      return fundAccounts;
    } catch (error) {
      console.error('Error fetching fund accounts:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
  