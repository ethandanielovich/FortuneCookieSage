import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share, Save } from "lucide-react";
import { Fortune } from "../types/fortune";
import { categoryInfo } from "../lib/fortune-data";

interface FortunePaperProps {
  fortune: Fortune | null;
  isVisible: boolean;
  onShare: () => void;
  onSave: () => void;
}

export function FortunePaper({ fortune, isVisible, onShare, onSave }: FortunePaperProps) {
  if (!fortune) return null;

  const categoryData = categoryInfo[fortune.category];

  // Animation variants
  const paperVariants = {
    hidden: { 
      y: 100, 
      scale: 0.5, 
      opacity: 0,
      rotateZ: 0
    },
    visible: { 
      y: 0, 
      scale: 1, 
      opacity: 1,
      rotateZ: 3,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: 0.3,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      className="w-64 bg-[#FFF9E6] p-4 rounded shadow-md border border-[#D35400]/20 relative z-20"
      variants={paperVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
    >
      <div 
        className={`text-xs uppercase tracking-wide mb-2 font-bold inline-block px-2 py-0.5 rounded-full ${categoryData.bgClass} ${categoryData.textClass}`}
      >
        {categoryData.label}
      </div>
      <p className="font-serif text-lg italic text-center py-2">
        {fortune.message}
      </p>
      <div className="mt-4 flex justify-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-sm rounded-full"
          onClick={onShare}
        >
          <Share className="mr-1 h-3.5 w-3.5" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-sm rounded-full"
          onClick={onSave}
        >
          <Save className="mr-1 h-3.5 w-3.5" />
          Save
        </Button>
      </div>
    </motion.div>
  );
}
