import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Twitter, Facebook, Instagram, Send, Copy, X } from "lucide-react";
import { useState } from "react";
import { Fortune } from "../types/fortune";
import { useToast } from "@/hooks/use-toast";

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  fortune: Fortune | null;
}

export function ShareModal({ isOpen, onOpenChange, fortune }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  if (!fortune) return null;

  const shareUrl = `https://fortune-cookie.app/share/${fortune.id}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
        variant: "default",
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleShare = (platform: string) => {
    // In a real app, these would link to actual share URLs
    let shareLink = '';
    const message = encodeURIComponent(`My fortune cookie says: "${fortune.message}" #FortuneCookie`);
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${message}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${message}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, we would need to use their API
        toast({
          title: "Instagram sharing",
          description: "Instagram sharing is available in the app",
          variant: "default",
        });
        return;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${message} ${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-xl p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share Your Fortune</DialogTitle>
          <DialogClose className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        <div className="p-4 bg-[#FFF9E6] rounded-lg mb-4 text-center">
          <p className="font-serif italic">{fortune.message}</p>
        </div>
        
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-3 h-auto"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-5 w-5 mb-1" />
            <span className="text-xs">Twitter</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-3 h-auto"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-5 w-5 mb-1" />
            <span className="text-xs">Facebook</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-3 h-auto"
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-5 w-5 mb-1" />
            <span className="text-xs">Instagram</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center justify-center p-3 h-auto"
            onClick={() => handleShare('whatsapp')}
          >
            <Send className="h-5 w-5 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </Button>
        </div>
        
        <div className="flex">
          <Input
            value={shareUrl}
            readOnly
            className="rounded-r-none"
          />
          <Button 
            className="rounded-l-none bg-[#E8B06E] hover:bg-[#E8B06E]/90 text-white"
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
            <Copy className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
