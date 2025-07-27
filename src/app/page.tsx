"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { WandSparkles, Settings } from "lucide-react";

import { useState } from "react";

import SettingsPage from "./settings";

export default function Home() {
  const [word1, setWord1] = useState("Word");
  const [word2, setWord2] = useState("Word");

  const [points1, setPoints1] = useState(0);
  const [points2, setPoints2] = useState(0);

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
      setPoints1(data.points1);
      setPoints2(data.points2);
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

      <Card className="mt-5 mb-2 items-center w-auto">
        <CardContent>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold">{word1}</h1>
            <div className="ml-3 px-2 py-0.5 border-gray-400 border-1 rounded-sm bg-secondary text-secondary-foreground">
              <h2 className="text-xl"> {points1} </h2>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5 mb-2 items-center w-auto">
        <CardContent>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold">{word2}</h1>
            <div className="ml-3 px-2 py-0.5 border-gray-400 border-1 rounded-sm bg-secondary text-secondary-foreground">
              <h2 className="text-xl"> {points2} </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="bg-primary mx-1 my-5 items-center"
        >
          <WandSparkles />
          Generate
        </Button>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="lg" className="mx-1">
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
