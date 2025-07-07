import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import type { CheatsheetPage } from "@shared/schema";
import DeleteConfirmationModal from "./delete-confirmation-modal";

interface PageListProps {
  pages: CheatsheetPage[];
  selectedPageId: number | null;
  onPageSelect: (pageId: number) => void;
  isLoading: boolean;
}

export default function PageList({
  pages,
  selectedPageId,
  onPageSelect,
  isLoading,
}: PageListProps) {
  const [pageToDelete, setPageToDelete] = useState<CheatsheetPage | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, page: CheatsheetPage) => {
    e.stopPropagation();
    setPageToDelete(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-black rounded-lg animate-pulse border border-green-600">
            <div className="h-4 bg-green-600 rounded mb-2"></div>
            <div className="h-3 bg-green-600 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="text-center text-green-300 py-8">
        <p className="text-sm font-mono">No pages found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            onClick={() => onPageSelect(page.id)}
            className={`group p-3 rounded-lg cursor-pointer border transition-all ${
              selectedPageId === page.id
                ? "bg-green-600 bg-opacity-20 border-green-600"
                : "hover:bg-black border-transparent hover:border-green-600"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-green-400 truncate font-mono">
                  {page.title}
                </h3>
                <p className="text-xs text-green-300 mt-1 font-mono">
                  Modified {formatDistanceToNow(new Date(page.lastModified), { addSuffix: true })}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs bg-black text-green-400 px-2 py-1 rounded border border-green-600 font-mono">
                    {page.wordCount} words
                  </span>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDeleteClick(e, page)}
                  className="text-green-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteConfirmationModal
        page={pageToDelete}
        open={!!pageToDelete}
        onOpenChange={(open) => !open && setPageToDelete(null)}
      />
    </>
  );
}
