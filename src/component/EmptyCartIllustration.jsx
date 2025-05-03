const EmptyCartIllustration = ({ className }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 50L30 70V170H170V70L150 50H50Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 70L50 70L70 50" stroke="currentColor" strokeWidth="2"/>
      <circle cx="80" cy="120" r="20" stroke="currentColor" strokeWidth="2"/>
      <circle cx="140" cy="120" r="20" stroke="currentColor" strokeWidth="2"/>
      <path d="M70 50H130" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
  
  export default EmptyCartIllustration;