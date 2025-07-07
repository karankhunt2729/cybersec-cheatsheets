import { users, cheatsheetPages, type User, type InsertUser, type CheatsheetPage, type InsertCheatsheetPage, type UpdateCheatsheetPage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Cheatsheet Pages
  getAllPages(): Promise<CheatsheetPage[]>;
  getPageById(id: number): Promise<CheatsheetPage | undefined>;
  createPage(page: InsertCheatsheetPage): Promise<CheatsheetPage>;
  updatePage(id: number, updates: UpdateCheatsheetPage): Promise<CheatsheetPage | undefined>;
  deletePage(id: number): Promise<boolean>;
  searchPages(query: string): Promise<CheatsheetPage[]>;
}

function countWords(text: string): number {
  if (!text || text.trim() === "") return 0;
  // Remove HTML tags and count words
  const plainText = text.replace(/<[^>]*>/g, " ");
  return plainText.trim().split(/\s+/).length;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pages: Map<number, CheatsheetPage>;
  private currentUserId: number;
  private currentPageId: number;

  constructor() {
    this.users = new Map();
    this.pages = new Map();
    this.currentUserId = 1;
    this.currentPageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPages(): Promise<CheatsheetPage[]> {
    return Array.from(this.pages.values()).sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  }

  async getPageById(id: number): Promise<CheatsheetPage | undefined> {
    return this.pages.get(id);
  }

  async createPage(insertPage: InsertCheatsheetPage): Promise<CheatsheetPage> {
    const id = this.currentPageId++;
    const content = insertPage.content || "";
    const wordCount = countWords(content);
    const page: CheatsheetPage = {
      ...insertPage,
      id,
      content,
      lastModified: new Date(),
      wordCount,
    };
    this.pages.set(id, page);
    return page;
  }

  async updatePage(id: number, updates: UpdateCheatsheetPage): Promise<CheatsheetPage | undefined> {
    const existingPage = this.pages.get(id);
    if (!existingPage) return undefined;

    const wordCount = updates.content !== undefined ? countWords(updates.content) : existingPage.wordCount;
    const updatedPage: CheatsheetPage = {
      ...existingPage,
      ...updates,
      lastModified: new Date(),
      wordCount,
    };
    
    this.pages.set(id, updatedPage);
    return updatedPage;
  }

  async deletePage(id: number): Promise<boolean> {
    return this.pages.delete(id);
  }

  async searchPages(query: string): Promise<CheatsheetPage[]> {
    if (!query.trim()) {
      return this.getAllPages();
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filteredPages = Array.from(this.pages.values()).filter(page =>
      page.title.toLowerCase().includes(lowercaseQuery) ||
      page.content.toLowerCase().includes(lowercaseQuery)
    );
    
    return filteredPages.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    );
  }
}

export const storage = new MemStorage();
