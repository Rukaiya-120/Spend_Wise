import Navbar from "../components/Navbar";
import { User, Users, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">
        <h1 className="text-4xl font-semibold text-slate-800 tracking-tight mb-3 mt-4 text-center">
          Welcome to SpendWise!
        </h1>
        <p className="text-gray-500 mb-12 text-center text-lg">
          How would you like to track your expenses?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-8">
          <SelectionCard
            icon={<User className="w-8 h-8 text-indigo-600" />}
            title="Personal"
            description="Track your individual expenses, set budgets, and manage your personal finances."
            features={[
              "Private expense tracking",
              "Personal budgets and reminders",
              "Category-wise spending insights"
            ]}
            onClick={() => navigate('/dashboard')}
          />

          <SelectionCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Group"
            description="Share expenses with friends, roommates, or family. Split bills and track balances."
            features={[
              "Split expenses easily",
              "Track who owes what",
              "Shared budgets and reminders"
            ]}
            onClick={() => navigate('/groups')}
          />
        </div>

        <p className="text-sm text-gray-400">
          You can switch between personal and group anytime from the dashboard
        </p>
      </main>
    </div>
  );
}

function SelectionCard({ 
  icon, 
  title, 
  description, 
  features, 
  onClick 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[]; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-indigo-100 hover:shadow-lg transition-all text-left flex flex-col items-start w-full group active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${title === 'Personal' ? 'bg-indigo-50' : 'bg-blue-50'} group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-slate-800 mb-3">{title}</h2>
      <p className="text-gray-500 mb-6 text-sm leading-relaxed">{description}</p>
      
      <ul className="space-y-3 mt-auto w-full">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  );
}
