
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiService } from '../services/apiService';

// ** IMPORTANT: Replace with your Stripe PUBLISHABLE key (pk_test_...) **
// Get it from: https://dashboard.stripe.com/apikeys
const stripePromise = loadStripe('pk_test_51T5Px7Cv0BsmAxMureeG4tN3jvIr0HSwD4QoQxaYb287lmQ36bxGwqxtDT8SzoC8IHYwHfPHuhh3hCqJTqME9u2300pAPObC5E');

// =====================================================
// CARD ELEMENT STYLING
// =====================================================
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a2332',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': { color: '#9ca3af' },
      padding: '16px',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: false,
};


// =====================================================
// CHECKOUT FORM (inside Stripe Elements provider)
// =====================================================
const CheckoutForm: React.FC<{
  amount: string;
  frequency: 'one-time' | 'monthly';
  program: string;
}> = ({ amount, frequency, program }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [donationAmount, setDonationAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError('Payment system is loading. Please wait...');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1) {
      setError('Please enter a valid donation amount (minimum $1).');
      return;
    }
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create PaymentIntent on the server
      const { clientSecret } = await apiService.createPaymentIntent({
        amount: numAmount,
        first_name: firstName,
        last_name: lastName,
        email: email,
        frequency: frequency,
        program: program,
      });

      // Step 2: Confirm the payment with Stripe.js
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError('Card input not found.');
        setProcessing(false);
        return;
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement as any,
          billing_details: {
            name: `${firstName} ${lastName}`,
            email: email,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed. Please try again.');
        setProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Step 3: Confirm on our backend
        await apiService.confirmDonation(paymentIntent.id);
        setDonationAmount(numAmount);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="text-center py-16 px-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <i className="fas fa-check text-green-500 text-4xl"></i>
        </div>
        <h3 className="text-3xl font-bold text-primary mb-4">Thank You!</h3>
        <p className="text-gray-600 text-lg mb-2">
          Your donation of <span className="font-bold text-gold">${donationAmount.toFixed(2)}</span> has been received.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Allocated to: <span className="font-semibold">{program}</span>
        </p>
        <p className="text-gray-500 italic text-sm max-w-md mx-auto">
          "And do not forget to do good and to share with others, for with such sacrifices God is pleased." — Hebrews 13:16
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-10 bg-primary text-white font-bold px-10 py-4 rounded-full hover:bg-secondary transition-all"
        >
          MAKE ANOTHER DONATION
        </button>
      </div>
    );
  }

  return (
    <form className="p-8 md:p-12 space-y-8" onSubmit={handleSubmit}>
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-4 col-span-1 md:col-span-2 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Stripe Card Element */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-4">Card Details</label>
        <div className="p-4 rounded-xl border-2 border-gray-200 focus-within:border-primary transition-colors bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center">
          <i className="fas fa-lock text-green-500 mr-2"></i>
          Secured by Stripe — Your card details never touch our servers.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start">
          <i className="fas fa-exclamation-circle mt-0.5 mr-3 text-red-500"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full font-bold py-6 rounded-2xl transition-all transform shadow-xl text-xl ${processing
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-primary text-white hover:bg-secondary hover:scale-[1.02]'
          }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            PROCESSING...
          </span>
        ) : (
          `DONATE $${parseFloat(amount) > 0 ? parseFloat(amount).toFixed(2) : '0.00'}`
        )}
      </button>

      <div className="text-center text-xs text-gray-400 mt-4">
        <i className="fab fa-stripe mx-1 text-lg text-gray-500 align-middle"></i> Powered by Stripe
      </div>
    </form>
  );
};


// =====================================================
// MAIN DONATE PAGE
// =====================================================
const Donate: React.FC = () => {
  const location = useLocation();
  const [amount, setAmount] = useState<string>('50');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [program, setProgram] = useState('General Fund (Most Needed)');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedProgram = params.get('program');
    if (selectedProgram) {
      setProgram(selectedProgram);
      setTimeout(() => {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  const presetAmounts = ['25', '50', '100', '250', '500'];

  const getImpactMessage = (val: string) => {
    const num = parseInt(val);
    if (isNaN(num)) return "Every dollar makes a difference.";
    if (num < 50) return `Your donation of $${num} can provide meals for ${Math.floor(num / 5)} children.`;
    if (num < 100) return `Your donation of $${num} provides school supplies for 2 students.`;
    if (num < 250) return `Your donation of $${num} funds a weekly widow support package.`;
    return `Your donation of $${num} sponsors a child's full educational needs for a term.`;
  };

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Context & Inspiration */}
          <div className="animate-count">
            <h1 className="text-gold font-bold uppercase tracking-widest text-sm mb-4">Change a Life Today</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight">Your Generosity Creates Miracles</h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Every donation to Giving Without Limit feeds a hungry child, supports a widow, educates a student, or restores someone from addiction. We believe in total transparency—100% of program-allocated donations go directly to the field.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Secure Payments</h4>
                  <p className="text-sm text-gray-500">Industry-standard encryption powered by Stripe.</p>
                </div>
              </div>
              <div className="flex items-start bg-white p-6 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 mr-4">
                  <i className="fas fa-hand-holding-heart"></i>
                </div>
                <div>
                  <h4 className="font-bold text-primary">Program Choice</h4>
                  <p className="text-sm text-gray-500">You decide where your money makes an impact.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl">
              <h4 className="text-xl font-bold mb-4">Other Ways to Give</h4>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span>Zelle (US)</span>
                  <span className="font-bold text-gold">312-479-3840</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span>Contact (NGR)</span>
                  <span className="font-bold text-gold">0906-333-3525</span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span>Bank Transfer</span>
                  <span className="text-xs text-gray-300">Request details via email</span>
                </li>
              </ul>
              <p className="text-xs text-gray-400 mt-6 text-center italic">
                Giving Without Limit is a registered NGO dedicated to serving humanity till Jesus comes.
              </p>
            </div>
          </div>

          {/* Right Column: Donation Form */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-count">
            <div className="bg-gold p-6 text-primary text-center">
              <div className="text-sm font-bold uppercase tracking-widest mb-1">Impact Preview</div>
              <div className="text-lg font-bold">{getImpactMessage(amount)}</div>
            </div>

            {/* Amount & Frequency Controls (outside Stripe Elements) */}
            <div className="p-8 md:p-12 pb-0 space-y-8">
              {/* Frequency Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => setFrequency('one-time')}
                  className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${frequency === 'one-time' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary'}`}
                >
                  Give Once
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${frequency === 'monthly' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-primary'}`}
                >
                  Monthly
                </button>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Choose Amount</label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {presetAmounts.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-xl font-bold border-2 transition-all ${amount === val ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500 hover:border-gold'}`}
                    >
                      ${val}
                    </button>
                  ))}
                  <div className="relative col-span-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      placeholder="Other"
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full py-4 pl-8 pr-4 rounded-xl font-bold border-2 border-gray-200 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Program Allocation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Allocate To</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none text-gray-700"
                >
                  <option>General Fund (Most Needed)</option>
                  <option>Feeding Program</option>
                  <option>Addiction Recovery</option>
                  <option>Widow Support</option>
                  <option>Educational Support</option>
                  <option>Kids Club</option>
                </select>
              </div>
            </div>

            {/* Stripe Elements Checkout Form */}
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} frequency={frequency} program={program} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
