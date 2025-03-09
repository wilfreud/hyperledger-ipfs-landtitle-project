import { useState } from 'react';
import { createLandTitle } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function CreateLandTitle() {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    owner: '',
    description: '',
    value: '',
    document: '',
    timestamp: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createLandTitle({
        Owner: formData.owner,
        PropertyDescription: formData.description,
        PropertyValue: Number(formData.value),
        document: formData.document,
        Timestamp: formData.timestamp,
        Organization: '',
        ID: '',
      });
      toast({
        title: 'Success',
        description: 'Land title created successfully',
      });
      setOpen(false);
      setFormData({
        owner: '',
        description: '',
        value: '',
        document: '',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create land title',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Land Title
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-slate-100 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Create New Land Title</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-400">Owner</Label>
            <Input
              placeholder="Enter owner name"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Description</Label>
            <Textarea
              placeholder="Enter property description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Value</Label>
            <Input
              type="number"
              placeholder="Enter property value"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-400">Document</Label>
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64 = reader.result?.toString().split(',')[1];
                    setFormData({ ...formData, document: base64 || '' });
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="bg-slate-800 border-slate-700 text-slate-100"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}