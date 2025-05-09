import { 
  users, 
  type User, 
  type InsertUser,
  fortunes,
  type Fortune,
  type InsertFortune,
  savedFortunes,
  type SavedFortune,
  type InsertSavedFortune,
  FortuneCategory
} from "@shared/schema";

// Extend the storage interface with CRUD methods for fortunes
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Fortune methods
  getAllFortunes(): Promise<Fortune[]>;
  getFortunesByCategory(category: string): Promise<Fortune[]>;
  getFortune(id: number): Promise<Fortune | undefined>;
  getRandomFortune(category?: string): Promise<Fortune | undefined>;
  createFortune(fortune: InsertFortune): Promise<Fortune>;
  
  // Saved fortunes methods
  getSavedFortunes(userId: number): Promise<{ fortune: Fortune, savedAt: Date }[]>;
  saveFortune(savedFortune: InsertSavedFortune): Promise<SavedFortune>;
  deleteSavedFortune(id: number): Promise<boolean>;
  clearSavedFortunes(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private fortunes: Map<number, Fortune>;
  private userSavedFortunes: Map<number, SavedFortune>;
  
  private userCurrentId: number;
  private fortuneCurrentId: number;
  private savedFortuneCurrentId: number;

  constructor() {
    this.users = new Map();
    this.fortunes = new Map();
    this.userSavedFortunes = new Map();
    
    this.userCurrentId = 1;
    this.fortuneCurrentId = 1;
    this.savedFortuneCurrentId = 1;
    
    // Seed with initial fortunes
    this.seedFortunes();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Fortune methods
  async getAllFortunes(): Promise<Fortune[]> {
    return Array.from(this.fortunes.values());
  }
  
  async getFortunesByCategory(category: string): Promise<Fortune[]> {
    return Array.from(this.fortunes.values()).filter(
      (fortune) => fortune.category === category
    );
  }
  
  async getFortune(id: number): Promise<Fortune | undefined> {
    return this.fortunes.get(id);
  }
  
  async getRandomFortune(category?: string): Promise<Fortune | undefined> {
    const fortunes = category 
      ? await this.getFortunesByCategory(category)
      : await this.getAllFortunes();
      
    if (fortunes.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    return fortunes[randomIndex];
  }
  
  async createFortune(insertFortune: InsertFortune): Promise<Fortune> {
    const id = this.fortuneCurrentId++;
    const fortune: Fortune = { ...insertFortune, id };
    this.fortunes.set(id, fortune);
    return fortune;
  }
  
  // Saved fortunes methods
  async getSavedFortunes(userId: number): Promise<{ fortune: Fortune, savedAt: Date }[]> {
    const savedFortunes = Array.from(this.userSavedFortunes.values())
      .filter(sf => sf.userId === userId);
      
    return savedFortunes.map(sf => {
      const fortune = this.fortunes.get(sf.fortuneId);
      if (!fortune) {
        throw new Error(`Fortune with id ${sf.fortuneId} not found`);
      }
      return {
        fortune,
        savedAt: sf.savedAt,
      };
    });
  }
  
  async saveFortune(insertSavedFortune: InsertSavedFortune): Promise<SavedFortune> {
    const id = this.savedFortuneCurrentId++;
    const savedFortune: SavedFortune = { 
      ...insertSavedFortune, 
      id, 
      savedAt: new Date() 
    };
    this.userSavedFortunes.set(id, savedFortune);
    return savedFortune;
  }
  
  async deleteSavedFortune(id: number): Promise<boolean> {
    return this.userSavedFortunes.delete(id);
  }
  
  async clearSavedFortunes(userId: number): Promise<boolean> {
    const savedFortunesToDelete = Array.from(this.userSavedFortunes.entries())
      .filter(([_, sf]) => sf.userId === userId);
      
    for (const [id] of savedFortunesToDelete) {
      this.userSavedFortunes.delete(id);
    }
    
    return true;
  }
  
  // Helper method to seed initial fortunes
  private seedFortunes() {
    const initialFortunes = [
      // Love fortunes
      { message: "Love is patient, love is kind, and what's yours will come to you at the perfect time.", category: FortuneCategory.LOVE },
      { message: "Your heart will skip a beat when someone special crosses your path this month.", category: FortuneCategory.LOVE },
      { message: "A connection from your past will resurface with surprising results.", category: FortuneCategory.LOVE },
      { message: "The love you give is the love you get returned.", category: FortuneCategory.LOVE },
      { message: "A strong romance is in your future - be open to unexpected connections.", category: FortuneCategory.LOVE },
      
      // Career fortunes
      { message: "Your hard work is about to pay off. Stay focused on your goals.", category: FortuneCategory.CAREER },
      { message: "A new career opportunity will present itself. Trust your instincts.", category: FortuneCategory.CAREER },
      { message: "Your leadership skills will be recognized and rewarded soon.", category: FortuneCategory.CAREER },
      { message: "Collaboration will lead to your next big breakthrough at work.", category: FortuneCategory.CAREER },
      { message: "The project you've been doubting will exceed all expectations.", category: FortuneCategory.CAREER },
      
      // Wealth fortunes
      { message: "Financial abundance flows to you effortlessly when you follow your true calling.", category: FortuneCategory.WEALTH },
      { message: "A small investment now will yield significant returns in the future.", category: FortuneCategory.WEALTH },
      { message: "The key to wealth is not finding money, but discovering your unique value.", category: FortuneCategory.WEALTH },
      { message: "An unexpected financial opportunity awaits you this month.", category: FortuneCategory.WEALTH },
      { message: "Prosperity comes when you least expect it, but most deserve it.", category: FortuneCategory.WEALTH },
      
      // General fortunes
      { message: "Good things come to those who wait, but better things come to those who take action.", category: FortuneCategory.GENERAL },
      { message: "The path to success is often through unexpected detours.", category: FortuneCategory.GENERAL },
      { message: "A smile is your personal welcome mat to new friendships.", category: FortuneCategory.GENERAL },
      { message: "Your greatest strength is your adaptability. Use it wisely.", category: FortuneCategory.GENERAL },
      { message: "Today's obstacles are tomorrow's stepping stones.", category: FortuneCategory.GENERAL },
      { message: "The journey of a thousand miles begins with a single step.", category: FortuneCategory.GENERAL },
      { message: "Your creativity will solve a long-standing problem.", category: FortuneCategory.GENERAL },
    ];
    
    for (const fortune of initialFortunes) {
      this.createFortune(fortune);
    }
  }
}

export const storage = new MemStorage();
