"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatView from "@/components/ChatView";
import AnalyticsView from "@/components/AnalyticsView";

export default function Home() {
  const [activeView, setActiveView] = useState<"chat" | "analytics">("chat");

  return (
    <main className="flex w-full h-screen overflow-hidden bg-white">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      {activeView === "chat" ? <ChatView /> : <AnalyticsView />}
    </main>
  );
}
