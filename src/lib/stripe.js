// src/lib/stripe.js

import { loadStripe } from "@stripe/stripe-js";
// ✅ Use the public key for client-side Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
