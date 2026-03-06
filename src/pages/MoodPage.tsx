import { useState, useRef, useEffect } from 'react';
import { Camera, Activity, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

type AnalysisResult = {
  fatigue: number;
  emotion: string;
  feedback: string;
};

export default function MoodPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError('');
    } catch (err) {
      setError('无法访问摄像头，请检查权限设置。');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // TODO: 将 base64Image 发送给后端进行情绪分析
      // 模拟后端请求延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟后端返回的数据
      const mockResult: AnalysisResult = {
        fatigue: Math.floor(Math.random() * 40) + 20, // 20-60 random
        emotion: ['平静', '开心', '疲惫', '专注'][Math.floor(Math.random() * 4)],
        feedback: '这是一个模拟的分析结果。请对接真实的后端 API 以获取准确的情绪分析和建议。'
      };
      
      setResult(mockResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('分析失败，请重试。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 shrink-0">
        <h2 className="text-lg font-medium">心情监测</h2>
      </header>

      <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                实时面部情绪分析
              </h3>
              <p className="text-sm text-gray-500 mt-1">通过摄像头捕捉微表情，分析您的疲劳程度与情绪状态</p>
            </div>
            {!stream ? (
              <button 
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                开启摄像头
              </button>
            ) : (
              <button 
                onClick={stopCamera}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                关闭摄像头
              </button>
            )}
          </div>

          <div className="p-6 flex flex-col items-center justify-center min-h-[400px] bg-gray-50 relative">
            {error && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center gap-2 z-10 shadow-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              {!stream ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Camera className="w-12 h-12 mb-4 opacity-50" />
                  <p>摄像头未开启</p>
                  <p className="text-xs mt-2 opacity-70">需要用到用户授权</p>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-400" />
                  <p className="font-medium tracking-wider">正在分析微表情...</p>
                </div>
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />

            {stream && (
              <button
                onClick={captureAndAnalyze}
                disabled={isAnalyzing}
                className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                {isAnalyzing ? '分析中...' : '开始分析'}
              </button>
            )}
          </div>
        </div>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">分析结果</h4>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-700 font-medium">疲劳程度</span>
                    <span className="text-2xl font-bold text-blue-600">{result.fatigue}<span className="text-sm text-gray-400 font-normal">/100</span></span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.fatigue}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        result.fatigue > 70 ? 'bg-red-500' : result.fatigue > 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <span className="text-gray-700 font-medium block mb-2">情绪状态</span>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    {result.emotion}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center">
              <h4 className="text-blue-100 text-sm font-medium mb-2">大白建议</h4>
              <p className="text-lg leading-relaxed font-medium">
                "{result.feedback}"
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
