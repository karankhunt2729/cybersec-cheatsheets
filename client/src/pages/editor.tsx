import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { CheatsheetPage } from "@shared/schema";
import Sidebar from "@/components/sidebar";
import RichTextEditor from "@/components/rich-text-editor";
import AddPageModal from "@/components/add-page-modal";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";

export default function Editor() {
  const [, params] = useRoute("/editor/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const pageId = params?.id ? parseInt(params.id) : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { data: pages = [], isLoading: pagesLoading } = useQuery<CheatsheetPage[]>({
    queryKey: ["/api/pages"],
  });

  const { data: currentPage, isLoading: pageLoading } = useQuery<CheatsheetPage>({
    queryKey: ["/api/pages", pageId],
    enabled: !!pageId,
  });

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  const updatePageMutation = useMutation({
    mutationFn: async (updates: { title?: string; content?: string }) => {
      if (!pageId) throw new Error("No page ID");
      return await apiRequest("PATCH", `/api/pages/${pageId}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pages", pageId] });
      setLastSaved(new Date());
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    },
  });

  // Set initial values when page loads
  useEffect(() => {
    if (currentPage) {
      setTitle(currentPage.title);
      setContent(currentPage.content);
      setLastSaved(new Date(currentPage.lastModified));
    }
  }, [currentPage]);

  // Auto-save title changes
  useEffect(() => {
    if (currentPage && debouncedTitle && debouncedTitle !== currentPage.title) {
      updatePageMutation.mutate({ title: debouncedTitle });
    }
  }, [debouncedTitle, currentPage, updatePageMutation]);

  // Auto-save content changes
  useEffect(() => {
    if (currentPage && debouncedContent !== currentPage.content) {
      updatePageMutation.mutate({ content: debouncedContent });
    }
  }, [debouncedContent, currentPage, updatePageMutation]);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = pages.length;
  const totalWords = pages.reduce((sum, page) => sum + page.wordCount, 0);

  const handlePageSelect = (newPageId: number) => {
    setLocation(`/editor/${newPageId}`);
  };

  const handleCreatePage = () => {
    setShowAddPageModal(true);
  };

  const handlePageCreated = (page: CheatsheetPage) => {
    setLocation(`/editor/${page.id}`);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const formatLastSaved = (date: Date | null) => {
    if (!date) return "";
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "Auto-saved just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Auto-saved ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Auto-saved ${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  };

  const handleExport = () => {
    if (!currentPage) return;
    
    const markdown = `# ${currentPage.title}\n\n${currentPage.content}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Success",
      description: "Page exported successfully",
    });
  };

  const handleShare = () => {
    if (!currentPage) return;
    
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Success",
        description: "Page link copied to clipboard",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    });
  };

  if (!pageId) {
    setLocation("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar
        pages={filteredPages}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPageId={pageId}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
        totalPages={totalPages}
        totalWords={totalWords}
        isLoading={pagesLoading}
      />
      
      <div className="flex-1 flex flex-col">
        {pageLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-green-300 font-mono">Loading page...</div>
          </div>
        ) : currentPage ? (
          <>
            {/* Content Header */}
            <div className="bg-gray-900 border-b border-green-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-2xl font-semibold text-green-400 border-none outline-none focus:ring-0 bg-transparent p-0 w-96 font-mono"
                    placeholder="Page title..."
                  />
                  <span className="text-sm text-green-300 font-mono">
                    {formatLastSaved(lastSaved)}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex-1 bg-gray-900">
              <RichTextEditor
                content={content}
                onChange={handleContentChange}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-green-300 font-mono">Page not found</div>
          </div>
        )}
      </div>

      <AddPageModal 
        open={showAddPageModal} 
        onOpenChange={setShowAddPageModal}
        onPageCreated={handlePageCreated}
      />
    </div>
  );
}
