import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { CheatsheetPage } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmationModalProps {
  page: CheatsheetPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteConfirmationModal({
  page,
  open,
  onOpenChange,
}: DeleteConfirmationModalProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const deletePageMutation = useMutation({
    mutationFn: async (pageId: number) => {
      await apiRequest("DELETE", `/api/pages/${pageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      
      // If we're currently viewing the deleted page, redirect to home
      if (location.includes(`/editor/${page?.id}`)) {
        setLocation("/");
      }
      
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Page deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (page) {
      deletePageMutation.mutate(page.id);
    }
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-gray-900 border border-green-500">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-900 bg-opacity-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-400 w-6 h-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-2 text-green-400 font-mono">Delete Page</DialogTitle>
          </DialogHeader>
          <p className="text-green-300 mb-6 font-mono text-sm">
            Are you sure you want to delete "<span className="font-medium text-green-400">{page.title}</span>"? 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 border-green-600 text-green-400 hover:bg-black font-mono"
              disabled={deletePageMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-mono"
              disabled={deletePageMutation.isPending}
            >
              {deletePageMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
