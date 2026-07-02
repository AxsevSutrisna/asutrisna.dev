import { Home, ArrowLeft} from'lucide-react';
import { Link} from'react-router-dom';
import { Button} from'../components/ui/button';

export default function NotFoundPage() {
 const handleGoBack = () => {
 window.history.back();
};

 return (
 <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--color-backdrop-base)' }}>
 <div className="text-center">
 {/* 404 Number */}
 <div className="mb-8">
 <h1 className="text-9xl font-bold text-white font-display mb-4 animate-bounce">
 404
 </h1>
 <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--color-primary-light)' }}></div>
 </div>

 {/* Message */}
 <div className="mb-8">
 <h2 className="text-3xl font-semibold text-white font-display mb-4">
 Oops! Halaman Tidak Ditemukan
 </h2>
 <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
 Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak pernah ada.
 </p>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
 <Button
 onClick={handleGoBack}
 variant="ghost"
 size="default"
 className="flex items-center gap-2 px-6 py-3 cursor-target"
 >
 <ArrowLeft size={20} />
 Kembali
 </Button>

 <Button asChild variant="default" size="default" className="flex items-center gap-2 px-6 py-3 cursor-target">
 <Link to="/">
 <Home size={20} />
 Beranda
 </Link>
 </Button>
 </div>



 </div>
 </div>
 );
}