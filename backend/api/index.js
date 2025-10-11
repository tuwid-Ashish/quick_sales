import dotenv from 'dotenv';
dotenv.config({ path: './env' });

import { ConnectDB } from '../db/index.js';
import { app } from '../app.js';

// Keep track of DB connection state so we only connect once across cold starts
let dbConnected = false;
let dbConnecting = null;

async function ensureDB() {
  if (dbConnected) return;
  if (!dbConnecting) {
    dbConnecting = ConnectDB()
      .then(() => {
        dbConnected = true;
      })
      .catch((err) => {
        // reset so future invocations can retry
        dbConnecting = null;
        console.error('DB connection failed', err);
        throw err;
      });
  }
  await dbConnecting;
}

// Vercel (and other serverless platforms) expect a default export function(req, res)
// An Express `app` is itself a request handler function (req, res) so we can call it
export default async function handler(req, res) {
  try {
    await ensureDB();
  } catch (err) {
    return res.status(500).send('Database connection error');
  }

  // forward the request to the express app
  return app(req, res);
}
