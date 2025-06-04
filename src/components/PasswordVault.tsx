
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Eye, EyeOff, Copy, Edit, Trash2, Globe, CreditCard, Wifi, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PasswordEntry {
  id: string;
  title: string;
  username: string;
  password: string;
  website: string;
  category: string;
  notes: string;
  createdAt: Date;
  lastUpdated: Date;
}

const PasswordVault = () => {
  const { toast } = useToast();
  const [passwords, setPasswords] = useState<PasswordEntry[]>([
    {
      id: "1",
      title: "GitHub",
      username: "john.doe@email.com",
      password: "SuperSecure123!",
      website: "https://github.com",
      category: "Development",
      notes: "Main development account",
      createdAt: new Date("2024-01-15"),
      lastUpdated: new Date("2024-03-01"),
    },
    {
      id: "2",
      title: "Google Account",
      username: "john.doe@gmail.com",
      password: "MySecretPass456#",
      website: "https://accounts.google.com",
      category: "Personal",
      notes: "Primary email account",
      createdAt: new Date("2024-02-01"),
      lastUpdated: new Date("2024-02-15"),
    },
    {
      id: "3",
      title: "Netflix",
      username: "john.doe@email.com",
      password: "StreamingLife789$",
      website: "https://netflix.com",
      category: "Entertainment",
      notes: "Family plan subscription",
      createdAt: new Date("2024-03-10"),
      lastUpdated: new Date("2024-03-10"),
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<Partial<PasswordEntry>>({
    title: "",
    username: "",
    password: "",
    website: "",
    category: "Personal",
    notes: "",
  });

  const categories = ["Personal", "Work", "Development", "Entertainment", "Shopping", "Finance"];
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Work":
      case "Development":
        return <Key className="h-4 w-4" />;
      case "Entertainment":
        return <Globe className="h-4 w-4" />;
      case "Shopping":
      case "Finance":
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Wifi className="h-4 w-4" />;
    }
  };

  const filteredPasswords = passwords.filter(password => {
    const matchesSearch = password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         password.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || password.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to copy ${type.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  const addPassword = () => {
    if (!newPassword.title || !newPassword.password) {
      toast({
        title: "Error",
        description: "Title and password are required",
        variant: "destructive",
      });
      return;
    }

    const passwordEntry: PasswordEntry = {
      ...newPassword as PasswordEntry,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    setPasswords(prev => [passwordEntry, ...prev]);
    setNewPassword({
      title: "",
      username: "",
      password: "",
      website: "",
      category: "Personal",
      notes: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Password added to vault",
    });
  };

  const deletePassword = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Deleted",
      description: "Password removed from vault",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search passwords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600 text-white">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Password
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New Password</DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new password to your secure vault
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newPassword.title}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3 bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input
                  id="username"
                  value={newPassword.username}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, username: e.target.value }))}
                  className="col-span-3 bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, password: e.target.value }))}
                  className="col-span-3 bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">Website</Label>
                <Input
                  id="website"
                  value={newPassword.website}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, website: e.target.value }))}
                  className="col-span-3 bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select value={newPassword.category} onValueChange={(value) => setNewPassword(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">Notes</Label>
                <Textarea
                  id="notes"
                  value={newPassword.notes}
                  onChange={(e) => setNewPassword(prev => ({ ...prev, notes: e.target.value }))}
                  className="col-span-3 bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addPassword} className="bg-purple-600 hover:bg-purple-700">
                Add Password
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Password Cards */}
      <div className="grid gap-4">
        {filteredPasswords.length === 0 ? (
          <Card className="bg-slate-700/50 border-slate-600/50">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No passwords found</h3>
                <p className="text-slate-400">Try adjusting your search or add a new password</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPasswords.map((password) => (
            <Card key={password.id} className="bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(password.category)}
                    <div>
                      <CardTitle className="text-white">{password.title}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {password.username}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                    {password.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={showPasswords[password.id] ? password.password : "••••••••••••"}
                    readOnly
                    className="bg-slate-800 border-slate-600 text-white font-mono"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePasswordVisibility(password.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    {showPasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(password.password, "Password")}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                {password.website && (
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe className="h-3 w-3" />
                    <span className="cursor-pointer hover:text-purple-400" onClick={() => copyToClipboard(password.website, "Website")}>
                      {password.website}
                    </span>
                  </div>
                )}
                
                {password.notes && (
                  <p className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                    {password.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Updated {password.lastUpdated.toLocaleDateString()}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-slate-400 hover:text-white h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePassword(password.id)}
                      className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PasswordVault;
