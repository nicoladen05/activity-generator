import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogClose } from "@/components/ui/dialog";

import { toast } from "sonner";

import { Eye, EyeOff } from "lucide-react";

import { useState, useEffect } from "react";

export default function SettingsPage({ setOpen }) {
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [keyIsVisible, setKeyIsVisible] = useState(false);

  const validateApiKey = (key: string) => {
    return key && key.startsWith("sk-") && key.length > 30;
  };

  const handleSave = () => {
    const key = openaiApiKey;

    if (!validateApiKey(key)) {
      toast.error("Invalid OpenAI API Key", {
        description: "Please enter a valid OpenAI API key.",
        duration: 5000,
      });
    } else {
      localStorage.setItem("openaiApiKey", openaiApiKey);
      toast.success("OpenAI API Key saved.");
      setOpen(false);
    }
  };

  useEffect(() => {
    const apiKey = localStorage.getItem("openaiApiKey");
    if (apiKey) {
      setOpenaiApiKey(apiKey);
    }
  }, []);

  return (
    <div className="flex flex-col">
      <b className="text-gray-700 text-sm mb-1"> Openai API Key: </b>
      <div className="relative">
        <Input
          placeholder={"•".repeat(openaiApiKey.length)}
          type={keyIsVisible ? "text" : "password"}
          onChange={(e) => setOpenaiApiKey(e.target.value)}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setKeyIsVisible(!keyIsVisible)}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 end-0 rounded-s-none hover:bg-transparent"
        >
          {keyIsVisible ? <EyeOff /> : <Eye />}
        </Button>
      </div>

      <div className="mt-4 flex justify-end">
        <DialogClose asChild>
          <Button className="mr-2" variant="secondary">
            {" "}
            Close{" "}
          </Button>
        </DialogClose>
        <Button onClick={handleSave}> Save </Button>
      </div>
    </div>
  );
}
