import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, Settings, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  image?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: '你好，我是大白。你是一个高级心理咨询师，你需要完成共情回应、情绪分析，并基于CBT提供简易疏导建议。今天感觉怎么样？',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string, imageBase64?: string) => {
    if (!text.trim() && !imageBase64) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      image: imageBase64,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: 对接真实后端 API
      // 这里是模拟的后端请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      let mockResponse = '这是一个模拟的回复。在实际项目中，这里将对接您的后端大模型接口。';
      if (imageBase64) {
        mockResponse = '我看到了你上传的图片。请对接后端 API 以进行真实的图像分析和心理疏导。';
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: mockResponse,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: '抱歉，我暂时无法回应，请稍后再试。',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      handleSend('分享了一张图片', base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
        <h2 className="text-lg font-medium">树洞咨询</h2>
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-500 text-white'
              }`}>
                {msg.role === 'user' ? 'U' : '大'}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="User upload" className="max-w-full h-auto rounded-lg mb-2" />
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[70%] flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">大</div>
              <div className="p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">大白正在思考...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-gray-50 rounded-3xl p-2 border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors shrink-0"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="告诉大白你的烦恼..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 max-h-32 min-h-[44px] outline-none"
            rows={1}
          />

          <div className="flex items-center gap-1 shrink-0">
            <button 
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
              className={`p-3 rounded-full transition-all relative ${
                isRecording ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5 relative z-10" />
              {isRecording && (
                <motion.div 
                  className="absolute inset-0 bg-blue-400 rounded-full opacity-30"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </button>
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() && !isLoading}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400">
          长按麦克风可以语音输入
        </div>
      </div>
    </div>
  );
}
