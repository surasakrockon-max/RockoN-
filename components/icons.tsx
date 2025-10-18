import type React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement>> = ({ children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const Lightbulb: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 7.5a6 6 0 0 0-12 0c0 1.5.3 2.7 1.5 3.9.8.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </Icon>
);

export const Camera: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </Icon>
);

export const Download: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </Icon>
);

export const RotateCcw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

export const Palette: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a7 7 0 1 0 7 7" />
    <path d="M15.2 2.2A4.5 4.5 0 0 0 8 5.5" />
  </Icon>
);

export const Briefcase: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Icon>
  );
  
export const Building: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </Icon>
);

export const Share: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Icon>
);

export const Sun: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </Icon>
);

export const Moon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </Icon>
);

export const Globe: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </Icon>
);

export const Twitter: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1 1.7-7.9 1.7-12.8 0 0 0-4.5 4.9-4.5 4.9 0 0 .3 1.3 1.3 1.3 3.2 0 4.6-2.8 4.6-2.8-2.6 1-4.6 1.6-4.6 1.6l-.3-1.8c2.6.4 5.1-1.6 5.1-1.6-1.8-1.5-2.8-3.5-2.8-3.5s0 0 .1 0c2.1 0 2.1 0 2.1 0-2.6-1-5.1-3.2-5.1-3.2s0 0 5.1 0c0 0 .1 0 .1 0 .1 0 .1 0 0 0-2.3-.3-4-1.9-4-1.9s.1 0 .1 0c2.8 0 4.9 1.9 4.9 1.9 0 0 .1-.1.1-.1s0 0 0 0c.3-.3 1.3-1.6 1.3-1.6.5.5 1.6 1.3 1.6 1.3.5 0 3.4-1.3 3.4-1.3" />
  </Icon>
);

export const Linkedin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Icon>
);

export const Sparkles: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9L12 3z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </Icon>
);

export const Zap: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </Icon>
);

export const History: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
        <path d="M12 7v5l4 2" />
    </Icon>
);

export const Trash2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </Icon>
);

export const Copy: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <Icon {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Icon>
);
