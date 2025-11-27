"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { PageView } from "@/components/layout/PageView";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <PageView />
    </div>
  );
}
