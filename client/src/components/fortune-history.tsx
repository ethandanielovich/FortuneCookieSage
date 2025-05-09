import { Button } from "@/components/ui/button";
import { Trash2, Share } from "lucide-react";
import { SavedFortune } from "../types/fortune";
import { categoryInfo, formatDate } from "../lib/fortune-data";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface FortuneHistoryProps {
  savedFortunes: SavedFortune[];
  onShare: (fortune: SavedFortune) => void;
  isLoading: boolean;
}

export function FortuneHistory({ 
  savedFortunes, 
  onShare,
  isLoading
}: FortuneHistoryProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleClearHistory = async () => {
    try {
      await apiRequest('DELETE', '/api/saved-fortunes');
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/saved-fortunes'] });
      
      toast({
        title: "History cleared",
        description: "Your fortune history has been cleared.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFortune = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/saved-fortunes/${id}`);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/saved-fortunes'] });
      
      toast({
        title: "Fortune deleted",
        description: "Fortune has been removed from your history.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete fortune. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-lg font-bold mb-3">Your Fortune History</h2>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-6 w-6 border-2 border-[#E8B06E] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading your fortunes...</p>
          </div>
        ) : savedFortunes.length === 0 ? (
          <p className="text-sm text-center text-gray-500 py-4">
            Your past fortunes will appear here once you've cracked open some cookies!
          </p>
        ) : (
          savedFortunes.map((savedFortune, index) => {
            const { fortune } = savedFortune;
            const categoryData = categoryInfo[fortune.category];
            
            return (
              <div 
                key={index} 
                className="bg-[#FFF9E6]/50 p-3 rounded-lg border border-[#E8B06E]/20 text-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryData.bgClass} ${categoryData.textClass}`}>
                    {categoryData.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(savedFortune.savedAt)}
                  </span>
                </div>
                <p className="font-serif italic mb-2 text-sm">{fortune.message}</p>
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => onShare(savedFortune)}
                  >
                    <Share className="h-3.5 w-3.5 text-gray-500 hover:text-[#D35400]" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => handleDeleteFortune(index)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-500 hover:text-[#F44336]" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {savedFortunes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Button 
            variant="ghost" 
            className="w-full text-sm text-gray-500 hover:text-[#F44336]"
            onClick={handleClearHistory}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
}
