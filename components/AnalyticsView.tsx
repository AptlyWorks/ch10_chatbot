import { 
  Settings, 
  Bot, 
  Headphones, 
  Star, 
  Smile, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  PlusCircle, 
  Send 
} from "lucide-react";

export default function AnalyticsView() {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] relative">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0">
        <h1 className="text-xl font-bold text-[#0052cc]">프리미엄 무선 이어폰 Pro</h1>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Analytics Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 pb-32">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* AI Summary Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-[#0052cc] flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <p className="text-gray-800 leading-relaxed text-[15px]">
                1,240개의 최근 고객 리뷰를 바탕으로 한 <span className="font-semibold text-[#0052cc]">프리미엄 무선 이어폰 Pro</span>의 상세 리뷰 분석입니다. 전반적인 반응은 매우 긍정적이며, 주로 배터리 성능과 노이즈 캔슬링 기능에 기인합니다.
              </p>
              <span className="text-xs text-gray-500">방금 생성됨</span>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Left Column: Overall Rating */}
            <div className="col-span-1 bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#dbeafe] flex items-center justify-center">
                <Headphones className="w-10 h-10 text-[#0052cc]" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 mb-1">프리미엄 무선 이어폰 Pro</h2>
                <p className="text-sm text-gray-500">총 1,240개 리뷰 기반</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">4.8</span>
                  <span className="text-xl text-gray-500">/ 5.0</span>
                </div>
                <div className="flex text-[#00a854]">
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                  <Star className="w-6 h-6 fill-current" />
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="col-span-2 flex flex-col gap-6">
              
              {/* Sentiment Distribution */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 mb-6 font-medium text-sm">
                  <Smile className="w-4 h-4" />
                  <span>감정 분포</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-4 rounded-full overflow-hidden flex mb-3">
                  <div className="bg-[#00a854] h-full" style={{ width: '85%' }}></div>
                  <div className="bg-gray-400 h-full" style={{ width: '10%' }}></div>
                  <div className="bg-[#ff4d4f] h-full" style={{ width: '5%' }}></div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-[#00a854]"></div>
                    <span>긍정적 (85%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span>중립적 (10%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-3 h-3 rounded-full bg-[#ff4d4f]"></div>
                    <span>부정적 (5%)</span>
                  </div>
                </div>
              </div>

              {/* Strengths and Weaknesses */}
              <div className="grid grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-[#e6fcf0] border border-[#b7eb8f] rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                    <ThumbsUp className="w-5 h-5 text-[#00a854]" />
                    <span>주요 장점</span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-2 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#00a854] shrink-0 mt-0.5" />
                      매우 긴 배터리 수명
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#00a854] shrink-0 mt-0.5" />
                      최상급 노이즈 캔슬링
                    </li>
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-[#fff1f0] border border-[#ffa39e] rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 font-semibold text-gray-800 mb-4">
                    <ThumbsDown className="w-5 h-5 text-[#ff4d4f]" />
                    <span>개선 필요 사항</span>
                  </div>
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-start gap-2 text-gray-700 text-sm">
                      <AlertCircle className="w-4 h-4 text-[#ff4d4f] shrink-0 mt-0.5" />
                      높은 가격대
                    </li>
                    <li className="flex items-start gap-2 text-gray-700 text-sm">
                      <AlertCircle className="w-4 h-4 text-[#ff4d4f] shrink-0 mt-0.5" />
                      다소 무거운 충전 케이스
                    </li>
                  </ul>
                </div>
              </div>

              {/* Popular Keywords */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                  <Tag className="w-4 h-4" />
                  <span>인기 키워드</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#배터리</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#노이즈캔슬링</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#음질</span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#착용감</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa] to-transparent pt-10 pb-8 px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
          <div className="w-full relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 focus-within:border-[#0052cc] focus-within:ring-1 focus-within:ring-[#0052cc] transition-all">
            <button className="p-1 mr-2 text-gray-400 hover:text-gray-600 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </button>
            <input 
              type="text" 
              placeholder="이 리뷰들에 대해 구체적인 질문을 해보세요..."
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-[15px]"
            />
            <button className="bg-[#0052cc] hover:bg-[#0047b3] text-white p-2 rounded-lg transition-colors ml-2">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
