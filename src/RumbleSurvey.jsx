import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MapPin, User, Check, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// --- DATA: V2 PAIRS FROM CSV (Processed) ---
// Note: Prices converted from "P_269" format to integer 269 for consistency
const RAW_DATA = [
  {
    "id": 1,
    "options": [
      { "price": 269, "count": "C_8", "booking": "B_7D", "guest": "G_2M", "perks": "P_10P" },
      { "price": 129, "count": "C_4", "booking": "B_10D", "guest": "G_1Q", "perks": "P_15P" }
    ]
  },
  {
    "id": 2,
    "options": [
      { "price": 229, "count": "C_Unl", "booking": "B_10D", "guest": "G_1M", "perks": "P_None" },
      { "price": 129, "count": "C_8", "booking": "B_14D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 3,
    "options": [
      { "price": 269, "count": "C_12", "booking": "B_30D", "guest": "G_1M", "perks": "P_None" },
      { "price": 229, "count": "C_Unl", "booking": "B_7D", "guest": "G_2M", "perks": "P_5P" }
    ]
  },
  {
    "id": 4,
    "options": [
      { "price": 129, "count": "C_Unl", "booking": "B_10D", "guest": "G_2M", "perks": "P_5P" },
      { "price": 189, "count": "C_8", "booking": "B_14D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 5,
    "options": [
      { "price": 189, "count": "C_8", "booking": "B_10D", "guest": "G_None", "perks": "P_5P" },
      { "price": 129, "count": "C_Unl", "booking": "B_14D", "guest": "G_2M", "perks": "P_10P" }
    ]
  },
  {
    "id": 6,
    "options": [
      { "price": 229, "count": "C_4", "booking": "B_10D", "guest": "G_1M", "perks": "P_5P" },
      { "price": 129, "count": "C_8", "booking": "B_30D", "guest": "G_None", "perks": "P_15P" }
    ]
  },
  {
    "id": 7,
    "options": [
      { "price": 229, "count": "C_Unl", "booking": "B_10D", "guest": "G_1Q", "perks": "P_10P" },
      { "price": 269, "count": "C_12", "booking": "B_7D", "guest": "G_2M", "perks": "P_5P" }
    ]
  },
  {
    "id": 8,
    "options": [
      { "price": 189, "count": "C_Unl", "booking": "B_14D", "guest": "G_None", "perks": "P_15P" },
      { "price": 229, "count": "C_12", "booking": "B_30D", "guest": "G_1M", "perks": "P_10P" }
    ]
  },
  {
    "id": 9,
    "options": [
      { "price": 189, "count": "C_12", "booking": "B_30D", "guest": "G_1M", "perks": "P_5P" },
      { "price": 129, "count": "C_4", "booking": "B_14D", "guest": "G_None", "perks": "P_None" }
    ]
  },
  {
    "id": 10,
    "options": [
      { "price": 129, "count": "C_4", "booking": "B_14D", "guest": "G_None", "perks": "P_5P" },
      { "price": 229, "count": "C_Unl", "booking": "B_30D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 11,
    "options": [
      { "price": 269, "count": "C_12", "booking": "B_10D", "guest": "G_None", "perks": "P_15P" },
      { "price": 229, "count": "C_8", "booking": "B_14D", "guest": "G_1Q", "perks": "P_5P" }
    ]
  },
  {
    "id": 12,
    "options": [
      { "price": 229, "count": "C_8", "booking": "B_7D", "guest": "G_None", "perks": "P_10P" },
      { "price": 189, "count": "C_Unl", "booking": "B_14D", "guest": "G_1M", "perks": "P_5P" }
    ]
  },
  {
    "id": 13,
    "options": [
      { "price": 229, "count": "C_8", "booking": "B_7D", "guest": "G_1Q", "perks": "P_None" },
      { "price": 129, "count": "C_Unl", "booking": "B_10D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 14,
    "options": [
      { "price": 189, "count": "C_4", "booking": "B_7D", "guest": "G_2M", "perks": "P_15P" },
      { "price": 269, "count": "C_8", "booking": "B_14D", "guest": "G_1Q", "perks": "P_5P" }
    ]
  },
  {
    "id": 15,
    "options": [
      { "price": 189, "count": "C_12", "booking": "B_10D", "guest": "G_None", "perks": "P_15P" },
      { "price": 229, "count": "C_4", "booking": "B_14D", "guest": "G_1M", "perks": "P_None" }
    ]
  },
  {
    "id": 16,
    "options": [
      { "price": 269, "count": "C_8", "booking": "B_14D", "guest": "G_1M", "perks": "P_15P" },
      { "price": 189, "count": "C_Unl", "booking": "B_30D", "guest": "G_2M", "perks": "P_None" }
    ]
  },
  {
    "id": 17,
    "options": [
      { "price": 189, "count": "C_4", "booking": "B_14D", "guest": "G_None", "perks": "P_None" },
      { "price": 129, "count": "C_8", "booking": "B_30D", "guest": "G_2M", "perks": "P_5P" }
    ]
  },
  {
    "id": 18,
    "options": [
      { "price": 129, "count": "C_12", "booking": "B_14D", "guest": "G_1M", "perks": "P_None" },
      { "price": 189, "count": "C_8", "booking": "B_7D", "guest": "G_1Q", "perks": "P_5P" }
    ]
  },
  {
    "id": 19,
    "options": [
      { "price": 189, "count": "C_Unl", "booking": "B_7D", "guest": "G_1Q", "perks": "P_10P" },
      { "price": 269, "count": "C_4", "booking": "B_30D", "guest": "G_None", "perks": "P_15P" }
    ]
  },
  {
    "id": 20,
    "options": [
      { "price": 129, "count": "C_4", "booking": "B_30D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 229, "count": "C_12", "booking": "B_14D", "guest": "G_None", "perks": "P_10P" }
    ]
  },
  {
    "id": 21,
    "options": [
      { "price": 229, "count": "C_Unl", "booking": "B_14D", "guest": "G_None", "perks": "P_15P" },
      { "price": 269, "count": "C_4", "booking": "B_10D", "guest": "G_1M", "perks": "P_5P" }
    ]
  },
  {
    "id": 22,
    "options": [
      { "price": 129, "count": "C_12", "booking": "B_30D", "guest": "G_1M", "perks": "P_5P" },
      { "price": 269, "count": "C_Unl", "booking": "B_10D", "guest": "G_2M", "perks": "P_None" }
    ]
  },
  {
    "id": 23,
    "options": [
      { "price": 129, "count": "C_8", "booking": "B_10D", "guest": "G_1Q", "perks": "P_10P" },
      { "price": 229, "count": "C_12", "booking": "B_30D", "guest": "G_None", "perks": "P_15P" }
    ]
  },
  {
    "id": 24,
    "options": [
      { "price": 269, "count": "C_Unl", "booking": "B_30D", "guest": "G_None", "perks": "P_5P" },
      { "price": 229, "count": "C_8", "booking": "B_10D", "guest": "G_1M", "perks": "P_10P" }
    ]
  },
  {
    "id": 25,
    "options": [
      { "price": 189, "count": "C_8", "booking": "B_30D", "guest": "G_2M", "perks": "P_None" },
      { "price": 229, "count": "C_12", "booking": "B_7D", "guest": "G_1Q", "perks": "P_5P" }
    ]
  },
  {
    "id": 26,
    "options": [
      { "price": 229, "count": "C_12", "booking": "B_10D", "guest": "G_2M", "perks": "P_None" },
      { "price": 269, "count": "C_8", "booking": "B_30D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 27,
    "options": [
      { "price": 189, "count": "C_12", "booking": "B_14D", "guest": "G_1M", "perks": "P_10P" },
      { "price": 269, "count": "C_Unl", "booking": "B_7D", "guest": "G_None", "perks": "P_5P" }
    ]
  },
  {
    "id": 28,
    "options": [
      { "price": 269, "count": "C_Unl", "booking": "B_30D", "guest": "G_1Q", "perks": "P_10P" },
      { "price": 189, "count": "C_4", "booking": "B_10D", "guest": "G_None", "perks": "P_None" }
    ]
  },
  {
    "id": 29,
    "options": [
      { "price": 129, "count": "C_12", "booking": "B_7D", "guest": "G_None", "perks": "P_15P" },
      { "price": 189, "count": "C_Unl", "booking": "B_10D", "guest": "G_2M", "perks": "P_5P" }
    ]
  },
  {
    "id": 30,
    "options": [
      { "price": 229, "count": "C_8", "booking": "B_14D", "guest": "G_2M", "perks": "P_None" },
      { "price": 189, "count": "C_12", "booking": "B_7D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 31,
    "options": [
      { "price": 189, "count": "C_4", "booking": "B_30D", "guest": "G_2M", "perks": "P_10P" },
      { "price": 269, "count": "C_12", "booking": "B_14D", "guest": "G_None", "perks": "P_None" }
    ]
  },
  {
    "id": 32,
    "options": [
      { "price": 129, "count": "C_8", "booking": "B_14D", "guest": "G_1M", "perks": "P_5P" },
      { "price": 269, "count": "C_Unl", "booking": "B_10D", "guest": "G_None", "perks": "P_10P" }
    ]
  },
  {
    "id": 33,
    "options": [
      { "price": 269, "count": "C_12", "booking": "B_10D", "guest": "G_None", "perks": "P_10P" },
      { "price": 229, "count": "C_8", "booking": "B_30D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 34,
    "options": [
      { "price": 129, "count": "C_4", "booking": "B_7D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 189, "count": "C_12", "booking": "B_10D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 35,
    "options": [
      { "price": 129, "count": "C_12", "booking": "B_14D", "guest": "G_None", "perks": "P_None" },
      { "price": 269, "count": "C_4", "booking": "B_7D", "guest": "G_1M", "perks": "P_15P" }
    ]
  },
  {
    "id": 36,
    "options": [
      { "price": 229, "count": "C_12", "booking": "B_7D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 129, "count": "C_4", "booking": "B_10D", "guest": "G_2M", "perks": "P_10P" }
    ]
  },
  {
    "id": 37,
    "options": [
      { "price": 229, "count": "C_4", "booking": "B_14D", "guest": "G_1Q", "perks": "P_None" },
      { "price": 129, "count": "C_12", "booking": "B_30D", "guest": "G_1M", "perks": "P_5P" }
    ]
  },
  {
    "id": 38,
    "options": [
      { "price": 269, "count": "C_8", "booking": "B_7D", "guest": "G_1M", "perks": "P_10P" },
      { "price": 229, "count": "C_12", "booking": "B_14D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 39,
    "options": [
      { "price": 189, "count": "C_Unl", "booking": "B_30D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 269, "count": "C_8", "booking": "B_10D", "guest": "G_2M", "perks": "P_None" }
    ]
  },
  {
    "id": 40,
    "options": [
      { "price": 229, "count": "C_Unl", "booking": "B_7D", "guest": "G_None", "perks": "P_None" },
      { "price": 129, "count": "C_8", "booking": "B_14D", "guest": "G_1Q", "perks": "P_10P" }
    ]
  },
  {
    "id": 41,
    "options": [
      { "price": 189, "count": "C_Unl", "booking": "B_14D", "guest": "G_None", "perks": "P_None" },
      { "price": 229, "count": "C_4", "booking": "B_7D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 42,
    "options": [
      { "price": 229, "count": "C_8", "booking": "B_30D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 189, "count": "C_4", "booking": "B_10D", "guest": "G_None", "perks": "P_10P" }
    ]
  },
  {
    "id": 43,
    "options": [
      { "price": 269, "count": "C_4", "booking": "B_10D", "guest": "G_None", "perks": "P_5P" },
      { "price": 129, "count": "C_8", "booking": "B_14D", "guest": "G_2M", "perks": "P_15P" }
    ]
  },
  {
    "id": 44,
    "options": [
      { "price": 129, "count": "C_Unl", "booking": "B_7D", "guest": "G_1M", "perks": "P_15P" },
      { "price": 189, "count": "C_12", "booking": "B_30D", "guest": "G_None", "perks": "P_None" }
    ]
  },
  {
    "id": 45,
    "options": [
      { "price": 269, "count": "C_Unl", "booking": "B_14D", "guest": "G_1Q", "perks": "P_None" },
      { "price": 189, "count": "C_8", "booking": "B_10D", "guest": "G_2M", "perks": "P_10P" }
    ]
  },
  {
    "id": 46,
    "options": [
      { "price": 189, "count": "C_12", "booking": "B_7D", "guest": "G_2M", "perks": "P_15P" },
      { "price": 129, "count": "C_4", "booking": "B_10D", "guest": "G_1Q", "perks": "P_5P" }
    ]
  },
  {
    "id": 47,
    "options": [
      { "price": 229, "count": "C_4", "booking": "B_30D", "guest": "G_None", "perks": "P_10P" },
      { "price": 189, "count": "C_8", "booking": "B_14D", "guest": "G_1M", "perks": "P_None" }
    ]
  },
  {
    "id": 48,
    "options": [
      { "price": 229, "count": "C_Unl", "booking": "B_10D", "guest": "G_1Q", "perks": "P_5P" },
      { "price": 269, "count": "C_8", "booking": "B_30D", "guest": "G_None", "perks": "P_10P" }
    ]
  },
  {
    "id": 49,
    "options": [
      { "price": 189, "count": "C_4", "booking": "B_10D", "guest": "G_1M", "perks": "P_15P" },
      { "price": 269, "count": "C_12", "booking": "B_7D", "guest": "G_2M", "perks": "P_None" }
    ]
  },
  {
    "id": 50,
    "options": [
      { "price": 189, "count": "C_12", "booking": "B_30D", "guest": "G_None", "perks": "P_5P" },
      { "price": 129, "count": "C_Unl", "booking": "B_14D", "guest": "G_1Q", "perks": "P_10P" }
    ]
  }
];

// Helper to decode CSV-style codes to Human Readable text
const decode = (code, type) => {
  const map = {
    price: { 129: '$129', 189: '$189', 229: '$229', 269: '$269' },
    count: { 'C_4': '4 Classes/mo', 'C_8': '8 Classes/mo', 'C_12': '12 Classes/mo', 'C_Unl': 'Unlimited Classes' },
    booking: { 'B_7D': '7-Day Booking', 'B_10D': '10-Day Booking', 'B_14D': '14-Day Booking', 'B_30D': '30-Day Booking' },
    guest: { 'G_None': 'No Guest Passes', 'G_1Q': '1 Guest Pass / Quarter', 'G_1M': '1 Guest Pass / Month', 'G_2M': '2 Guest Passes / Month' },
    perks: { 'P_None': 'No Perks', 'P_5P': '5% Retail Discount', 'P_10P': '10% Off + Free Glove Rental', 'P_15P': '15% Off + Elite Status' }
  };
  return map[type][code] || code;
};

// --- SUB-COMPONENTS (Defined OUTSIDE to prevent re-render focus bugs) ---

const WelcomeScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in">
    <div className="bg-red-600 text-black font-black text-xs px-2 py-1 tracking-widest uppercase mb-4">
      2026 Brand Refresh
    </div>
    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase" style={{fontFamily: 'Impact, sans-serif'}}>
      YOUR GYM.<br/>YOUR RULES.
    </h1>
    <p className="text-gray-300 text-lg max-w-md font-sans">
      We're rethinking how Rumble works. We need 3 minutes of your time to decide the future of our memberships.
    </p>
    
    <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg text-left w-full max-w-md">
      <h3 className="text-yellow-500 font-bold uppercase text-sm mb-2">The Prize</h3>
      <p className="text-white text-sm">Complete the survey to enter a drawing for a <span className="font-bold text-white underline">3-Month Unlimited Membership</span> at your home studio.</p>
    </div>

    <button 
      onClick={onStart}
      className="bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 px-12 text-xl skew-x-[-10deg] transition-all transform hover:scale-105"
    >
      <span className="skew-x-[10deg] block">Get Started</span>
    </button>
  </div>
);

const AlreadyVotedScreen = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-8 animate-fade-in">
    <AlertCircle className="w-24 h-24 text-red-600 mb-4" />
    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white uppercase" style={{fontFamily: 'Impact, sans-serif'}}>
      YOU'VE ALREADY<br/>RUMBLED.
    </h1>
    <p className="text-gray-300 text-lg max-w-md">
      Our records show this device has already submitted a survey. To keep things fair, only one entry per fighter is allowed.
    </p>
    <div className="mt-8 p-4 bg-gray-900 rounded border border-gray-700">
      <p className="text-xs text-gray-500 uppercase font-bold">Think this is an error?</p>
      <p className="text-sm text-white">Contact front desk at your studio.</p>
    </div>
  </div>
);

const DemoScreen = ({ user, setUser, onSubmit }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 space-y-6 w-full max-w-md mx-auto animate-fade-in">
    <h2 className="text-3xl font-black uppercase italic text-white text-center">Tale of the Tape</h2>
    <p className="text-gray-400 text-center">Tell us a little about your Rumble journey.</p>
    
    <form onSubmit={onSubmit} className="w-full space-y-4">
      {/* Hidden Identifier Field (Auto-filled from URL if present) */}
      {user.identifier && user.isFromUrl && (
         <div className="bg-green-900/30 border border-green-600 p-3 rounded mb-4">
           <p className="text-green-400 text-xs font-bold uppercase">Logged in as:</p>
           <p className="text-white text-sm">{user.identifier}</p>
         </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Home Studio</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-red-500 w-5 h-5" />
          <select 
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-3 pl-10 focus:border-red-600 focus:outline-none appearance-none"
            value={user.location}
            onChange={(e) => setUser({...user, location: e.target.value})}
            required
          >
            <option value="">Select Location...</option>
            <option value="Montclair">Montclair</option>
            <option value="Livingston">Livingston</option>
            <option value="Short Hills">Short Hills</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Member Status</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-red-500 w-5 h-5" />
          <select 
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-3 pl-10 focus:border-red-600 focus:outline-none appearance-none"
            value={user.status}
            onChange={(e) => setUser({...user, status: e.target.value})}
            required
          >
            <option value="">Select Status...</option>
            <option value="Current Member">Current Member</option>
            <option value="Prior Member">Prior Member</option>
            <option value="Pack Holder">Class Pack Holder</option>
            <option value="New">Never Rumbled</option>
          </select>
        </div>
      </div>

      {/* Manual Entry if not from URL */}
      {(!user.identifier || !user.isFromUrl) && (
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email or Phone</label>
          <input 
            type="text"
            placeholder="jane@example.com"
            className="w-full bg-gray-900 text-white border border-gray-700 rounded p-3 focus:border-red-600 focus:outline-none"
            value={user.identifier || ''}
            required
            onChange={(e) => setUser({...user, identifier: e.target.value, isFromUrl: false})}
          />
          <p className="text-[10px] text-gray-500 mt-1 uppercase">Required for prize drawing & validation</p>
        </div>
      )}

      <button 
        type="submit"
        className="w-full bg-white text-black font-black uppercase tracking-widest py-4 text-xl mt-6 hover:bg-gray-200 transition-colors"
      >
        Enter Ring
      </button>
    </form>
  </div>
);

// Animated Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  const prevPercentage = (current / total) * 100;

  return (
    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Swipe Card Component for Mobile
const SwipeableCard = ({ question, onChoice, currentIndex }) => {
  const cardRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [exitAnimation, setExitAnimation] = useState(null); // 'left', 'right', 'down', or null
  const [selectedCard, setSelectedCard] = useState(null); // 0, 1, or null for pulse effect

  // Minimum swipe distance to trigger action
  const minSwipeDistance = 80;

  // Threshold to distinguish tap from drag (in pixels)
  const dragThreshold = 15;

  // Track touch start time for tap detection
  const touchStartTime = useRef(0);

  const onTouchStart = (e) => {
    touchStartTime.current = Date.now();
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
    setIsDragging(false);
  };

  const onTouchMove = (e) => {
    if (!touchStart) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - touchStart.x;
    const deltaY = currentY - touchStart.y;

    // Only start "dragging" mode if moved beyond threshold
    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
      setIsDragging(true);
    }

    setTouchEnd({ x: currentX, y: currentY });
    setSwipeOffset({ x: deltaX, y: deltaY });
  };

  const onTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime.current;

    // Calculate total movement
    const totalMove = touchEnd
      ? Math.abs(touchEnd.x - touchStart?.x || 0) + Math.abs(touchEnd.y - touchStart?.y || 0)
      : 0;

    // If it was a quick tap with minimal movement, detect which card was tapped
    if (touchDuration < 300 && totalMove < dragThreshold && touchStart) {
      // Find which element was tapped
      const element = document.elementFromPoint(touchStart.x, touchStart.y);
      if (element) {
        // Traverse up to find the option card
        let target = element;
        while (target && target !== cardRef.current) {
          if (target.dataset && target.dataset.optionIndex !== undefined) {
            const index = parseInt(target.dataset.optionIndex, 10);
            triggerSelection(index, index === 0 ? 'left' : 'right');
            resetTouchState();
            return;
          }
          target = target.parentElement;
        }
      }
      // No card found, just reset
      resetTouchState();
      return;
    }

    // Handle swipe gestures
    if (!touchStart || !touchEnd || !isDragging) {
      resetTouchState();
      return;
    }

    const distanceX = touchEnd.x - touchStart.x;
    const distanceY = touchEnd.y - touchStart.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      // Horizontal swipe detected
      if (distanceX < 0) {
        // Swipe LEFT = Option A
        triggerSelection(0, 'left');
      } else {
        // Swipe RIGHT = Option B
        triggerSelection(1, 'right');
      }
    } else if (!isHorizontalSwipe && distanceY > minSwipeDistance) {
      // Swipe DOWN = Neither
      triggerSelection(-1, 'down');
    } else {
      // Not enough distance, reset
      setSwipeOffset({ x: 0, y: 0 });
    }

    resetTouchState();
  };

  const resetTouchState = () => {
    setIsDragging(false);
    setTouchStart(null);
    setTouchEnd(null);
    setSwipeOffset({ x: 0, y: 0 });
  };

  const triggerSelection = (choice, direction) => {
    setSelectedCard(choice >= 0 ? choice : null);
    setExitAnimation(direction);

    // Wait for animation to complete before calling onChoice
    setTimeout(() => {
      setExitAnimation(null);
      setSelectedCard(null);
      setSwipeOffset({ x: 0, y: 0 });
      onChoice(choice);
    }, 400);
  };

  // Handle click/tap selection (for desktop and tap on mobile)
  const handleCardClick = (index) => {
    const direction = index === 0 ? 'left' : 'right';
    triggerSelection(index, direction);
  };

  const handleNeitherClick = () => {
    triggerSelection(-1, 'down');
  };

  // Calculate rotation based on swipe offset
  const getCardStyle = () => {
    if (exitAnimation) {
      return {}; // Let CSS animation handle it
    }

    if (!isDragging) {
      return { transform: 'translateX(0) rotate(0deg)', transition: 'transform 0.3s ease-out' };
    }

    const rotation = swipeOffset.x * 0.05; // Subtle rotation
    const maxRotation = 15;
    const clampedRotation = Math.max(-maxRotation, Math.min(maxRotation, rotation));

    return {
      transform: `translateX(${swipeOffset.x}px) translateY(${Math.max(0, swipeOffset.y * 0.3)}px) rotate(${clampedRotation}deg)`,
      transition: 'none'
    };
  };

  // Get swipe indicator opacity based on swipe distance
  const getIndicatorOpacity = (direction) => {
    if (!isDragging) return 0;

    const threshold = minSwipeDistance;
    if (direction === 'left') {
      return Math.min(1, Math.max(0, -swipeOffset.x / threshold));
    } else if (direction === 'right') {
      return Math.min(1, Math.max(0, swipeOffset.x / threshold));
    } else if (direction === 'down') {
      return Math.min(1, Math.max(0, swipeOffset.y / threshold));
    }
    return 0;
  };

  const getExitClass = () => {
    if (exitAnimation === 'left') return 'animate-fly-left';
    if (exitAnimation === 'right') return 'animate-fly-right';
    if (exitAnimation === 'down') return 'animate-fly-down';
    return '';
  };

  if (!question) return <div>Loading...</div>;

  // Desktop Card Component
  const OptionCard = ({ data, index }) => (
    <div
      onClick={() => handleCardClick(index)}
      className={`group relative bg-gray-900 border-2 border-gray-800 hover:border-red-600 cursor-pointer transition-all duration-300 flex-1 min-w-[280px] p-6 rounded-xl overflow-hidden
        ${selectedCard === index ? 'animate-selection-pulse border-red-600' : ''}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-800 group-hover:bg-red-600 transition-colors" />

      <h3 className="text-gray-500 font-bold uppercase text-xs mb-4 tracking-wider">Option {index === 0 ? 'A' : 'B'}</h3>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-black text-white italic">{decode(data.price, 'price')}</span>
          <span className="text-gray-400 text-sm font-medium">/ month</span>
        </div>

        <div className="h-px bg-gray-800 w-full" />

        <ul className="space-y-3">
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-white font-bold uppercase">{decode(data.count, 'count')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-gray-300 text-sm">{decode(data.booking, 'booking')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-gray-300 text-sm">{decode(data.guest, 'guest')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-yellow-500 text-sm font-bold">{decode(data.perks, 'perks')}</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 w-full py-2 bg-gray-800 group-hover:bg-red-600 text-gray-300 group-hover:text-white text-center font-bold uppercase text-sm rounded transition-colors">
        Select This Plan
      </div>
    </div>
  );

  // Combined card for mobile swipe
  const SwipeCard = () => (
    <div
      ref={cardRef}
      className={`relative bg-gray-900 border-2 border-gray-800 rounded-xl p-4 ${getExitClass()}`}
      style={{ ...getCardStyle(), touchAction: 'manipulation' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Swipe direction indicators */}
      <div
        className="absolute inset-0 bg-red-600/20 rounded-xl flex items-center justify-start pl-4 pointer-events-none transition-opacity"
        style={{ opacity: getIndicatorOpacity('left') }}
      >
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Option A
        </div>
      </div>

      <div
        className="absolute inset-0 bg-red-600/20 rounded-xl flex items-center justify-end pr-4 pointer-events-none transition-opacity"
        style={{ opacity: getIndicatorOpacity('right') }}
      >
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm flex items-center gap-2">
          Option B <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <div
        className="absolute inset-0 bg-gray-600/20 rounded-xl flex items-end justify-center pb-4 pointer-events-none transition-opacity"
        style={{ opacity: getIndicatorOpacity('down') }}
      >
        <div className="bg-gray-600 text-white px-4 py-2 rounded-lg font-bold uppercase text-sm">
          Neither
        </div>
      </div>

      {/* Card Content - Side by side comparison */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            data-option-index={idx}
            onClick={() => handleCardClick(idx)}
            className={`bg-gray-800/50 rounded-lg p-3 cursor-pointer border-2 transition-all
              ${selectedCard === idx ? 'border-red-600 bg-red-600/10' : 'border-transparent hover:border-gray-600'}`}
            style={{ touchAction: 'manipulation' }}
          >
            <h4 className="text-gray-500 font-bold uppercase text-xs mb-2" data-option-index={idx}>
              Option {idx === 0 ? 'A' : 'B'}
            </h4>
            <div className="text-2xl font-black text-white italic mb-2" data-option-index={idx}>
              {decode(option.price, 'price')}
              <span className="text-gray-500 text-xs font-normal">/mo</span>
            </div>
            <div className="space-y-1 text-xs" data-option-index={idx}>
              <div className="text-white font-semibold">{decode(option.count, 'count')}</div>
              <div className="text-gray-400">{decode(option.booking, 'booking')}</div>
              <div className="text-gray-400">{decode(option.guest, 'guest')}</div>
              <div className="text-yellow-500 font-semibold">{decode(option.perks, 'perks')}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Swipe hint */}
      <div className="mt-4 text-center text-gray-500 text-xs uppercase tracking-wide flex items-center justify-center gap-2">
        <ChevronLeft className="w-4 h-4 animate-swipe-hint" style={{ animationDirection: 'reverse' }} />
        <span>Swipe or tap to choose</span>
        <ChevronRight className="w-4 h-4 animate-swipe-hint" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto p-4 animate-slide-up">
      {/* Header with Round info */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl md:text-4xl font-black italic text-white uppercase">Round {currentIndex + 1}</h2>
        <div className="text-red-500 font-bold font-mono text-lg">
           {currentIndex + 1} / 8
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="mb-6">
        <ProgressBar current={currentIndex} total={8} />
      </div>

      <p className="text-gray-400 mb-4 text-center md:text-left">
        Which membership would you choose?
      </p>

      {/* Mobile: Swipeable stacked card */}
      <div className="md:hidden mb-6">
        <SwipeCard />
      </div>

      {/* Desktop: Side by side cards */}
      <div className="hidden md:flex flex-row gap-4 mb-8">
        <OptionCard data={question.options[0]} index={0} />

        <div className="flex items-center justify-center font-black text-gray-700 italic text-2xl px-4">
          VS
        </div>

        <OptionCard data={question.options[1]} index={1} />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleNeitherClick}
          className="text-gray-500 hover:text-white border-b border-gray-600 hover:border-white pb-1 transition-colors text-sm uppercase tracking-widest font-bold"
        >
          I wouldn't choose either of these
        </button>
      </div>
    </div>
  );
};

// Alias for backward compatibility
const SurveyScreen = SwipeableCard;

// Confetti Component
const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    const colors = ['#DC2626', '#EAB308', '#FFFFFF', '#22C55E', '#3B82F6', '#EC4899'];
    const newParticles = [];

    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
        shape: Math.random() > 0.5 ? 'square' : 'circle'
      });
    }

    setParticles(newParticles);

    // Clean up after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti-piece"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: particle.shape === 'circle' ? '50%' : '2px',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </>
  );
};

const ThankYouScreen = ({ user }) => {
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6 animate-fade-in relative overflow-hidden">
      {/* Confetti celebration */}
      {showConfetti && <Confetti />}

      {/* Trophy with bounce animation */}
      <div className="animate-trophy-bounce">
        <Trophy className="w-24 h-24 text-yellow-500 mb-4 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(234, 179, 8, 0.5))' }} />
      </div>

      <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
        KNOCKOUT.
      </h1>
      <p className="text-gray-300 text-lg max-w-md">
        You've completed the survey. Your input is shaping the future of Rumble NJ.
      </p>
      <div className="bg-green-900/30 border border-green-600 text-green-400 p-4 rounded-lg flex items-center space-x-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <Check className="w-5 h-5" />
        <span className="font-bold">Entry Confirmed for {user.location}</span>
      </div>
      <p className="text-xs text-gray-600 mt-8">
        Winners will be contacted via email on Feb 1st.
      </p>
    </div>
  );
};


export default function RumbleSurveyApp() {
  const [screen, setScreen] = useState('welcome'); // welcome, demo, survey, thank, already-voted
  const [user, setUser] = useState({ location: '', status: '', identifier: '', isFromUrl: false });
  const [surveySet, setSurveySet] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  // Initialize: Select 8 random questions AND Check for URL Params/Local Storage
  useEffect(() => {
    // 1. Shuffle Questions
    const shuffled = [...RAW_DATA].sort(() => 0.5 - Math.random());
    setSurveySet(shuffled.slice(0, 8));

    // 2. Check Local Storage (The Digital Handstamp)
    const hasVoted = localStorage.getItem('rumble_voted');
    if (hasVoted) {
      setScreen('already-voted');
      return;
    }

    // 3. Check URL Params for "Smart Link" (e.g. ?user=email@gmail.com)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('user') || params.get('id') || params.get('email');
    
    if (userId) {
      setUser(prev => ({ ...prev, identifier: userId, isFromUrl: true }));
    }
  }, []);

  const handleStart = () => {
    if (screen === 'already-voted') return;
    setScreen('demo');
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (user.location && user.status && user.identifier) {
      setScreen('survey');
    }
  };

  const handleChoice = (choice) => {
    const newAnswers = [...answers, { 
      questionId: surveySet[currentIndex].id, 
      choice: choice // 0 (Option A), 1 (Option B), or -1 (None)
    }];
    setAnswers(newAnswers);

    if (currentIndex < 7) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Survey Complete
      setScreen('thank');
      localStorage.setItem('rumble_voted', 'true');
      console.log("Survey Complete:", { user, data: newAnswers });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-red-600 selection:text-white">
      {/* Top Bar / Logo Area */}
      <div className="w-full p-4 border-b border-gray-900 flex justify-center">
         <span className="font-black tracking-[0.2em] text-xl md:text-2xl italic">RUMBLE</span>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto h-[calc(100vh-80px)] overflow-y-auto">
        {screen === 'welcome' && <WelcomeScreen onStart={handleStart} />}
        {screen === 'already-voted' && <AlreadyVotedScreen />}
        {screen === 'demo' && (
          <DemoScreen 
            user={user} 
            setUser={setUser} 
            onSubmit={handleDemoSubmit} 
          />
        )}
        {screen === 'survey' && (
          <SurveyScreen 
            question={surveySet[currentIndex]} 
            currentIndex={currentIndex} 
            onChoice={handleChoice} 
          />
        )}
        {screen === 'thank' && <ThankYouScreen user={user} />}
      </main>
    </div>
  );
}