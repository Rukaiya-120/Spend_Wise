import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full h-20 px-6 max-w-7xl mx-auto flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-indigo-700 font-semibold text-xl">
        <Wallet className="w-7 h-7" />
        <span className="text-gray-900 tracking-tight">SpendWise</span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
          Login
        </Link>
        <Link 
          to="/signup" 
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
