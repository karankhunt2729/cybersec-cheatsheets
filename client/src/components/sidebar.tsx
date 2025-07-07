import { Shield, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageList from "./page-list";
import type { CheatsheetPage } from "@shared/schema";

interface SidebarProps {
  pages: CheatsheetPage[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPageId: number | null;
  onPageSelect: (pageId: number) => void;
  onCreatePage: () => void;
  totalPages: number;
  totalWords: number;
  isLoading: boolean;
}

export default function Sidebar({
  pages,
  searchQuery,
  onSearchChange,
  selectedPageId,
  onPageSelect,
  onCreatePage,
  totalPages,
  totalWords,
  isLoading,
}: SidebarProps) {
  return (
    <div className="w-80 bg-gray-900 border-r border-green-600 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-green-600">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Shield className="text-black text-lg w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-green-400 font-mono">CyberSec CheatSheets</h1>
            <p className="text-sm text-green-300 font-mono">Security Documentation</p>
          </div>
        </div>
        
        {/* Add New Page Button */}
        <Button onClick={onCreatePage} className="w-full bg-green-600 hover:bg-green-700 text-black font-mono">
          <Plus className="w-4 h-4 mr-2" />
          Add New Page
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="p-4 border-b border-green-600">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search cheatsheets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm bg-black border-green-600 text-green-400 font-mono"
          />
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-4">
        <PageList
          pages={pages}
          selectedPageId={selectedPageId}
          onPageSelect={onPageSelect}
          isLoading={isLoading}
        />
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-green-600">
        <div className="text-xs text-green-300 text-center font-mono">
          <span>{totalPages} pages</span> • <span>{totalWords} words</span>
        </div>
      </div>
    </div>
  );
}
