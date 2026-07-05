import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Match } from '../types';
import { Clock, Trophy, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/axios';
import { getFlagUrl } from '../lib/flags';
import { formatVND } from '../lib/format';
import toast from 'react-hot-toast';

interface MatchCardProps {
  match: Match;
  index: number;
  userPrediction?: any;
}

export default function MatchCard({ match, index, userPrediction }: MatchCardProps) {
  const [prediction, setPrediction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prediction) {
      toast.error('Vui lòng nhập dự đoán của bạn');
      return;
    }

    const requiresNumber = !['Đội thắng', 'Đội có ít cú vô-lê hơn', 'Đội vô địch'].includes(match.criterionLabel || 'Đội thắng');
    if (requiresNumber) {
      if (isNaN(Number(prediction))) {
        toast.error('Dự đoán này yêu cầu bạn phải nhập số, không được nhập chữ!');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await api.post('/predictions', {
        matchId: match.id,
        predictedValue: prediction
      });
      toast.success('Dự đoán đã được gửi thành công!');
    } catch (error) {
      toast.error('Gửi dự đoán thất bại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case 'OPEN': return <span className="badge badge-open">Mở dự đoán</span>;
      case 'LOCKED': return <span className="badge badge-locked">Đã khóa</span>;
      case 'SETTLED': return <span className="badge badge-settled">Đã chốt</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass p-6 relative overflow-hidden group hover:border-primary/50 transition-colors"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-0" />
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
            {match.matchStage || 'Vòng bảng'}
          </span>
          <span className="text-sm text-slate-400 flex items-center gap-1 ml-2">
            <Clock className="w-4 h-4" />
            {new Date(match.matchTime).toLocaleString('vi-VN')}
          </span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
          <Trophy className="w-4 h-4" />
          {formatVND(match.prizePool)}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 px-4">
        <div className="flex flex-col items-center flex-1 gap-2">
          <img src={getFlagUrl(match.teamA)} alt={match.teamA} className="w-12 h-8 object-cover rounded-sm shadow-md" />
          <div className="text-xl font-bold text-center">{match.teamA}</div>
        </div>
        
        <div className="text-sm font-black text-slate-500 px-4">VS</div>
        
        <div className="flex flex-col items-center flex-1 gap-2">
          <img src={getFlagUrl(match.teamB)} alt={match.teamB} className="w-12 h-8 object-cover rounded-sm shadow-md" />
          <div className="text-xl font-bold text-center">{match.teamB}</div>
        </div>
      </div>

      {match.status === 'SETTLED' && match.finalResult && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <span className="text-sm text-slate-400 uppercase tracking-wider block mb-1">Kết quả ({match.criterionLabel || 'Đội thắng'})</span>
          <span className="text-2xl font-black text-primary drop-shadow-md">{match.finalResult}</span>
          
          {userPrediction && (
            <div className={`mt-4 p-3 rounded-md font-bold text-lg ${userPrediction.predictedValue === match.finalResult ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {userPrediction.predictedValue === match.finalResult 
                ? '🎉 Chúc mừng bạn đã chiến thắng!' 
                : '😔 Chúc bạn may mắn lần sau'}
            </div>
          )}

          {match.finalNote && (
            <div className="mt-3 text-sm text-slate-300 bg-black/20 p-2 rounded-md border border-slate-700/50">
              <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Ghi chú</span>
              {match.finalNote}
            </div>
          )}
        </div>
      )}

      {match.status === 'OPEN' && (
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="text-center mb-4 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <span className="text-xs text-slate-400 block mb-1">Tiêu chí dự đoán trận này:</span>
            <span className="text-sm font-bold text-emerald-400">{match.criterionLabel || 'Đội thắng'}</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Bạn dự đoán kết quả là bao nhiêu?</label>
            {['Đội thắng', 'Đội có ít cú vô-lê hơn', 'Đội vô địch'].includes(match.criterionLabel || 'Đội thắng') ? (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPrediction(match.teamA)}
                  className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                    prediction === match.teamA 
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {prediction === match.teamA && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  <span className="font-semibold">{match.teamA}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPrediction(match.teamB)}
                  className={`py-3 px-4 rounded-lg flex items-center justify-center gap-2 border transition-all ${
                    prediction === match.teamB 
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  {prediction === match.teamB && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  <span className="font-semibold">{match.teamB}</span>
                </button>
              </div>
            ) : (
              <input
                type="number"
                value={prediction}
                onChange={e => setPrediction(e.target.value)}
                placeholder="Nhập con số chênh lệch..."
                className="glass-input w-full p-4 text-center font-bold text-xl"
                required
              />
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !prediction}
            className="w-full btn-primary mt-2"
          >
            {isSubmitting ? 'Đang gửi...' : 'Chốt Dự Đoán'}
          </button>
        </form>
      )}
    </motion.div>
  );
}
