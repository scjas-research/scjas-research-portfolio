import React from 'react';

const JurekaLogo = ({ className = "" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Central Pillar */}
      <path 
        d="M50 25V75M50 75H40M50 75H60M50 80H35M50 80H65" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      
      {/* Top Circle */}
      <circle cx="50" cy="20" r="4" fill="currentColor" />
      
      {/* Right Arm (Lightning Bolt style) */}
      <path 
        d="M50 35L65 30L55 45L75 40" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Right Scale */}
      <path d="M75 40V45M70 55H80L75 45L70 55Z" fill="currentColor" />

      {/* Left Arm (Lightning Bolt style) */}
      <path 
        d="M50 35L35 30L45 45L25 40" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Left Scale */}
      <path d="M25 40V45M20 55H30L25 45L20 55Z" fill="currentColor" />
      
      {/* Center Detail (Diamond) */}
      <path 
        d="M50 50L55 60L50 70L45 60L50 50Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};

export default JurekaLogo;
