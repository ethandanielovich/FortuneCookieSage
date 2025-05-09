import { Fortune, FortuneCategory } from "../types/fortune";

// Sample fortunes used for client-side display before the actual
// fortunes are loaded from the server
export const sampleFortunes: Record<FortuneCategory, string[]> = {
  love: [
    "Love is patient, love is kind, and what's yours will come to you at the perfect time.",
    "Your heart will skip a beat when someone special crosses your path this month.",
    "A connection from your past will resurface with surprising results."
  ],
  career: [
    "Your hard work is about to pay off. Stay focused on your goals.",
    "A new career opportunity will present itself. Trust your instincts.",
    "Your leadership skills will be recognized and rewarded soon."
  ],
  wealth: [
    "Financial abundance flows to you effortlessly when you follow your true calling.",
    "A small investment now will yield significant returns in the future.",
    "The key to wealth is not finding money, but discovering your unique value."
  ],
  general: [
    "Good things come to those who wait, but better things come to those who take action.",
    "The path to success is often through unexpected detours.",
    "A smile is your personal welcome mat to new friendships."
  ]
};

// Function to get a random fortune from sample data
export const getRandomSampleFortune = (category?: FortuneCategory): string => {
  const categories = category ? [category] : Object.keys(sampleFortunes) as FortuneCategory[];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const fortunes = sampleFortunes[randomCategory];
  return fortunes[Math.floor(Math.random() * fortunes.length)];
};

// Category display information
export const categoryInfo = {
  love: {
    icon: "heart",
    label: "Love",
    color: "pink",
    bgClass: "bg-pink-100",
    textClass: "text-pink-800"
  },
  career: {
    icon: "briefcase",
    label: "Career",
    color: "blue",
    bgClass: "bg-blue-100",
    textClass: "text-blue-800"
  },
  wealth: {
    icon: "coins",
    label: "Wealth",
    color: "amber",
    bgClass: "bg-amber-100",
    textClass: "text-amber-800"
  },
  general: {
    icon: "sparkles",
    label: "General",
    color: "purple",
    bgClass: "bg-purple-100",
    textClass: "text-purple-800"
  },
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
