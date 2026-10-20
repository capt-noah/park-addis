"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, Zap } from "lucide-react";

export function HeroIsometricSchematic() {
  const [hoveredBay, setHoveredBay] = useState<string | null>("A-04");

  return (
    <div className="relative w-full max-w-[700px] lg:max-w-none mx-auto select-none">
      {/* Ambient background depth glow */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent blur-3xl -z-10 rounded-full pointer-events-none opacity-80 dark:opacity-40" />

      {/* Main Isometric Urban Stage (Pure Vector SVG for Infinite Sharpness & 3D Depth) */}
      <div className="relative w-full aspect-[4/3.2] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/80 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-xl">
        
        <svg
          viewBox="0 0 820 640"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for asphalt & lighting */}
            <linearGradient id="asphaltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" className="dark:[stop-color:#1e293b]" />
              <stop offset="100%" stopColor="#94a3b8" className="dark:[stop-color:#0f172a]" />
            </linearGradient>

            <linearGradient id="parkingDeckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2e8f0" className="dark:[stop-color:#1e293b]" />
              <stop offset="100%" stopColor="#cbd5e1" className="dark:[stop-color:#131c2e]" />
            </linearGradient>

            <linearGradient id="greenSignGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            {/* Drop Shadow filter for signs and barriers */}
            <filter id="carShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="8" dy="12" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
            </filter>

            <filter id="heavyShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="12" dy="18" stdDeviation="10" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* ========================================================================= */}
          {/* 1. GROUND ASPHALT & ISOMETRIC ROADWAY                                     */}
          {/* ========================================================================= */}
          {/* Main Road Ground Polygon */}
          <polygon
            points="0,180 820,-40 820,460 0,680"
            fill="url(#asphaltGrad)"
          />

          {/* Upper Parking Deck Area Polygon */}
          <polygon
            points="0,180 820,-40 820,230 0,450"
            fill="url(#parkingDeckGrad)"
          />

          {/* Yellow Highway Curb/Edge Stripes */}
          <polygon
            points="0,446 820,226 820,232 0,452"
            fill="#eab308"
            opacity="0.9"
          />
          <polygon
            points="0,670 820,450 820,456 0,676"
            fill="#eab308"
            opacity="0.8"
          />

          {/* ========================================================================= */}
          {/* 2. BOLD TYPOGRAPHY PAINTED ON ROAD SURFACE (Korean/Poster Style)          */}
          {/* ========================================================================= */}
          <g transform="translate(410, 480) rotate(-15) skewX(-32)">
            <text
              x="0"
              y="0"
              fill="#ffffff"
              opacity="0.9"
              fontSize="48"
              fontWeight="900"
              letterSpacing="3"
              fontFamily="var(--font-sans)"
              className="drop-shadow-sm"
            >
              PARK ADDIS
            </text>
            <text
              x="2"
              y="32"
              fill="#ffffff"
              opacity="0.75"
              fontSize="16"
              fontWeight="800"
              letterSpacing="6"
              fontFamily="var(--font-sans)"
            >
              SMART URBAN MOBILITY · BOLE CORRIDOR
            </text>
          </g>

          {/* White Dashed Road Lane Dividers */}
          <g stroke="#ffffff" strokeWidth="3" strokeDasharray="24 20" opacity="0.65">
            <line x1="80" y1="580" x2="780" y2="385" />
          </g>

          {/* ========================================================================= */}
          {/* 3. PARKING STALL MARKINGS & SENSOR BAYS (Upper Zone)                      */}
          {/* ========================================================================= */}
          {/* Stall Divider Lines */}
          <g stroke="#ffffff" strokeWidth="2.5" opacity="0.75">
            {/* Bay 1 */}
            <line x1="120" y1="260" x2="200" y2="215" />
            {/* Bay 2 */}
            <line x1="220" y1="235" x2="300" y2="190" />
            {/* Bay 3 */}
            <line x1="320" y1="210" x2="400" y2="165" />
            {/* Bay 4 (Available) */}
            <line x1="420" y1="185" x2="500" y2="140" />
            {/* Bay 5 */}
            <line x1="520" y1="160" x2="600" y2="115" />
            {/* Bay 6 */}
            <line x1="620" y1="135" x2="700" y2="90" />
          </g>

          {/* Stall Numbers & T-stoppers */}
          <g transform="translate(145, 235) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#ffffff" opacity="0.8" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">P-01</text>
          </g>
          <g transform="translate(245, 210) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#ffffff" opacity="0.8" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">P-02</text>
          </g>
          <g transform="translate(345, 185) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#ffffff" opacity="0.8" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">P-03</text>
          </g>
          <g transform="translate(445, 160) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#2ea67e" opacity="1" fontSize="14" fontWeight="900" fontFamily="var(--font-mono)">P-04 ★</text>
          </g>
          <g transform="translate(545, 135) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#ffffff" opacity="0.8" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">P-05</text>
          </g>
          <g transform="translate(645, 110) rotate(-15) skewX(-32)">
            <text x="0" y="0" fill="#ffffff" opacity="0.8" fontSize="13" fontWeight="800" fontFamily="var(--font-mono)">P-06</text>
          </g>

          {/* ========================================================================= */}
          {/* 4. PARKED 3D ISOMETRIC CARS IN PARKING BAYS (With Shadows & Rich Detail) */}
          {/* ========================================================================= */}

          {/* Car 1: Mint Green Compact Sedan in Bay 01 */}
          <g transform="translate(140, 210)">
            {/* Cast Shadow */}
            <polygon points="-5,15 70,-22 95,-5 20,32" fill="#000000" opacity="0.3" />
            {/* Lower Body */}
            <polygon points="0,0 60,-32 80,-20 20,12" fill="#2ea67e" stroke="#064e3b" strokeWidth="1.5" />
            {/* Side Body Depth */}
            <polygon points="20,12 80,-20 80,-5 20,27" fill="#1b7556" stroke="#064e3b" strokeWidth="1" />
            <polygon points="0,0 20,12 20,27 0,15" fill="#155d44" stroke="#064e3b" strokeWidth="1" />
            {/* Cabin / Roof */}
            <polygon points="12,-6 50,-26 62,-18 24,2" fill="#3dd6a5" stroke="#064e3b" strokeWidth="1" />
            {/* Windshield */}
            <polygon points="12,-6 24,2 22,-2 10,-10" fill="#99f6e4" opacity="0.9" />
            {/* Rear window */}
            <polygon points="50,-26 62,-18 60,-22 48,-30" fill="#99f6e4" opacity="0.9" />
          </g>

          {/* Car 2: Salmon / Coral Sedan in Bay 02 */}
          <g transform="translate(240, 185)">
            <polygon points="-5,15 70,-22 95,-5 20,32" fill="#000000" opacity="0.3" />
            <polygon points="0,0 60,-32 80,-20 20,12" fill="#f87171" stroke="#991b1b" strokeWidth="1.5" />
            <polygon points="20,12 80,-20 80,-5 20,27" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <polygon points="0,0 20,12 20,27 0,15" fill="#b91c1c" stroke="#991b1b" strokeWidth="1" />
            <polygon points="12,-6 50,-26 62,-18 24,2" fill="#fca5a5" stroke="#991b1b" strokeWidth="1" />
            <polygon points="12,-6 24,2 22,-2 10,-10" fill="#fee2e2" opacity="0.9" />
            <polygon points="50,-26 62,-18 60,-22 48,-30" fill="#fee2e2" opacity="0.9" />
          </g>

          {/* Car 3: Dark Slate / Navy SUV in Bay 03 */}
          <g transform="translate(340, 160)">
            <polygon points="-5,15 75,-25 100,-7 20,33" fill="#000000" opacity="0.3" />
            <polygon points="0,0 65,-35 85,-22 20,13" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />
            <polygon points="20,13 85,-22 85,-5 20,30" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            <polygon points="0,0 20,13 20,30 0,17" fill="#0f172a" stroke="#0f172a" strokeWidth="1" />
            {/* Higher SUV Roof */}
            <polygon points="10,-12 55,-36 70,-26 25,-2" fill="#475569" stroke="#0f172a" strokeWidth="1" />
            <polygon points="10,-12 25,-2 23,-7 8,-17" fill="#94a3b8" opacity="0.9" />
          </g>

          {/* BAY 04: OPEN / HIGHLIGHTED FOR USER WITH PULSING BEACON */}
          <g transform="translate(440, 135)" className="cursor-pointer group">
            {/* Glowing Green Bay Floor Polygon */}
            <polygon
              points="0,5 65,-30 85,-18 20,17"
              fill="#2ea67e"
              opacity="0.35"
              className="animate-pulse"
            />
            {/* Dashed Target Box */}
            <polygon
              points="4,3 61,-28 81,-16 24,15"
              fill="none"
              stroke="#2ea67e"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Floating Pulsing Target Ring */}
            <circle cx="42" cy="-6" r="14" fill="none" stroke="#2ea67e" strokeWidth="2" className="animate-ping" style={{ transformOrigin: "42px -6px", animationDuration: "2s" }} />
            <circle cx="42" cy="-6" r="6" fill="#2ea67e" />
            
            {/* Open Tag */}
            <g transform="translate(42, -28)">
              <rect x="-35" y="-11" width="70" height="22" rx="11" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" className="shadow-lg" />
              <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="var(--font-sans)">
                RESERVE
              </text>
            </g>
          </g>

          {/* Car 5: Pearl White Sedan in Bay 05 */}
          <g transform="translate(540, 110)">
            <polygon points="-5,15 70,-22 95,-5 20,32" fill="#000000" opacity="0.3" />
            <polygon points="0,0 60,-32 80,-20 20,12" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="20,12 80,-20 80,-5 20,27" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
            <polygon points="0,0 20,12 20,27 0,15" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="12,-6 50,-26 62,-18 24,2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <polygon points="12,-6 24,2 22,-2 10,-10" fill="#93c5fd" opacity="0.9" />
          </g>

          {/* Car 6: Amber / Orange Hatchback in Bay 06 */}
          <g transform="translate(640, 85)">
            <polygon points="-5,15 70,-22 95,-5 20,32" fill="#000000" opacity="0.3" />
            <polygon points="0,0 60,-32 80,-20 20,12" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="20,12 80,-20 80,-5 20,27" fill="#d97706" stroke="#b45309" strokeWidth="1" />
            <polygon points="0,0 20,12 20,27 0,15" fill="#b45309" stroke="#b45309" strokeWidth="1" />
            <polygon points="12,-6 50,-26 62,-18 24,2" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
          </g>

          {/* ========================================================================= */}
          {/* 5. 3D ISOMETRIC CONCRETE HIGHWAY BARRIER (Runs Diagonally Across)         */}
          {/* ========================================================================= */}
          <g filter="url(#heavyShadow)">
            {/* Barrier Drop Shadow */}
            <polygon points="0,460 820,240 820,265 0,485" fill="#000000" opacity="0.35" />

            {/* Barrier Top Face (Light Gray Concrete) */}
            <polygon
              points="0,420 820,200 820,212 0,432"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            {/* Barrier Front/Side Face (Cast in Solid Concrete Gray with notches) */}
            <polygon
              points="0,432 820,212 820,240 0,460"
              fill="#cbd5e1"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* Barrier Joint Seams */}
            {[100, 220, 340, 460, 580, 700].map((bx, idx) => (
              <line
                key={`b-seam-${idx}`}
                x1={bx}
                y1={432 - (bx * 0.268)}
                x2={bx}
                y2={460 - (bx * 0.268)}
                stroke="#64748b"
                strokeWidth="1.5"
              />
            ))}
          </g>

          {/* ========================================================================= */}
          {/* 6. APPROACHING CARS ON THE HIGHWAY ROADWAY (Lower Zone)                   */}
          {/* ========================================================================= */}

          {/* Approaching Car A: Salmon / Coral Car driving toward parking */}
          <g transform="translate(420, 360)">
            {/* Cast Shadow */}
            <polygon points="-10,20 80,-25 110,-5 20,40" fill="#000000" opacity="0.35" />
            {/* Body */}
            <polygon points="0,0 70,-38 95,-24 25,14" fill="#f87171" stroke="#991b1b" strokeWidth="1.5" />
            <polygon points="25,14 95,-24 95,-7 25,31" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <polygon points="0,0 25,14 25,31 0,17" fill="#b91c1c" stroke="#991b1b" strokeWidth="1" />
            {/* Cabin */}
            <polygon points="14,-8 60,-32 75,-22 29,2" fill="#fca5a5" stroke="#991b1b" strokeWidth="1" />
            <polygon points="14,-8 29,2 27,-3 12,-13" fill="#fee2e2" opacity="0.9" />
          </g>

          {/* Approaching Car B: Crisp White Sedan driving smoothly */}
          <g transform="translate(560, 480)">
            <polygon points="-10,20 80,-25 110,-5 20,40" fill="#000000" opacity="0.35" />
            <polygon points="0,0 70,-38 95,-24 25,14" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="25,14 95,-24 95,-7 25,31" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
            <polygon points="0,0 25,14 25,31 0,17" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <polygon points="14,-8 60,-32 75,-22 29,2" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
            <polygon points="14,-8 29,2 27,-3 12,-13" fill="#93c5fd" opacity="0.9" />
          </g>

          {/* Approaching Car C: Teal / Mint Green Car */}
          <g transform="translate(710, 260)">
            <polygon points="-8,16 65,-22 90,-4 17,34" fill="#000000" opacity="0.3" />
            <polygon points="0,0 60,-32 80,-20 20,12" fill="#2ea67e" stroke="#064e3b" strokeWidth="1.5" />
            <polygon points="20,12 80,-20 80,-5 20,27" fill="#1b7556" stroke="#064e3b" strokeWidth="1" />
            <polygon points="0,0 20,12 20,27 0,15" fill="#155d44" stroke="#064e3b" strokeWidth="1" />
            <polygon points="12,-6 50,-26 62,-18 24,2" fill="#3dd6a5" stroke="#064e3b" strokeWidth="1" />
          </g>

          {/* ========================================================================= */}
          {/* 7. OVERHEAD GREEN HIGHWAY GANTRY SIGNS (Key Depth Element from Reference) */}
          {/* ========================================================================= */}
          <g transform="translate(60, 420)" filter="url(#heavyShadow)">
            {/* Gantry Steel Upright Post */}
            <rect x="0" y="0" width="12" height="150" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" rx="3" />
            <rect x="360" y="-95" width="12" height="150" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" rx="3" />

            {/* Crossbeam */}
            <rect x="0" y="10" width="372" height="14" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" rx="2" />

            {/* Left Green Overhead Highway Sign: "Bole Medhanealem" */}
            <g transform="translate(20, -50)">
              {/* Sign Board */}
              <rect x="0" y="0" width="170" height="95" rx="10" fill="url(#greenSignGrad)" stroke="#ffffff" strokeWidth="3" />
              
              {/* Sign Content */}
              <g transform="translate(12, 18)">
                <rect x="0" y="0" width="22" height="16" rx="4" fill="#0284c7" />
                <text x="11" y="12" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="var(--font-mono)">P</text>
                
                <text x="28" y="13" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="var(--font-sans)">Bole Hub</text>
                <text x="28" y="27" fill="#a7f3d0" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">MEDHANEALEM</text>
              </g>

              {/* Lane Arrows */}
              <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 30 65 L 30 80 M 24 74 L 30 80 L 36 74" />
                <path d="M 140 65 L 140 80 M 134 74 L 140 80 L 146 74" />
              </g>
            </g>

            {/* Right Green Overhead Highway Sign: "ParkAddis / Kazanchis" */}
            <g transform="translate(205, -75)">
              <rect x="0" y="0" width="150" height="95" rx="10" fill="url(#greenSignGrad)" stroke="#ffffff" strokeWidth="3" />
              
              <g transform="translate(12, 18)">
                <rect x="0" y="0" width="22" height="16" rx="4" fill="#ea580c" />
                <text x="11" y="12" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900" fontFamily="var(--font-mono)">45</text>
                
                <text x="28" y="13" fill="#ffffff" fontSize="13" fontWeight="900" fontFamily="var(--font-sans)">ParkAddis</text>
                <text x="28" y="27" fill="#a7f3d0" fontSize="9" fontWeight="700" fontFamily="var(--font-sans)">KAZANCHIS / MESKEL</text>
              </g>

              {/* Turn Arrow */}
              <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <path d="M 125 78 L 135 68 M 125 68 L 135 68 L 135 78" />
              </g>
            </g>
          </g>

        </svg>

      </div>
    </div>
  );
}
