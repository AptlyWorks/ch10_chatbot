import {
  MessageSquare,
  Bookmark,
  BarChart2,
  TrendingUp,
  User,
  HelpCircle,
  Plus,
  Bot,
  Database
} from "lucide-react";

interface SidebarProps {
  activeView: "chat" | "analytics";
  setActiveView: (view: "chat" | "analytics") => void;
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <aside className="w-64 h-full bg-[#f8f9fa] border-r border-gray-200 flex flex-col justify-between py-6 px-4">
      {/* Top Section */}
      <div>
        {/* Logo and Title */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#0052cc] flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#0052cc] text-lg leading-tight">
              Review<br />Concierge
            </span>
            <span className="text-xs text-gray-500">AI Assistant</span>
          </div>
        </div>

        {/* New Chat Button */}
        <button 
          className="w-full bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-lg py-3 flex items-center justify-center gap-2 mb-6 font-medium transition-colors"
          onClick={() => setActiveView("chat")}
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setActiveView("chat")}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === "chat"
                ? "bg-[#69ffb4] text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Previous Chats
          </button>
          
          <button
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bookmark className="w-5 h-5" />
            Saved Insights
          </button>

          <button
            onClick={() => setActiveView("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === "analytics"
                ? "bg-[#69ffb4] text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            Analytics
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Market Trends
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-1">
        <button 
          onClick={async () => {
            alert("데이터 인덱싱을 시작합니다. 잠시만 기다려주세요...");
            try {
              const res = await fetch("/api/index-data", { method: "POST" });
              const data = await res.json();
              if (data.success) {
                alert("인덱싱 완료: " + data.message);
              } else {
                alert("인덱싱 실패: " + data.error);
              }
            } catch (err: any) {
              alert("오류 발생: " + err.message);
            }
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg py-3 flex items-center justify-center gap-2 mb-2 font-medium transition-colors text-sm"
        >
          <Database className="w-4 h-4" />
          샘플 데이터 인덱싱
        </button>

        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <User className="w-5 h-5" />
          Account
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          <HelpCircle className="w-5 h-5" />
          Help
        </button>
      </div>
    </aside>
  );
}
