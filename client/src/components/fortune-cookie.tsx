import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CookieAnimation } from "./cookie-animation";
import { FortunePaper } from "./fortune-paper";
import { ShareModal } from "./share-modal";
import { Fortune, FortuneCategory } from "../types/fortune";
import { CategoryFilter } from "./category-filter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

export function FortuneCookie() {
  const [cookieCracked, setCookieCracked] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to get a random fortune
  const { refetch: fetchRandomFortune } = useQuery({
    queryKey: ['/api/fortunes/random', selectedCategory],
    enabled: false, // Only fetch when needed
    queryFn: async () => {
      const endpoint = selectedCategory 
        ? `/api/fortunes/random?category=${selectedCategory}`
        : '/api/fortunes/random';
      const res = await fetch(endpoint, { credentials: 'include' });
      
      if (!res.ok) throw new Error('Failed to fetch fortune');
      
      return res.json() as Promise<Fortune>;
    }
  });

  // Mutation to save fortune
  const saveFortuneMutation = useMutation({
    mutationFn: async (fortuneId: number) => {
      return apiRequest('POST', '/api/saved-fortunes', { fortuneId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-fortunes'] });
      toast({
        title: "Fortune saved!",
        description: "Your fortune has been added to your history.",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save fortune. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle cookie crack animation completed
  const handleCrackAnimationComplete = () => {
    setShowFortune(true);
  };

  // Load a new fortune
  const getNewFortune = async () => {
    try {
      const data = await fetchRandomFortune();
      if (data.data) {
        setCurrentFortune(data.data);
      }
    } catch (error) {
      console.error('Error fetching fortune:', error);
      toast({
        title: "Error",
        description: "Failed to fetch a fortune. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle opening a cookie
  const handleOpenCookie = async () => {
    if (!cookieCracked) {
      setCookieCracked(true);
      await getNewFortune();
    }
  };

  // Handle getting a new fortune
  const handleNewFortune = () => {
    setCookieCracked(false);
    setShowFortune(false);
    setCurrentFortune(null);
  };

  // Handle sharing a fortune
  const handleShareFortune = () => {
    setShareModalOpen(true);
  };

  // Handle saving a fortune
  const handleSaveFortune = () => {
    if (currentFortune) {
      saveFortuneMutation.mutate(currentFortune.id);
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    
    // If cookie is already cracked, get a new fortune with the selected category
    if (cookieCracked) {
      handleNewFortune();
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center relative min-h-[320px]">
          {/* Cookie Animation */}
          <div className="relative" onClick={cookieCracked ? undefined : handleOpenCookie}>
            <CookieAnimation 
              isCracked={cookieCracked} 
              onAnimationComplete={handleCrackAnimationComplete} 
            />
          </div>
          
          {/* Fortune Paper */}
          <div className="absolute mt-24">
            <FortunePaper 
              fortune={currentFortune}
              isVisible={showFortune}
              onShare={handleShareFortune}
              onSave={handleSaveFortune}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          {cookieCracked && (
            <Button 
              className="px-5 py-3 bg-[#E8B06E] hover:bg-[#E8B06E]/90 text-white rounded-full shadow-md flex items-center"
              onClick={handleNewFortune}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              New Fortune
            </Button>
          )}
        </div>
      </div>

      {/* Fortune explanation area */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-3">Fortune Insights</h2>
        <div className="text-gray-600">
          <p className="mb-2">Fortunes have been used for guidance and reflection for thousands of years.</p>
          <p>Crack open a cookie to reveal your personal message. Remember, the future is yours to create!</p>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={shareModalOpen}
        onOpenChange={setShareModalOpen}
        fortune={currentFortune}
      />
    </>
  );
}
