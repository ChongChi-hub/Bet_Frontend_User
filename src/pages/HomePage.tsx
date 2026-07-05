import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';
import type { Match, User } from '../types';
import MatchCard from '../components/MatchCard';
import { Activity, LogOut, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { formatVND } from '../lib/format';

export default function HomePage() {
  const { fullName, logout } = useAuth();

  const { data: matches, isLoading: matchesLoading } = useQuery<Match[]>({
    queryKey: ['active-matches'],
    queryFn: async () => {
      const res = await api.get('/matches');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: myPredictions } = useQuery<any[]>({
    queryKey: ['my-predictions'],
    queryFn: async () => {
      const res = await api.get('/predictions/my');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: userProfile } = useQuery<User>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data;
    },
    refetchInterval: 10000,
  });

  if (matchesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg hidden sm:block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Minigame Cược Bóng
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-emerald-400">{formatVND(userProfile?.totalBalance || 0)}</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-200">{fullName}</div>
              <div className="text-xs text-primary flex items-center justify-end gap-1">
                Người chơi
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Các trận đấu hôm nay</h1>
            <p className="text-slate-400">Phân tích kỹ lưỡng và đưa ra dự đoán của bạn.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches?.map((match, index) => {
            const userPrediction = myPredictions?.find(p => p.match.id === match.id);
            return <MatchCard key={match.id} match={match} index={index} userPrediction={userPrediction} />
          })}
          {matches?.length === 0 && (
            <div className="col-span-full text-center p-12 glass border-dashed border-2 border-slate-700 text-slate-400 rounded-2xl">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
              Chưa có trận đấu nào đang mở. Vui lòng quay lại sau!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
