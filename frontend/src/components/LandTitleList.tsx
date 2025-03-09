import { useEffect, useState } from "react";
import { getLandTitles, transferLandTitle } from "@/lib/api";
import { LandTitle } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function LandTitleList() {
  const [landTitles, setLandTitles] = useState<LandTitle[]>([]);
  const { toast } = useToast();
  const [transferData, setTransferData] = useState({
    newOwner: "",
    newOrg: "",
  });
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);

  useEffect(() => {
    fetchLandTitles();
  }, []);

  const fetchLandTitles = async () => {
    try {
      const data = await getLandTitles();
      setLandTitles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch land titles",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async () => {
    if (!selectedTitleId) return;
    try {
      await transferLandTitle(selectedTitleId, transferData);
      toast({
        title: "Success",
        description: "Land title transferred successfully",
      });
      setTransferModalOpen(false);
      fetchLandTitles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer land title",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 px-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Land Titles</h2>
        <Button variant="outline" onClick={fetchLandTitles}>
          Refresh
        </Button>
      </div>
      <Table className="min-w-full divide-y divide-gray-200 w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Owner</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landTitles.map((title, index) => (
            <TableRow key={index} className="bg-white">
              <TableCell>{title.Owner}</TableCell>
              <TableCell>{title.PropertyDescription}</TableCell>
              <TableCell>{title.PropertyValue}</TableCell>
              <TableCell>
                {new Date(title.Timestamp).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTitleId(title.ID);
                    setTransferModalOpen(true);
                  }}
                >
                  Transfer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Land Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="New Owner"
              value={transferData.newOwner}
              onChange={(e) =>
                setTransferData({ ...transferData, newOwner: e.target.value })
              }
            />
            <Input
              placeholder="New Organization"
              value={transferData.newOrg}
              onChange={(e) =>
                setTransferData({ ...transferData, newOrg: e.target.value })
              }
            />
            <Button className="w-full" onClick={handleTransfer}>
              Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
