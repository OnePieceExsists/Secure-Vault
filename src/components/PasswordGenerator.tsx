
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Copy, RefreshCw, Eye, EyeOff, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const PasswordGenerator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<GeneratorOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false,
  });

  const generatePassword = useCallback(() => {
    let charset = "";
    if (options.includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.includeNumbers) charset += "0123456789";
    if (options.includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "");
    }

    if (!charset) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < options.length; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(generatedPassword);
    setCopied(false);
  }, [options, toast]);

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: "None", color: "gray" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    if (score <= 2) return { strength: 25, label: "Weak", color: "red" };
    if (score <= 4) return { strength: 50, label: "Fair", color: "yellow" };
    if (score <= 5) return { strength: 75, label: "Good", color: "blue" };
    return { strength: 100, label: "Strong", color: "green" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <Card className="bg-slate-700/50 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white">Generated Password</CardTitle>
          <CardDescription className="text-slate-300">
            Your secure password will appear here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              value={password}
              readOnly
              type={showPassword ? "text" : "password"}
              className="bg-slate-800 border-slate-600 text-white font-mono pr-20"
              placeholder="Click 'Generate' to create a password"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                disabled={!password}
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {password && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Password Strength</span>
                <span className={`font-medium text-${strength.color}-400`}>{strength.label}</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 bg-${strength.color}-500`}
                  style={{ width: `${strength.strength}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-700/50 border-slate-600/50">
        <CardHeader>
          <CardTitle className="text-white">Generator Options</CardTitle>
          <CardDescription className="text-slate-300">
            Customize your password requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Password Length: {options.length}</Label>
            <Slider
              value={[options.length]}
              onValueChange={(value) => setOptions(prev => ({ ...prev, length: value[0] }))}
              max={128}
              min={4}
              step={1}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeUppercase: checked as boolean }))
                }
              />
              <Label htmlFor="uppercase" className="text-white">Uppercase (A-Z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="lowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeLowercase: checked as boolean }))
                }
              />
              <Label htmlFor="lowercase" className="text-white">Lowercase (a-z)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="numbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeNumbers: checked as boolean }))
                }
              />
              <Label htmlFor="numbers" className="text-white">Numbers (0-9)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="symbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, includeSymbols: checked as boolean }))
                }
              />
              <Label htmlFor="symbols" className="text-white">Symbols (!@#$%)</Label>
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="exclude-similar"
                checked={options.excludeSimilar}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, excludeSimilar: checked as boolean }))
                }
              />
              <Label htmlFor="exclude-similar" className="text-white">Exclude similar characters (i, l, 1, L, o, 0, O)</Label>
            </div>
          </div>

          <Button 
            onClick={generatePassword} 
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordGenerator;
