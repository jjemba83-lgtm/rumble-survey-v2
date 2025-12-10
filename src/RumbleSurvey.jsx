import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, MapPin, User, Check, AlertCircle } from 'lucide-react';

// --- DATA: NEW GEMINI HERO ALTERNATIVE COMBINES PRICING AND CLASSES,   CONSOLIDATES AMMENITIES TO SINGLE ATTRIBUTE ---
// Note: Prices converted from "P_269" format to integer 269 for consistency
const RAW_DATA = [
  {
    "id": 1,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 2,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 3,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 4,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 5,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 6,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 7,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 8,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 9,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 10,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 11,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 12,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 13,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 14,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 15,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 16,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 17,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 18,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 19,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 20,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 21,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 22,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 23,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 24,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 25,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 26,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 27,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 28,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 29,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 30,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 31,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 32,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 33,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 34,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 35,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 36,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 37,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 38,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 39,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 40,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 41,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 42,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 43,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 44,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 45,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 46,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 47,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 48,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 49,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_GUESTS",
        "booking": "B_14D",
        "commitment": "C_3M"
      }
    ]
  },
  {
    "id": 50,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 51,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 52,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_CHILDCARE",
        "booking": "B_7D",
        "commitment": "C_12M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_1M"
      }
    ]
  },
  {
    "id": 53,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_RECOVERY",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 54,
    "options": [
      {
        "tier": "T_Unl",
        "hero": "H_GUESTS",
        "booking": "B_7D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_8",
        "hero": "H_None",
        "booking": "B_30D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 55,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 56,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 57,
    "options": [
      {
        "tier": "T_4",
        "hero": "H_None",
        "booking": "B_7D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_12",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 58,
    "options": [
      {
        "tier": "T_12",
        "hero": "H_CHILDCARE",
        "booking": "B_30D",
        "commitment": "C_1M"
      },
      {
        "tier": "T_4",
        "hero": "H_GUESTS",
        "booking": "B_30D",
        "commitment": "C_12M"
      }
    ]
  },
  {
    "id": 59,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_30D",
        "commitment": "C_3M"
      },
      {
        "tier": "T_8",
        "hero": "H_CHILDCARE",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  },
  {
    "id": 60,
    "options": [
      {
        "tier": "T_8",
        "hero": "H_RECOVERY",
        "booking": "B_7D",
        "commitment": "C_6M"
      },
      {
        "tier": "T_Unl",
        "hero": "H_None",
        "booking": "B_14D",
        "commitment": "C_6M"
      }
    ]
  }
];

// Helper to decode CSV-style codes to Human Readable text
const decode = (code, type) => {
  const map = {
    tier: {
      T_4: '$119 (4 Classes/Month)',
      T_8: '$179 (8 Classes/Month)',
      T_12: '$219 (12 Classes/Month)',
      T_Unl: '$249 (Unlimited Classes)'
    },
    tierPrice: { T_4: '$119', T_8: '$179', T_12: '$219', T_Unl: '$249' },
    tierClasses: { T_4: '4 Classes/Month', T_8: '8 Classes/Month', T_12: '12 Classes/Month', T_Unl: 'Unlimited Classes' },
    hero: {
      'H_None': 'No Perks',
      'H_GUESTS': '2 Guest Passes/Month',
      'H_RECOVERY': 'Recovery Lounge Access',
      'H_CHILDCARE': 'Childcare Included'
    },
    booking: { 'B_7D': '7-Day Booking', 'B_14D': '14-Day Booking', 'B_30D': '30-Day Booking' },
    commitment: {
      'C_1M': 'Month-to-Month (Standard Rate)',
      'C_3M': '3-Month Commitment (Save 5%)',
      'C_6M': '6-Month Commitment (Save 10%)',
      'C_12M': '12-Month Commitment (Save 15%)'
    },
  };
  return map[type]?.[code] || code;
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

// Survey Card Component - Tap/Click only (no swiping)
const SwipeableCard = ({ question, onChoice, currentIndex }) => {
  const [selectedCard, setSelectedCard] = useState(null); // 0, 1, or null for pulse effect

  // Handle click/tap selection
  const handleCardClick = (index) => {
    setSelectedCard(index);
    // Brief delay for visual feedback before transitioning
    setTimeout(() => {
      setSelectedCard(null);
      onChoice(index);
    }, 300);
  };

  const handleNeitherClick = () => {
    // No visual selection for neither
    setTimeout(() => {
      onChoice(-1);
    }, 150);
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
          <span className="text-4xl font-black text-white italic">{decode(data.tier, 'tierPrice')}</span>
          <span className="text-gray-400 text-sm font-medium">/ month</span>
        </div>

        <div className="h-px bg-gray-800 w-full" />

        <ul className="space-y-3">
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-white font-bold uppercase">{decode(data.tier, 'tierClasses')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-gray-300 text-sm">{decode(data.booking, 'booking')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-gray-300 text-sm">{decode(data.commitment, 'commitment')}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-1 h-1 bg-red-500 rounded-full" />
            <span className="text-yellow-500 text-sm font-bold">{decode(data.hero, 'hero')}</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 w-full py-2 bg-gray-800 group-hover:bg-red-600 text-gray-300 group-hover:text-white text-center font-bold uppercase text-sm rounded transition-colors">
        Select This Plan
      </div>
    </div>
  );

  // Mobile Card Component - Responsive: stacked in portrait, side-by-side in landscape
  const MobileCard = () => (
    <div className="space-y-3">
      {/* Portrait: stacked vertically, Landscape: side-by-side */}
      <div className="flex flex-col landscape:flex-row landscape:gap-3 gap-3">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(idx)}
            className={`bg-gray-900 border-2 rounded-xl p-4 cursor-pointer transition-all flex-1
              ${selectedCard === idx ? 'border-red-600 bg-red-600/10 animate-selection-pulse' : 'border-gray-700 hover:border-gray-500 active:border-red-600'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-gray-500 font-bold uppercase text-xs tracking-wider">
                Option {idx === 0 ? 'A' : 'B'}
              </h4>
              <div className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-bold">
                TAP TO SELECT
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-black text-white italic">{decode(option.tier, 'tierPrice')}</span>
              <span className="text-gray-500 text-sm font-normal">/mo</span>
            </div>

            <div className="h-px bg-gray-800 w-full mb-3" />

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-white font-bold">{decode(option.tier, 'tierClasses')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-gray-300">{decode(option.booking, 'booking')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                <span className="text-gray-300">{decode(option.commitment, 'commitment')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                <span className="text-yellow-500 font-semibold">{decode(option.hero, 'hero')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prominent Neither Button */}
      <button
        onClick={handleNeitherClick}
        className="w-full py-4 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border-2 border-gray-600 rounded-xl text-gray-300 font-bold uppercase tracking-wider text-sm transition-all"
      >
        Neither of These
      </button>

      <p className="text-center text-gray-600 text-xs">Tap a plan to select it</p>
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

      {/* Mobile: Tap-to-select cards (stacked portrait, side-by-side landscape) */}
      <div className="md:hidden mb-6">
        <MobileCard />
      </div>

      {/* Desktop: Side by side cards */}
      <div className="hidden md:flex flex-col gap-4 mb-8">
        <div className="flex flex-row gap-4">
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