import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { CheatsheetPage, InsertCheatsheetPage } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPageCreated: (page: CheatsheetPage) => void;
}

export default function AddPageModal({
  open,
  onOpenChange,
  onPageCreated,
}: AddPageModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const createPageMutation = useMutation({
    mutationFn: async (pageData: InsertCheatsheetPage) => {
      const response = await apiRequest("POST", "/api/pages", pageData);
      return response.json();
    },
    onSuccess: (newPage: CheatsheetPage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      onPageCreated(newPage);
      handleClose();
      toast({
        title: "Success",
        description: "Page created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create page",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const content = description.trim() ? `<p>${description}</p>` : "";
    createPageMutation.mutate({
      title: title.trim(),
      content,
    });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-green-500" aria-describedby="create-page-description">
        <DialogHeader>
          <DialogTitle className="text-green-400 font-mono">Create New Page</DialogTitle>
        </DialogHeader>
        <div id="create-page-description" className="sr-only">
          Create a new cybersecurity cheatsheet page with a title and optional description.
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-green-400 font-mono">Page Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., SQL Injection Guide"
              required
              className="mt-2 bg-black border-green-600 text-green-400 font-mono"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-green-400 font-mono">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the page content..."
              rows={3}
              className="resize-none mt-2 bg-black border-green-600 text-green-400 font-mono"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 border-green-600 text-green-400 hover:bg-black font-mono">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700 text-black font-mono"
              disabled={!title.trim() || createPageMutation.isPending}
            >
              {createPageMutation.isPending ? "Creating..." : "Create Page"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
