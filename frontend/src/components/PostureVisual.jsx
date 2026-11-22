import React from "react";

/**
 * PostureVisual renders accurate, beautiful, SVG-drawn anatomical posture illustrations
 * tailored specifically for each yoga pose, stretch, meditation step, and PMR routine.
 */
const PostureVisual = ({ exerciseId, stepNumber = 1, className = "", color = "#6B58CD" }) => {
  // Return specific SVG posture based on exerciseId and stepNumber
  const renderPosture = () => {
    switch (exerciseId) {
      // ══════════════════════════════════════════════════════════
      // 1. CHILD'S POSE (BALASANA)
      // ══════════════════════════════════════════════════════════
      case "childs-pose":
        if (stepNumber === 1) {
          // Kneeling upright, foundation
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <path d="M40 180h220" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
              {/* Mat */}
              <rect x="30" y="176" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Kneeling Body Upright */}
              <circle cx="150" cy="65" r="14" fill="#A99BEA" stroke="#6B58CD" strokeWidth="3" />
              <path d="M150 79v45" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" />
              {/* Thighs to knees */}
              <path d="M150 124l-35 30h40" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Feet under hips */}
              <path d="M115 154l-15 22" stroke="#6B58CD" strokeWidth="7" strokeLinecap="round" />
              {/* Hands resting on knees */}
              <path d="M150 92l-22 35" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" />
              {/* Calm breath aura */}
              <circle cx="150" cy="65" r="26" stroke="#A99BEA" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            </svg>
          );
        } else if (stepNumber === 2) {
          // Hinging forward, walking hands
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="30" y="176" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Head lowering */}
              <circle cx="195" cy="115" r="14" fill="#A99BEA" stroke="#6B58CD" strokeWidth="3" />
              {/* Diagonal folded spine */}
              <path d="M100 148c20-25 50-30 90-26" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" />
              {/* Folded legs on mat */}
              <path d="M100 148l-25 10 35 18h20" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Arms walking out */}
              <path d="M175 125l45 35 25 16" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" />
            </svg>
          );
        } else {
          // Full Child's Pose (Forehead on floor, arms reaching forward or beside hips)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="25" y="174" width="250" height="6" rx="3" fill="#DCD6F7" />
              {/* Gentle soothing energy rings */}
              <ellipse cx="140" cy="155" rx="90" ry="25" fill="rgba(169, 155, 234, 0.12)" />
              {/* Head resting on mat */}
              <circle cx="215" cy="162" r="13" fill="#A99BEA" stroke="#6B58CD" strokeWidth="3" />
              {/* Rounded spine resting over thighs */}
              <path d="M95 152c15-30 65-35 110 5" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" />
              {/* Folded thighs & shins on floor */}
              <path d="M95 152l-22 8 30 14h30" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              {/* Arms stretched long forward on mat */}
              <path d="M185 135l40 32 35 7" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" />
              {/* Breath expansion waves on lower back */}
              <path d="M125 108c10-8 25-8 35 0" stroke="#B8E6D5" strokeWidth="3" strokeLinecap="round" />
              <path d="M120 98c15-10 35-10 50 0" stroke="#B8E6D5" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>
          );
        }

      // ══════════════════════════════════════════════════════════
      // 2. CAT-COW POSE (MARJARYASANA-BITILASANA)
      // ══════════════════════════════════════════════════════════
      case "cat-cow":
        if (stepNumber === 1) {
          // Tabletop neutral position
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="30" y="174" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Head neutral */}
              <circle cx="215" cy="100" r="13" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="3" />
              {/* Flat spine */}
              <path d="M100 115h105" stroke="#2D8A68" strokeWidth="8" strokeLinecap="round" />
              {/* Arms vertical */}
              <path d="M195 115v59" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" />
              {/* Thighs vertical and feet on mat */}
              <path d="M100 115v59l-20 0" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              {/* Neutral balance grid */}
              <line x1="95" y1="115" x2="215" y2="115" stroke="#A99BEA" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
          );
        } else if (stepNumber === 2) {
          // COW POSE (Belly dipped, head lifted up, chest open)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="30" y="174" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Head tilted up into inhale */}
              <circle cx="225" cy="85" r="14" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="3" />
              {/* Dipped concave belly (Cow) */}
              <path d="M100 110c25 28 75 28 115-18" stroke="#2D8A68" strokeWidth="9" strokeLinecap="round" />
              {/* Front arms vertical supporting chest */}
              <path d="M205 105v69" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" />
              {/* Back hips and legs */}
              <path d="M100 110v64l-20 0" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              {/* Inhale heart lift arrow */}
              <path d="M155 140c10-18 25-25 40-30" stroke="#A99BEA" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3" />
              <polygon points="195,110 200,103 192,105" fill="#A99BEA" />
              <text x="145" y="65" fill="#2D8A68" fontSize="11" fontWeight="700">INHALING (COW)</text>
            </svg>
          );
        } else if (stepNumber === 3) {
          // CAT POSE (Spine rounded UP like an arched cat, head dropped)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="30" y="174" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Head tucked down */}
              <circle cx="205" cy="135" r="14" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="3" />
              {/* High convex rounded spine (Cat) */}
              <path d="M100 120c25-45 75-45 105 10" stroke="#2D8A68" strokeWidth="9" strokeLinecap="round" />
              {/* Front arms pressing firmly into floor */}
              <path d="M195 125v49" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" />
              {/* Back hips & legs */}
              <path d="M100 120v54l-20 0" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              {/* Exhale tuck arrow */}
              <path d="M150 110c0-15 0-25 0-30" stroke="#F4CDBB" strokeWidth="3" strokeLinecap="round" />
              <polygon points="150,75 145,84 155,84" fill="#F4CDBB" />
              <text x="140" y="65" fill="#C96D46" fontSize="11" fontWeight="700">EXHALING (CAT)</text>
            </svg>
          );
        } else {
          // Rhythmic Flow waves
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <rect x="30" y="174" width="240" height="6" rx="3" fill="#DCD6F7" />
              {/* Both Cat & Cow wave outlines showing flow */}
              <path d="M100 110c25 24 75 24 110-14" stroke="#B8E6D5" strokeWidth="6" strokeLinecap="round" />
              <path d="M100 120c25-38 75-38 105 10" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" strokeDasharray="5 4" />
              <circle cx="220" cy="90" r="12" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="2.5" />
              <circle cx="205" cy="135" r="12" fill="#A99BEA" stroke="#6B58CD" strokeWidth="2.5" />
              <path d="M195 118v56" stroke="#2D8A68" strokeWidth="6" strokeLinecap="round" />
              <path d="M100 115v59l-18 0" stroke="#2D8A68" strokeWidth="6" strokeLinecap="round" />
              <text x="120" y="55" fill="#6B58CD" fontSize="12" fontWeight="700">OCEAN SPINAL FLOW</text>
            </svg>
          );
        }

      // ══════════════════════════════════════════════════════════
      // 3. MOUNTAIN POSE (TADASANA)
      // ══════════════════════════════════════════════════════════
      case "mountain-pose":
        return (
          <svg viewBox="0 0 300 220" className="posture-svg-art" fill="none">
            <rect x="40" y="198" width="220" height="6" rx="3" fill="#DCD6F7" />
            {/* Grounding energy roots under feet */}
            <path d="M140 204v10M160 204v10M150 204v12" stroke="#C96D46" strokeWidth="2" strokeLinecap="round" />
            {/* Head crowned & tall */}
            <circle cx="150" cy="40" r="14" fill="#F4CDBB" stroke="#C96D46" strokeWidth="3" />
            {/* Upward thread from crown */}
            <line x1="150" y1="22" x2="150" y2="8" stroke="#A99BEA" strokeWidth="2.5" strokeDasharray="3 3" />
            <polygon points="150,4 146,12 154,12" fill="#A99BEA" />
            {/* Torso straight vertical line */}
            <path d="M150 54v70" stroke="#C96D46" strokeWidth="9" strokeLinecap="round" />
            {/* Arms resting at sides, palms facing forward */}
            <path d="M150 68l-26 40 4 15" stroke="#F4CDBB" strokeWidth="6" strokeLinecap="round" />
            <path d="M150 68l26 40-4 15" stroke="#F4CDBB" strokeWidth="6" strokeLinecap="round" />
            {/* Legs rooted straight down */}
            <path d="M144 124v74M156 124v74" stroke="#C96D46" strokeWidth="7" strokeLinecap="round" />
            {/* Subtle mountain backdrop triangle */}
            <polygon points="150,55 70,198 230,198" fill="rgba(244, 205, 187, 0.15)" stroke="rgba(201, 109, 70, 0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 4. EASY POSE (SUKHASANA)
      // ══════════════════════════════════════════════════════════
      case "easy-pose":
        return (
          <svg viewBox="0 0 300 220" className="posture-svg-art" fill="none">
            <rect x="35" y="196" width="230" height="6" rx="3" fill="#DCD6F7" />
            {/* Cushion under sit bones */}
            <ellipse cx="150" cy="182" rx="42" ry="12" fill="#DCD6F7" stroke="#A99BEA" strokeWidth="2" />
            {/* Head in calm serenity */}
            <circle cx="150" cy="56" r="15" fill="#DCD6F7" stroke="#5B44C7" strokeWidth="3" />
            {/* Soft closed eye line */}
            <path d="M144 57c2 2 4 2 6 0M152 57c2 2 4 2 6 0" stroke="#5B44C7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Straight spine */}
            <path d="M150 71v68" stroke="#5B44C7" strokeWidth="8" strokeLinecap="round" />
            {/* Crossed legs on cushion */}
            <path d="M120 162c-20 0-35 12-10 18h80c25-6 10-18-10-18" stroke="#5B44C7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Arms resting on knees with Chin Mudra */}
            <path d="M150 82l-38 35 12 36M150 82l38 35-12 36" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="124" cy="153" r="4" fill="#A99BEA" />
            <circle cx="176" cy="153" r="4" fill="#A99BEA" />
            {/* Mindful aura ring */}
            <circle cx="150" cy="95" r="55" stroke="rgba(169, 155, 234, 0.35)" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 5. LEGS-UP-THE-WALL (VIPARITA KARANI)
      // ══════════════════════════════════════════════════════════
      case "legs-up-the-wall":
        return (
          <svg viewBox="0 0 300 220" className="posture-svg-art" fill="none">
            {/* Floor */}
            <rect x="20" y="180" width="260" height="6" rx="3" fill="#DCD6F7" />
            {/* Sturdy vertical wall on right side */}
            <rect x="228" y="20" width="10" height="166" rx="2" fill="#CBD5E1" />
            <line x1="228" y1="20" x2="228" y2="186" stroke="#94A3B8" strokeWidth="3" />
            {/* Head resting comfortably */}
            <circle cx="85" cy="172" r="13" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="3" />
            <ellipse cx="85" cy="180" rx="18" ry="5" fill="#E2E8F0" />
            {/* Torso flat on mat */}
            <path d="M98 172h115" stroke="#2D8A68" strokeWidth="9" strokeLinecap="round" />
            {/* Legs extended 90 degrees straight up against wall */}
            <path d="M213 172v-115" stroke="#2D8A68" strokeWidth="9" strokeLinecap="round" />
            {/* Feet at wall top */}
            <path d="M213 57l12-3" stroke="#2D8A68" strokeWidth="7" strokeLinecap="round" />
            {/* Arms wide open in restorative surrender */}
            <path d="M140 172l-15-20 20-10" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" />
            {/* Lymphatic downward flow indicator arrows */}
            <path d="M202 75v35" stroke="#A99BEA" strokeWidth="2.5" strokeDasharray="3 3" />
            <polygon points="202,115 198,106 206,106" fill="#A99BEA" />
            <text x="65" y="125" fill="#2D8A68" fontSize="11" fontWeight="700">GRAVITY DRAIN & REST</text>
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 6. NECK & SHOULDER DESK RELEASE
      // ══════════════════════════════════════════════════════════
      case "neck-shoulder-release":
        return (
          <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
            <rect x="40" y="180" width="220" height="6" rx="3" fill="#DCD6F7" />
            {/* Torso upright */}
            <path d="M150 95v70" stroke="#6B58CD" strokeWidth="9" strokeLinecap="round" />
            {/* Shoulders pressed down */}
            <path d="M115 105h70" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" />
            {/* Tilted neck & head (45 deg) */}
            <circle cx={stepNumber === 1 ? 168 : 132} cy="62" r="15" fill="#DCD6F7" stroke="#6B58CD" strokeWidth="3" />
            {/* Hand guiding stretch gently */}
            {stepNumber === 1 ? (
              <path d="M185 105l-5-40-10-8" stroke="#A99BEA" strokeWidth="5" strokeLinecap="round" />
            ) : (
              <path d="M115 105l5-40 10-8" stroke="#A99BEA" strokeWidth="5" strokeLinecap="round" />
            )}
            {/* Trapezius tension release wave lines */}
            <path d="M125 78c-8 6-8 16 0 22" stroke="#B8E6D5" strokeWidth="3" strokeLinecap="round" />
            <path d="M115 72c-12 10-12 24 0 34" stroke="#B8E6D5" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
            <text x="85" y="40" fill="#6B58CD" fontSize="11" fontWeight="700">CERVICAL DECOMPRESSION</text>
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 7. SEATED SPINAL TWIST
      // ══════════════════════════════════════════════════════════
      case "seated-spinal-twist":
        return (
          <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
            <rect x="40" y="180" width="220" height="6" rx="3" fill="#DCD6F7" />
            {/* Seated base */}
            <path d="M120 170h60" stroke="#2D8A68" strokeWidth="8" strokeLinecap="round" />
            {/* Head rotated */}
            <circle cx="160" cy="55" r="14" fill="#B8E6D5" stroke="#2D8A68" strokeWidth="3" />
            {/* Twisted vertical torso */}
            <path d="M148 69c8 25-4 50 2 75" stroke="#2D8A68" strokeWidth="8" strokeLinecap="round" />
            {/* Arm crossing over front knee */}
            <path d="M145 85l-30 40 25 15" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Back arm propped behind */}
            <path d="M155 85l28 35 10 40" stroke="#2D8A68" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Torso rotation spiral arrow */}
            <path d="M130 110c15-12 35-12 50 0" stroke="#A99BEA" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 3" />
            <polygon points="185,110 178,103 186,98" fill="#A99BEA" />
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 8. HAMSTRING & CALF UNWIND (RAGDOLL FOLD)
      // ══════════════════════════════════════════════════════════
      case "hamstring-calf-unwind":
        return (
          <svg viewBox="0 0 300 210" className="posture-svg-art" fill="none">
            <rect x="40" y="195" width="220" height="6" rx="3" fill="#DCD6F7" />
            {/* Legs standing with soft micro-bent knees */}
            <path d="M170 195v-70M155 195v-70" stroke="#C96D46" strokeWidth="8" strokeLinecap="round" />
            {/* Hips hinged high */}
            <path d="M162 125l-20-8" stroke="#C96D46" strokeWidth="8" strokeLinecap="round" />
            {/* Torso draped down like a ragdoll */}
            <path d="M142 117c-25 10-25 45-20 60" stroke="#C96D46" strokeWidth="8" strokeLinecap="round" />
            {/* Head hanging down completely relaxed */}
            <circle cx="120" cy="180" r="13" fill="#F4CDBB" stroke="#C96D46" strokeWidth="3" />
            {/* Arms crossed holding elbows */}
            <path d="M125 140l-8 25h16" stroke="#A99BEA" strokeWidth="6" strokeLinecap="round" />
            {/* Hamstring release wave lines */}
            <path d="M182 135c6 10 6 25 0 35" stroke="#A99BEA" strokeWidth="3" strokeLinecap="round" />
            <text x="60" y="55" fill="#C96D46" fontSize="11" fontWeight="700">GRAVITY LENGTHENING SPARK</text>
          </svg>
        );

      // ══════════════════════════════════════════════════════════
      // 9. 5-4-3-2-1 SENSORY GROUNDING
      // ══════════════════════════════════════════════════════════
      case "sensory-grounding":
        if (stepNumber === 1) {
          // SEE (Eyes & Vision)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <circle cx="150" cy="100" r="70" fill="rgba(169, 155, 234, 0.1)" stroke="#A99BEA" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M80 100c30-40 110-40 140 0-30 40-110 40-140 0z" fill="white" stroke="#6B58CD" strokeWidth="5" />
              <circle cx="150" cy="100" r="26" fill="#A99BEA" stroke="#6B58CD" strokeWidth="4" />
              <circle cx="150" cy="100" r="12" fill="#202338" />
              <circle cx="156" cy="94" r="5" fill="white" />
              <text x="110" y="175" fill="#6B58CD" fontSize="14" fontWeight="800">5 THINGS YOU SEE</text>
            </svg>
          );
        } else if (stepNumber === 2) {
          // FEEL (Tactile Touch)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <circle cx="150" cy="100" r="70" fill="rgba(184, 230, 213, 0.15)" stroke="#B8E6D5" strokeWidth="2" strokeDasharray="4 4" />
              {/* Hand outline */}
              <path d="M125 150v-40c0-6 8-6 8 0v25M135 130v-45c0-6 8-6 8 0v45M145 125v-50c0-6 8-6 8 0v50M155 130v-42c0-6 8-6 8 0v42M165 145v-25c0-6 7-6 7 0v35c0 20-25 35-50 15z" fill="white" stroke="#2D8A68" strokeWidth="4" strokeLinejoin="round" />
              <text x="105" y="180" fill="#2D8A68" fontSize="14" fontWeight="800">4 THINGS YOU FEEL</text>
            </svg>
          );
        } else if (stepNumber === 3) {
          // HEAR (Sound Waves)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <circle cx="130" cy="100" r="24" fill="#DCD6F7" stroke="#6B58CD" strokeWidth="4" />
              <path d="M130 76c15 0 24 10 24 24s-9 24-24 24" stroke="#6B58CD" strokeWidth="4" fill="none" />
              {/* Ambient radiating acoustic waves */}
              <path d="M165 75c12 12 12 38 0 50" stroke="#6B58CD" strokeWidth="4" strokeLinecap="round" />
              <path d="M182 60c20 22 20 58 0 80" stroke="#A99BEA" strokeWidth="4" strokeLinecap="round" />
              <path d="M200 48c28 30 28 74 0 104" stroke="#B8E6D5" strokeWidth="3.5" strokeLinecap="round" />
              <text x="105" y="175" fill="#6B58CD" fontSize="14" fontWeight="800">3 SOUNDS YOU HEAR</text>
            </svg>
          );
        } else if (stepNumber === 4) {
          // SMELL (Flower & Scent)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <circle cx="150" cy="100" r="70" fill="rgba(244, 205, 187, 0.15)" stroke="#F4CDBB" strokeWidth="2" strokeDasharray="4 4" />
              {/* Blooming flower */}
              <circle cx="150" cy="95" r="14" fill="#F4CDBB" stroke="#C96D46" strokeWidth="3" />
              <circle cx="150" cy="70" r="12" fill="#FFE5D9" stroke="#C96D46" strokeWidth="2" />
              <circle cx="175" cy="95" r="12" fill="#FFE5D9" stroke="#C96D46" strokeWidth="2" />
              <circle cx="150" cy="120" r="12" fill="#FFE5D9" stroke="#C96D46" strokeWidth="2" />
              <circle cx="125" cy="95" r="12" fill="#FFE5D9" stroke="#C96D46" strokeWidth="2" />
              {/* Scent drift lines */}
              <path d="M180 60c8-8 15-4 22-8M190 75c8-6 16-2 24-5" stroke="#C96D46" strokeWidth="2.5" strokeLinecap="round" />
              <text x="100" y="175" fill="#C96D46" fontSize="14" fontWeight="800">2 SCENTS YOU SMELL</text>
            </svg>
          );
        } else {
          // APPRECIATE (Heart & Gratitude)
          return (
            <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
              <path d="M150 145l-35-35c-15-15-15-40 5-50 18-9 30 5 30 5s12-14 30-5c20 10 20 35 5 50z" fill="#DCD6F7" stroke="#6B58CD" strokeWidth="4" />
              <circle cx="150" cy="95" r="45" stroke="#A99BEA" strokeWidth="2" strokeDasharray="4 4" />
              <text x="80" y="180" fill="#6B58CD" fontSize="14" fontWeight="800">1 THING YOU APPRECIATE</text>
            </svg>
          );
        }

      // ══════════════════════════════════════════════════════════
      // 10. BODY SCAN & PROGRESSIVE MUSCLE RELAXATION
      // ══════════════════════════════════════════════════════════
      default:
        return (
          <svg viewBox="0 0 300 200" className="posture-svg-art" fill="none">
            {/* Meditative Silhouette with active scan zone ring */}
            <circle cx="150" cy="50" r="16" fill={stepNumber === 1 ? "#A99BEA" : "#DCD6F7"} stroke="#6B58CD" strokeWidth="3" />
            <path d="M150 67v55" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" />
            <path d="M120 150l30-28 30 28" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M115 175l35-18 35 18" stroke="#6B58CD" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            {/* Glowing scan target ring */}
            <ellipse
              cx="150"
              cy={stepNumber === 1 ? 50 : stepNumber === 2 ? 80 : stepNumber === 3 ? 105 : 155}
              rx="45"
              ry="18"
              stroke="#B8E6D5"
              strokeWidth="3.5"
              fill="rgba(184, 230, 213, 0.2)"
            />
            <text x="100" y="195" fill="#6B58CD" fontSize="11" fontWeight="700">TARGETED MUSCLE RELEASE</text>
          </svg>
        );
    }
  };

  return (
    <div className={`posture-visual-container ${className}`}>
      {renderPosture()}
    </div>
  );
};

export default PostureVisual;
