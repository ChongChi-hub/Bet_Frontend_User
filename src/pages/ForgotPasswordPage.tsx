import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Generate a 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const serviceId = 'service_r7tkkue';
      const templateId = 'template_owr7sbv';
      const publicKey = '1hlaUvReFm0XPVLqL';

      await emailjs.send(serviceId, templateId, {
        to_email: email,
        otp_code: code
      }, publicKey);
      
      console.log('--- ĐÃ GỬI EMAIL CHỨA MÃ OTP:', code, '---');
      toast.success('Đã gửi mã xác nhận qua Email! Vui lòng kiểm tra hộp thư.');
      setStep(2);
    } catch (error) {
      toast.error('Lỗi khi gửi email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      toast.error('Mã xác nhận không chính xác!');
      return;
    }
    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/auth/reset-password', { email, password: newPassword });
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi đặt lại mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-md w-full p-8 relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <KeyRound className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black mb-2 text-white">
            Quên Mật Khẩu
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 1 ? 'Nhập email để nhận mã khôi phục' : 'Nhập mã xác nhận và mật khẩu mới'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email đã đăng ký</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 p-3 bg-slate-800/50" 
                  placeholder="VD: nguyenvana@gmail.com"
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full btn-primary bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] py-3 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? 'Đang gửi...' : <><Send className="w-4 h-4" /> Gửi Mã Xác Nhận</>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mã xác nhận (OTP)</label>
              <input 
                type="text" 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="glass-input w-full p-3 bg-slate-800/50 text-center tracking-[0.5em] font-bold text-xl" 
                placeholder="------"
                maxLength={6}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu mới</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="glass-input w-full p-3 bg-slate-800/50" 
                placeholder="••••••••"
                required 
                minLength={6}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading || otp.length < 6 || !newPassword}
              className="w-full btn-primary bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)] py-3 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
