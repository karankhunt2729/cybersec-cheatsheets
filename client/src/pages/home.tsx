import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { CheatsheetPage } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import { Shield, BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddPageModal from "@/components/add-page-modal";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPageModal, setShowAddPageModal] = useState(false);

  const { data: pages = [], isLoading } = useQuery<CheatsheetPage[]>({
    queryKey: ["/api/pages"],
  });

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = pages.length;
  const totalWords = pages.reduce((sum, page) => sum + page.wordCount, 0);

  const handlePageSelect = (pageId: number) => {
    setSelectedPageId(pageId);
    setLocation(`/editor/${pageId}`);
  };

  const handleCreatePage = () => {
    setShowAddPageModal(true);
  };

  const handlePageCreated = (page: CheatsheetPage) => {
    setLocation(`/editor/${page.id}`);
  };

  // Show welcome state if no pages exist
  if (!isLoading && pages.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-green-400 text-2xl w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-green-400 mb-2 font-mono">Welcome to CyberSec CheatSheets</h2>
            <p className="text-green-300 mb-6 font-mono text-sm">Create your first cheatsheet page to start documenting your cybersecurity knowledge and references.</p>
            <Button onClick={handleCreatePage} className="bg-green-600 hover:bg-green-700 text-black font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Page
            </Button>
          </div>
        </div>
        <AddPageModal 
          open={showAddPageModal} 
          onOpenChange={setShowAddPageModal}
          onPageCreated={handlePageCreated}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        pages={filteredPages}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPageId={selectedPageId}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
        totalPages={totalPages}
        totalWords={totalWords}
        isLoading={isLoading}
      />
      
      {/* Main content area - shows welcome when no page selected */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-green-400 text-2xl w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-green-400 mb-2 font-mono">CyberSec CheatSheets</h2>
          <p className="text-green-300 mb-6 font-mono text-sm">Select a page from the sidebar to start viewing or editing your cybersecurity documentation.</p>
        </div>
      </div>

      <AddPageModal 
        open={showAddPageModal} 
        onOpenChange={setShowAddPageModal}
        onPageCreated={handlePageCreated}
      />
    </div>
  );
}
