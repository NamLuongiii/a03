import {toast} from 'sonner';
import {AlertCircle, CheckCircle2} from 'lucide-react';

export const alerts = {
    // 1. Hàm Xác nhận (Căn giữa phía trên, tối giản)
    confirm: (title: string, description: string, onConfirm: () => void) => {
        toast.custom((t) => (
            <div className="bg-white p-6 rounded-2xl w-[320px] shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <AlertCircle className="text-amber-600" size={24} />
                </div>

                <h3 className="font-semibold text-slate-900 text-lg mb-1 leading-tight">{title}</h3>
                <p className="text-sm text-slate-500 mb-6 px-2">{description}</p>

                <div className="flex gap-2 w-full">
                    <button
                        onClick={() => {
                            onConfirm();
                            toast.dismiss(t);
                        }}
                        className="flex-1 bg-slate-900 hover:bg-black text-white text-sm font-medium py-2.5 rounded-xl transition-colors active:scale-95"
                    >
                        Xác nhận
                    </button>
                    <button
                        onClick={() => toast.dismiss(t)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium py-2.5 rounded-xl transition-colors active:scale-95"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        ), { position: 'top-center', duration: Infinity });
    },

    // 2. Hàm Thành công (Căn giữa phía trên, tối giản)
    confirmSuccess: (title: string, description: string, onClose?: () => void) => {
        toast.custom((t) => (
            <div className="bg-white p-8 rounded-2xl w-[320px] shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
                    <CheckCircle2 className="text-green-600" size={32} />
                </div>

                <h3 className="font-semibold text-slate-900 text-xl mb-1 leading-tight">{title}</h3>
                <p className="text-sm text-slate-500 mb-6">{description}</p>

                <button
                    onClick={() => {
                        toast.dismiss(t);
                        if (onClose) onClose();
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 rounded-xl transition-colors active:scale-95"
                >
                    Đóng
                </button>
            </div>
        ), { position: 'top-center', duration: Infinity });
    }
};