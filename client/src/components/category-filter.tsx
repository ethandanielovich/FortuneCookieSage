import { Button } from "@/components/ui/button";
import { FortuneCategory } from "../types/fortune";
import { Heart, Briefcase, Coins, Sparkles } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const handleCategoryClick = (category: string | null) => {
    onSelectCategory(category);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-bold mb-3">Categories</h2>
      <div className="space-y-2">
        <Button
          variant={selectedCategory === null ? "default" : "ghost"}
          className={`w-full justify-start font-medium ${
            selectedCategory === null ? "bg-[#E8B06E] hover:bg-[#E8B06E]/90" : "hover:bg-[#F5D7A8]/30"
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          All Fortunes
        </Button>
        
        <Button
          variant={selectedCategory === "love" ? "default" : "ghost"}
          className={`w-full justify-start font-medium ${
            selectedCategory === "love" ? "bg-[#E8B06E] hover:bg-[#E8B06E]/90" : "hover:bg-[#F5D7A8]/30"
          }`}
          onClick={() => handleCategoryClick("love")}
        >
          <Heart className="mr-2 h-4 w-4" />
          Love
        </Button>
        
        <Button
          variant={selectedCategory === "career" ? "default" : "ghost"}
          className={`w-full justify-start font-medium ${
            selectedCategory === "career" ? "bg-[#E8B06E] hover:bg-[#E8B06E]/90" : "hover:bg-[#F5D7A8]/30"
          }`}
          onClick={() => handleCategoryClick("career")}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          Career
        </Button>
        
        <Button
          variant={selectedCategory === "wealth" ? "default" : "ghost"}
          className={`w-full justify-start font-medium ${
            selectedCategory === "wealth" ? "bg-[#E8B06E] hover:bg-[#E8B06E]/90" : "hover:bg-[#F5D7A8]/30"
          }`}
          onClick={() => handleCategoryClick("wealth")}
        >
          <Coins className="mr-2 h-4 w-4" />
          Wealth
        </Button>
        
        <Button
          variant={selectedCategory === "general" ? "default" : "ghost"}
          className={`w-full justify-start font-medium ${
            selectedCategory === "general" ? "bg-[#E8B06E] hover:bg-[#E8B06E]/90" : "hover:bg-[#F5D7A8]/30"
          }`}
          onClick={() => handleCategoryClick("general")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          General
        </Button>
      </div>
    </div>
  );
}
