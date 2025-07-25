"use client";

import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { WandSparkles, Settings } from "lucide-react";

import { useState } from "react";

import SettingsPage from "./settings.js";

export default function Home() {
  const [word1, setWord1] = useState("Word");
  const [word2, setWord2] = useState("Word");

  const [mode, setMode] = useState("drawing");

  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleGenerate = async () => {
    const apiKey = localStorage.getItem("openaiApiKey");

    if (!apiKey) {
      toast.error("Please set your OpenAI API key in the settings.");
      return;
    }

    const response = await fetch("/api", {
      method: "GET",
      headers: {
        apiKey: apiKey,
        mode: mode,
      },
    });

    if (!response.ok) {
      toast.error("Error: " + response.text());
    }

    try {
      const data = await response.json();

      setWord1(data.word1);
      setWord2(data.word2);
    } catch (error) {
      toast.error("Error parsing response: " + error.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Tabs
        value={mode}
        onValueChange={setMode}
        className="items-center justify-between my-5 w-full"
      >
        <TabsList>
          <TabsTrigger value="drawing">Drawing</TabsTrigger>
          <TabsTrigger value="explaining">Explaining</TabsTrigger>
          <TabsTrigger value="acting">Acting</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mt-5 mb-2 items-center w-48">
        <CardContent>
          <h1 className="text-xl">
            <b> {word1} </b>
          </h1>
        </CardContent>
      </Card>
      <Card className="mb-5 mt-2 items-center w-48">
        <CardContent>
          <h1 className="text-xl">
            <b> {word2} </b>
          </h1>
        </CardContent>
      </Card>

      <div className="flex items-center">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="mx-1 bg-blue-200 text-black my-5 items-center"
        >
          <WandSparkles />
          Generate
        </Button>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="mx-1">
              <Settings />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Settings</DialogTitle>
            <SettingsPage setOpen={setSettingsOpen} />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
