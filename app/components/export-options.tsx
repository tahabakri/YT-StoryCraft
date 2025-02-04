'use client';

import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ExportFormat {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const EXPORT_FORMATS: ExportFormat[] = [
  { 
    id: 'TXT', 
    label: 'TXT', 
    description: 'Plain text format, easily readable on any device',
    icon: <Download className="w-5 h-5" />
  },
  { 
    id: 'DOCX', 
    label: 'DOCX',
    description: 'Microsoft Word format with formatting preserved',
    icon: <Download className="w-5 h-5" />
  },
  { 
    id: 'PDF', 
    label: 'PDF',
    description: 'Professional document format for sharing',
    icon: <Download className="w-5 h-5" />
  }
];

interface ExportOptionsProps {
  content: string;
}

export function ExportOptions({ content }: ExportOptionsProps) {
  const { toast } = useToast();

  const handleExport = async (format: string) => {
    try {
      // Mock export functionality for now
      toast({
        title: 'Export initiated',
        description: `Exporting story as ${format}...`
      });
      
      // Basic text download implementation
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `story.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export complete',
        description: `Story has been exported as ${format}`
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your story',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {EXPORT_FORMATS.map((format) => (
        <button 
          key={format.id}
          onClick={() => handleExport(format.id)}
          className="bg-youtube-surface p-6 rounded-xl hover:border-youtube-accent border-2 border-transparent transition-all group"
        >
          <div className="flex items-center justify-center text-youtube-accent text-2xl mb-2 group-hover:scale-110 transition-transform">
            {format.icon}
            <span className="ml-2">{format.label}</span>
          </div>
          <div className="text-youtube-text-secondary text-sm">
            {format.description}
          </div>
        </button>
      ))}
    </div>
  );
}
