
import type { Match } from '../types';

interface LeagueBracketProps {
  matches: Match[];
}

export default function LeagueBracket({ matches }: LeagueBracketProps) {
  const rounds = ['Vòng 1/8', 'Tứ kết', 'Bán kết', 'Chung kết'];
  const grouped = rounds.reduce((acc, round) => {
    acc[round] = matches.filter(m => m.matchStage === round);
    return acc;
  }, {} as Record<string, Match[]>);

  const renderMatch = (match?: Match) => {
    if (!match) {
      return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 min-w-[160px] text-center mb-6 flex flex-col items-center justify-center h-[80px] backdrop-blur-sm relative z-10">
           <span className="text-2xl mb-1">❓</span>
           <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chưa có trận</span>
        </div>
      );
    }
    return (
      <div className="bg-slate-800/80 border border-primary/30 rounded-lg p-3 min-w-[160px] mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)] h-[80px] flex flex-col justify-center relative z-10 hover:border-primary/60 transition-colors cursor-pointer" onClick={() => document.getElementById(`match-${match.id}`)?.scrollIntoView({ behavior: 'smooth' })}>
        <div className="text-sm font-bold truncate text-white text-center">
          {match.teamA} <span className="text-primary font-normal mx-1 text-xs">vs</span> {match.teamB}
        </div>
        <div className="text-[11px] text-slate-400 text-center mt-2 flex justify-center gap-2">
          <span>{new Date(match.matchTime).toLocaleDateString('vi-VN')}</span>
          <span className={match.status === 'PENDING' ? 'text-slate-400' : match.status === 'OPEN' ? 'text-emerald-400' : 'text-rose-400'}>
            {match.status === 'PENDING' ? 'CHƯA MỞ' : match.status === 'OPEN' ? 'MỞ' : 'ĐÓNG'}
          </span>
        </div>
      </div>
    );
  };

  const getMatchesForRound = (round: string, expectedCount: number) => {
    const roundMatches = grouped[round] || [];
    const result = [];
    for (let i = 0; i < expectedCount; i++) {
      result.push(roundMatches[i]);
    }
    return result;
  };

  return (
    <div className="w-full mb-12 glass rounded-2xl p-6 overflow-hidden relative">
      <div className="absolute top-[-50%] left-[-10%] w-[40%] h-[100%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-50%] right-[-10%] w-[40%] h-[100%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <h2 className="text-2xl font-black mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
        SƠ ĐỒ NHÁNH ĐẤU (LEAGUE FORMAT)
      </h2>
      
      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[900px] flex justify-between px-4">
          
          <div className="flex flex-col justify-around w-1/4 px-4 relative">
            <h3 className="text-center font-bold text-blue-400 mb-6 text-sm uppercase tracking-widest bg-blue-400/10 py-2 rounded-lg border border-blue-400/20">Vòng 1/8</h3>
            {getMatchesForRound('Vòng 1/8', 8).map((m, i) => <div key={i}>{renderMatch(m)}</div>)}
          </div>
          
          <div className="flex flex-col justify-around w-1/4 px-4 relative">
            <h3 className="text-center font-bold text-emerald-400 mb-6 text-sm uppercase tracking-widest bg-emerald-400/10 py-2 rounded-lg border border-emerald-400/20">Tứ kết</h3>
            {getMatchesForRound('Tứ kết', 4).map((m, i) => <div key={i}>{renderMatch(m)}</div>)}
          </div>
          
          <div className="flex flex-col justify-around w-1/4 px-4 relative">
            <h3 className="text-center font-bold text-amber-400 mb-6 text-sm uppercase tracking-widest bg-amber-400/10 py-2 rounded-lg border border-amber-400/20">Bán kết</h3>
            {getMatchesForRound('Bán kết', 2).map((m, i) => <div key={i}>{renderMatch(m)}</div>)}
          </div>
          
          <div className="flex flex-col justify-around w-1/4 px-4 relative">
            <h3 className="text-center font-bold text-rose-400 mb-6 text-sm uppercase tracking-widest bg-rose-400/10 py-2 rounded-lg border border-rose-400/20">Chung kết</h3>
            {getMatchesForRound('Chung kết', 1).map((m, i) => <div key={i}>{renderMatch(m)}</div>)}
          </div>
          
        </div>
      </div>
    </div>
  );
}
