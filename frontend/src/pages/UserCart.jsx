import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { ShoppingCart, Trash2, ShieldCheck, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const UserCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handlePlanChange = (id, plan) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, planType: plan };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.planType === 'yearly' ? item.yearly_price : item.monthly_price;
    return sum + parseFloat(price || 0);
  }, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all payment details.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        cartItems: cartItems.map(item => ({
          softwareId: item.id,
          planType: item.planType || 'monthly'
        }))
      };

      const res = await fetch('http://localhost:5000/api/users/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setCartItems([]);
        localStorage.removeItem('cart');
        setPurchased(true);
        setTimeout(() => {
          navigate('/user-dashboard');
        }, 2000);
      } else {
        alert(data.message || 'Checkout failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <UserSidebar />
      
      <div className="flex-grow ml-64 p-8 lg:p-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center gap-4 mb-8">
            <Link to="/user-marketplace" className="text-slate-500 hover:text-slate-900 transition-colors p-2 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
              <p className="text-slate-500 font-medium">Review your SaaS subscriptions and complete secure checkout.</p>
            </div>
          </div>

          {purchased ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xl shadow-slate-100 max-w-xl mx-auto my-12">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                <CheckCircle className="w-10 h-10 text-green-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Purchase Completed!</h2>
              <p className="text-slate-500 font-medium mb-6">
                Your software licenses have been verified and activated in your Client Portal.
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider animate-pulse">
                Redirecting to dashboard...
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-xl shadow-slate-100">
              <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                Explore the premium SaaS marketplace to add powerful cloud tools to your suite.
              </p>
              <Link to="/user-marketplace" className="bg-[#0B132B] hover:bg-slate-800 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md">
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 pr-4">{item.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto shrink-0 justify-between md:justify-end">
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button 
                          onClick={() => handlePlanChange(item.id, 'monthly')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${(!item.planType || item.planType === 'monthly') ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Monthly
                        </button>
                        <button 
                          onClick={() => handlePlanChange(item.id, 'yearly')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${(item.planType === 'yearly') ? 'bg-[#b45309] text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                          Yearly
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-slate-900">
                          ${item.planType === 'yearly' ? item.yearly_price : item.monthly_price}
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          per {item.planType === 'yearly' ? 'year' : 'month'}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl border border-transparent hover:border-red-100 transition-all shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100 relative">
                <h2 className="text-xl font-black text-slate-900 mb-6">Payment Checkout</h2>
                
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jane Doe" 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text" 
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444" 
                        maxLength="19"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Expiration Date</label>
                      <input 
                        type="text" 
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY" 
                        maxLength="5"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">CVV</label>
                      <input 
                        type="password" 
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••" 
                        maxLength="3"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#b45309] text-sm text-center"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 my-6 pt-6 space-y-3">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900 font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-500">Taxes & Fees</span>
                      <span className="text-slate-900 font-bold">$0.00</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                      <span className="text-slate-900 font-black">Total Price</span>
                      <span className="text-[#b45309] font-black text-xl">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#b45309] hover:bg-amber-800 disabled:bg-slate-300 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-amber-100/60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Complete Purchase
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UserCart;
