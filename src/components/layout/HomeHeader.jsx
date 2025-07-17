import logo from '../../assets/images/logo.png';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function HomeHeader(){
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent">
      <div className="max-w-8xl mx-auto px-4 py-4 flex justify-between items-center sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Empleate Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-blue-600">Empleate</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-100">
                <UserCircleIcon className="h-8 w-8" />
            </button>
          </div>
      </div>
    </header>
  );
};