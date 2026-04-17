import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Main large circle with TI */}
        <circle cx="50" cy="72" r="38" fill="white" />
        <text
          x="50"
          y="73"
          dominantBaseline="central"
          textAnchor="middle"
          fill="#191970"
          style={{ font: '900 32px sans-serif' }}
        >
          TI
        </text>

        {/* Arch of decorative circles */}
        <circle cx="108" cy="35" r="14" fill="white" />
        <circle cx="158" cy="28" r="9" fill="white" />
        <circle cx="205" cy="32" r="6" fill="white" />
        <circle cx="240" cy="45" r="4" fill="white" />

        {/* Text Area */}
        <text
          x="98"
          y="82"
          fill="white"
          style={{ font: '300 28px sans-serif', letterSpacing: '0.05em' }}
        >
          DO BRASIL
        </text>
        <text
          x="142"
          y="105"
          fill="white"
          style={{ font: '300 12px sans-serif', letterSpacing: '0.4em' }}
        >
          TECNOLOGIA
        </text>
      </svg>
    </div>
  );
};
