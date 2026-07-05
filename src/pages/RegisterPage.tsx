import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp!');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password
      });
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi đăng ký tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-lg w-full p-8 relative z-10"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <UserPlus className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Tạo Tài Khoản Mới
          </h1>
          <p className="text-slate-400 text-sm">Điền thông tin để bắt đầu tham gia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Username <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="glass-input w-full p-3 bg-slate-800/50" 
              placeholder="VD: nguyenvana"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tên của bạn <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="glass-input w-full p-3 bg-slate-800/50" 
              placeholder="VD: Nguyễn Văn A"
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Mật khẩu <span className="text-red-400">*</span></label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="glass-input w-full p-3 bg-slate-800/50" 
                placeholder="••••••••"
                required 
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Xác nhận <span className="text-red-400">*</span></label>
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="glass-input w-full p-3 bg-slate-800/50" 
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary bg-indigo-500 hover:bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] py-3 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
