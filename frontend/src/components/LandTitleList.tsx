import { useEffect, useState } from 'react';
import { getLandTitles } from '@/lib/api';
import { LandTitle } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function LandTitleList() {
  const [landTitles, setLandTitles] = useState<LandTitle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchLandTitles();
  }, []);

  const fetchLandTitles = async () => {
    try {
      const data = await getLandTitles();
      setLandTitles(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch land titles',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Land Titles</h2>
        <Button onClick={fetchLandTitles}>Refresh</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landTitles.map((title) => (
            <TableRow key={title.id}>
              <TableCell>{title.id}</TableCell>
              <TableCell>{title.owner}</TableCell>
              <TableCell>{title.description}</TableCell>
              <TableCell>${title.value.toLocaleString()}</TableCell>
              <TableCell>{new Date(title.timestamp).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}