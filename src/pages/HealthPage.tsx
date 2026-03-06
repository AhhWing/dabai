import React, { useState, useEffect } from 'react';
import { Clock, ListTodo, Wind, Play, Pause, RotateCcw, Plus, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function HealthPage() {
  // Pomodoro State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [focusMode, setFocusMode] = useState<25 | 30 | 60>(25);
  const [totalFocusTime, setTotalFocusTime] = useState(0);

  // Mindfulness State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // Todo State
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: '完成项目报告', completed: false },
    { id: '2', text: '回复邮件', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');

  // Pomodoro Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setTotalFocusTime(prev => prev + focusMode);
      // Play sound or notify
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, focusMode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(focusMode * 60);
  };
  const setMode = (mode: 25 | 30 | 60) => {
    setFocusMode(mode);
    setTimeLeft(mode * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Breathing Effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isBreathing) {
      const cycle = () => {
        setBreathPhase('inhale');
        timeout = setTimeout(() => {
          setBreathPhase('hold');
          timeout = setTimeout(() => {
            setBreathPhase('exhale');
            timeout = setTimeout(cycle, 4000); // Exhale for 4s
          }, 2000); // Hold for 2s
        }, 4000); // Inhale for 4s
      };
      cycle();
    }
    return () => clearTimeout(timeout);
  }, [isBreathing]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos([{ id: Date.now().toString(), text: newTodo, completed: false }, ...todos]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center px-6 shrink-0">
        <h2 className="text-lg font-medium">小憩与健康</h2>
      </header>

      <div className="p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="space-y-6">
          {/* Pomodoro Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-8">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                专注番茄钟
              </h3>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                今日已专注 {totalFocusTime} 分钟
              </span>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="120" className="stroke-gray-100" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="128" cy="128" r="120" 
                  className="stroke-orange-500" 
                  strokeWidth="8" 
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "753.6", strokeDashoffset: "0" }}
                  animate={{ strokeDashoffset: `${753.6 - (timeLeft / (focusMode * 60)) * 753.6}` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
              <div className="text-6xl font-light tracking-tighter text-gray-800 tabular-nums">
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              {[25, 30, 60].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setMode(mode as any)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                    focusMode === mode ? "bg-orange-100 text-orange-700" : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {mode} 分钟
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleTimer}
                className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
              >
                {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              <button 
                onClick={resetTimer}
                className="w-14 h-14 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mindfulness Card */}
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 shadow-sm text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-teal-100" />
                正念训练
              </h3>
              <p className="text-teal-100 text-sm mb-8">引导式呼吸，放松身心</p>

              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                  <motion.div 
                    className="absolute inset-0 bg-white/20 rounded-full"
                    animate={
                      isBreathing 
                        ? { scale: breathPhase === 'inhale' ? 1.5 : breathPhase === 'exhale' ? 1 : 1.5 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 4, ease: "easeInOut" }}
                  />
                  <motion.div 
                    className="absolute inset-4 bg-white/30 rounded-full"
                    animate={
                      isBreathing 
                        ? { scale: breathPhase === 'inhale' ? 1.3 : breathPhase === 'exhale' ? 1 : 1.3 }
                        : { scale: 1 }
                    }
                    transition={{ duration: 4, ease: "easeInOut", delay: 0.2 }}
                  />
                  <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center text-teal-600 font-medium shadow-lg">
                    {!isBreathing ? '准备' : breathPhase === 'inhale' ? '吸气' : breathPhase === 'hold' ? '屏息' : '呼气'}
                  </div>
                </div>

                <button 
                  onClick={() => setIsBreathing(!isBreathing)}
                  className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors font-medium border border-white/30"
                >
                  {isBreathing ? '停止训练' : '开始呼吸训练'}
                </button>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Todo List Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-500" />
                备忘录与行程
              </h3>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">大</div>
              <p>做重要事情之前，建议先进行一下正念训练，或者开启专注番茄钟哦。</p>
            </div>

            <form onSubmit={addTodo} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="添加新任务..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button 
                type="submit"
                disabled={!newTodo.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {todos.map(todo => (
                  <motion.div 
                    key={todo.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:bg-gray-50",
                      todo.completed ? "border-transparent bg-gray-50 opacity-60" : "border-gray-100 bg-white shadow-sm"
                    )}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    <button className="text-gray-400 hover:text-blue-500 transition-colors shrink-0">
                      {todo.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5" />}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm transition-all",
                      todo.completed ? "line-through text-gray-500" : "text-gray-800 font-medium"
                    )}>
                      {todo.text}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {todos.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                  暂无任务，今天想做点什么？
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
