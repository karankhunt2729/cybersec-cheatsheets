import { useState } from "react";
import { Bold, Italic, Underline, Heading, Code, List, Link2, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormatting = (before: string, after: string = "") => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const newContent = 
      content.substring(0, start) + 
      before + selectedText + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Reset cursor position after React re-render
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatHTML = (html: string) => {
    // Simple HTML rendering for preview
    return html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h|u|c])(.+)$/gim, '<p>$1</p>');
  };

  return (
    <div className="h-full p-6">
      {/* Editor Toolbar */}
      <div className="border-b border-green-600 pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 border-r border-green-600 pr-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("**", "**")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("*", "*")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("__", "__")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1 border-r border-green-600 pr-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("# ")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Heading className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("`", "`")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Code className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("* ")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("[", "](url)")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Link2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("| Column 1 | Column 2 |\n|----------|----------|\n| ", " | |\n")}
                className="p-2 text-green-400 hover:text-green-300"
              >
                <Table className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreview ? "outline" : "default"}
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              Edit
            </Button>
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(true)}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="h-full max-h-[calc(100vh-200px)]">
        {isPreview ? (
          <div 
            className="prose prose-slate max-w-none h-full overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: formatHTML(content) }}
          />
        ) : (
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start writing your cheatsheet content..."
            className="w-full h-full resize-none border-none focus:ring-0 text-base leading-relaxed bg-gray-900 text-green-300 font-mono"
          />
        )}
      </div>
    </div>
  );
}
