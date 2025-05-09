import { useEffect, useState } from "react";
import { Fortune, SavedFortune, FortuneCategory } from "../types/fortune";
import { FortuneCookie } from "../components/fortune-cookie";
import { FortuneHistory } from "../components/fortune-history";
import { CategoryFilter } from "../components/category-filter";
import { ShareModal } from "../components/share-modal";
import { useQuery } from "@tanstack/react-query";
import { Moon, Sun, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [fortuneToShare, setFortuneToShare] = useState<Fortune | null>(null);
  const { theme, setTheme } = useTheme();

  // Query saved fortunes
  const { data: savedFortunes, isLoading: savedFortunesLoading } = useQuery({
    queryKey: ['/api/saved-fortunes'],
    queryFn: async () => {
      const res = await fetch('/api/saved-fortunes', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch saved fortunes');
      return res.json() as Promise<SavedFortune[]>;
    },
  });

  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  // Handle sharing a fortune from history
  const handleShareFromHistory = (savedFortune: SavedFortune) => {
    setFortuneToShare(savedFortune.fortune);
    setShareModalOpen(true);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-neutral-800">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 pt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-[#E8B06E]">
            <span className="inline-block mr-2">🥠</span>
            Fortune Cookie Teller
          </h1>
          <div className="mt-4 sm:mt-0 flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full" 
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full ml-2"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="grid md:grid-cols-5 gap-8">
          {/* Left sidebar - Categories */}
          <div className="md:col-span-1">
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>

          {/* Main content - Fortune cookie */}
          <div className="md:col-span-3">
            <FortuneCookie />
          </div>

          {/* Right sidebar - Fortune History */}
          <div className="md:col-span-1">
            <FortuneHistory 
              savedFortunes={savedFortunes || []} 
              onShare={handleShareFromHistory}
              isLoading={savedFortunesLoading}
            />
          </div>
        </main>

        {/* Share Modal for fortune history items */}
        <ShareModal 
          isOpen={shareModalOpen}
          onOpenChange={setShareModalOpen}
          fortune={fortuneToShare}
        />
      </div>
    </div>
  );
}
