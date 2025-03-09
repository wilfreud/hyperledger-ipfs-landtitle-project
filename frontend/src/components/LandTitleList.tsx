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
import { Input } from "@/components/ui/input";
import { RefreshCw, Send, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function LandTitleList() {
  const [landTitles, setLandTitles] = useState<LandTitle[]>([]);
  const { toast } = useToast();
  const [transferData, setTransferData] = useState({
    newOwner: "",
    newOrg: "",
  });
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    fetchLandTitles();
  }, []);

  const fetchLandTitles = async () => {
    setIsLoading(true);
    try {
      const data = await getLandTitles();
      setLandTitles(data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch land titles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedTitleId) return;
    setIsTransferring(true);
    try {
      await transferLandTitle(selectedTitleId, transferData);
      toast({
        title: "Success",
        description: "Land title transferred successfully",
      });
      setTransferModalOpen(false);
      setTransferData({ newOwner: "", newOrg: "" });
      await fetchLandTitles();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to transfer land title",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-slate-200">Land Titles</h2>
        <Button
          variant="outline"
          onClick={fetchLandTitles}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-900/50 backdrop-blur-sm overflow-x-auto w-full">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-800/50 border-slate-700">
              <TableHead className="text-slate-400">Owner</TableHead>
              <TableHead className="text-slate-400">Description</TableHead>
              <TableHead className="text-slate-400">Value</TableHead>
              <TableHead className="text-slate-400">Organization</TableHead>
              <TableHead className="text-slate-400">Timestamp</TableHead>
              <TableHead className="text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 6 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="h-4 bg-slate-800 rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : landTitles?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                  No land titles found
                </TableCell>
              </TableRow>
            ) : (
              landTitles?.map((title, index) => (
                <TableRow key={index} className="hover:bg-slate-800/50 border-slate-700">
                  <TableCell className="font-medium text-slate-300">{title.Owner}</TableCell>
                  <TableCell className="text-slate-400">{title.PropertyDescription}</TableCell>
                  <TableCell className="text-slate-400">
                    ${title.PropertyValue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-slate-400">{title.Organization}</TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(title.Timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      onClick={() => {
                        setSelectedTitleId(title.ID);
                        setTransferModalOpen(true);
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Transfer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isTransferModalOpen} onOpenChange={setTransferModalOpen}>
        <DialogContent className="bg-slate-900 text-slate-100 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Transfer Land Title</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-400">New Owner</Label>
              <Input
                placeholder="Enter new owner name"
                value={transferData.newOwner}
                onChange={(e) =>
                  setTransferData({ ...transferData, newOwner: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-400">New Organization</Label>
              <Input
                placeholder="Enter new organization"
                value={transferData.newOrg}
                onChange={(e) =>
                  setTransferData({ ...transferData, newOrg: e.target.value })
                }
                className="bg-slate-800 border-slate-700 text-slate-100"
              />
            </div>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleTransfer}
              disabled={isTransferring}
            >
              {isTransferring ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Transfer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
