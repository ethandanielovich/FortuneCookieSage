import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CookieAnimationProps {
  isCracked: boolean;
  onAnimationComplete?: () => void;
}

export function CookieAnimation({ isCracked, onAnimationComplete }: CookieAnimationProps) {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (!isCracked) {
      setAnimationComplete(false);
    }
  }, [isCracked]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  // Cookie animation variants
  const closedCookieVariants = {
    initial: { 
      scale: 1,
      rotate: 0,
      y: 0
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3 }
    },
    clicked: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const topHalfVariants = {
    initial: { 
      rotateX: 0,
      y: 0
    },
    cracked: { 
      rotateX: -80,
      y: -20,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const bottomHalfVariants = {
    initial: { 
      rotateX: 0,
      y: 0
    },
    cracked: { 
      rotateX: 80,
      y: 20,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {!isCracked ? (
        <motion.div
          className="cursor-pointer"
          variants={closedCookieVariants}
          initial="initial"
          whileHover="hover"
          whileTap="clicked"
        >
          {/* Cookie background glow */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute w-48 h-48 bg-[#E8B06E] rounded-full opacity-20 animate-pulse"></div>
            
            {/* Cookie SVG */}
            <div className="w-40 h-40 relative z-10 drop-shadow-xl">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="50" rx="45" ry="30" fill="#E8B06E" />
                <ellipse cx="50" cy="50" rx="40" ry="25" fill="#F5D7A8" />
                <ellipse cx="35" cy="40" rx="5" ry="5" fill="#D35400" opacity="0.3" />
                <ellipse cx="60" cy="55" rx="4" ry="4" fill="#D35400" opacity="0.3" />
                <ellipse cx="45" cy="60" rx="3" ry="3" fill="#D35400" opacity="0.3" />
                <ellipse cx="65" cy="40" rx="4" ry="4" fill="#D35400" opacity="0.3" />
              </svg>
            </div>
            
            {/* Cookie shine */}
            <div 
              className="absolute inset-0 rounded-full opacity-60" 
              style={{
                background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)'
              }}
            ></div>
          </div>
          <p className="mt-4 text-center font-medium">Tap to crack open your fortune cookie!</p>
        </motion.div>
      ) : (
        <div style={{ perspective: "800px" }} className="relative w-48 h-48">
          {/* Top half of the cracked cookie */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 z-10"
            variants={topHalfVariants}
            initial="initial"
            animate="cracked"
          >
            <div className="w-full h-full rounded-t-full bg-[#E8B06E] relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#F5D7A8] rounded-t-full"></div>
              <div 
                className="absolute inset-0 opacity-30" 
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                }}
              ></div>
            </div>
          </motion.div>
          
          {/* Bottom half of the cracked cookie */}
          <motion.div
            className="absolute bottom-0 left-0 w-full h-1/2 z-0"
            variants={bottomHalfVariants}
            initial="initial"
            animate="cracked"
            onAnimationComplete={handleAnimationComplete}
          >
            <div className="w-full h-full rounded-b-full bg-[#F5D7A8] relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-30" 
                style={{
                  background: 'linear-gradient(to top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)'
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
