
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordGenerator from "@/components/PasswordGenerator";
import PasswordVault from "@/components/PasswordVault";
import { Shield, Key, Lock, Users } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">SecureVault</h1>
          </div>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Your ultimate password manager and generator. Keep your digital life secure with military-grade encryption.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-purple-800/50 to-blue-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-200">Passwords Stored</CardTitle>
              <Key className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">24</div>
              <p className="text-xs text-purple-300">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-800/50 to-cyan-800/50 border-blue-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-200">Security Score</CardTitle>
              <Lock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">87%</div>
              <p className="text-xs text-blue-300">Strong security</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-cyan-800/50 to-teal-800/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-200">Shared Items</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3</div>
              <p className="text-xs text-cyan-300">Family vault</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
                <TabsTrigger 
                  value="generator"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Password Generator
                </TabsTrigger>
                <TabsTrigger 
                  value="vault"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  Password Vault
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator" className="mt-6">
                <PasswordGenerator />
              </TabsContent>
              
              <TabsContent value="vault" className="mt-6">
                <PasswordVault />
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Index;
