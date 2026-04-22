import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, Wallet, Users, PieChart, Bell, CheckCircle2 } from "lucide-react";
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-indigo-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 md:mb-28">
          <h1 className="text-5xl md:text-[3.5rem] font-semibold text-slate-800 leading-[1.15] tracking-tight mb-6 mt-10">
            Track expenses, split bills, stay on budget
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
            The simplest way for students and young professionals to manage personal finances and group expenses in Bangladesh
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition-all active:scale-95 text-base"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          <FeatureCard 
            icon={<Wallet className="text-indigo-600 w-6 h-6" />}
            title="Personal Tracking"
            desc="Monitor your daily expenses and spending patterns effortlessly"
            bgClass="bg-indigo-50"
          />
          <FeatureCard 
            icon={<Users className="text-blue-600 w-6 h-6" />}
            title="Group Splitting"
            desc="Share expenses with friends and settle balances easily"
            bgClass="bg-blue-50"
          />
          <FeatureCard 
            icon={<PieChart className="text-emerald-600 w-6 h-6" />}
            title="Smart Budgets"
            desc="Set monthly budgets and track progress in real-time"
            bgClass="bg-emerald-50"
          />
          <FeatureCard 
            icon={<Bell className="text-orange-500 w-6 h-6" />}
            title="Reminders"
            desc="Never miss a payment or bill with smart reminders"
            bgClass="bg-orange-50"
          />
        </div>

        {/* Extended Features / Banner */}
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center w-full max-w-4xl mx-auto mb-20 border border-gray-100">
          <h2 className="text-3xl font-semibold text-slate-800 mb-10">Perfect for Bangladesh</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-left mb-12">
            <Checklist item="BDT Currency" desc="Fully optimized for Bangladeshi Taka" />
            <Checklist item="Group Codes" desc="Share a simple code to add members" />
            <Checklist item="Mobile-First" desc="Works perfectly on any device" />
            <Checklist item="Clear Context" desc="Never mix personal and group data" />
            <Checklist item="Fast Input" desc="Add expenses in under 5 seconds" />
            <Checklist item="Simple UX" desc="Intuitive design anyone can use" />
          </div>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-indigo-700 transition-all active:scale-95"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </main>

      <footer className="w-full text-center py-8 text-sm text-gray-400 border-t border-gray-100">
        &copy; {new Date().getFullYear()} SpendWise. Made for Bangladesh.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, bgClass }: { icon: React.ReactNode, title: string, desc: string, bgClass: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col items-start hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${bgClass}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Checklist({ item, desc }: { item: string, desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
      <div>
        <h4 className="font-semibold text-gray-900 mb-0.5">{item}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}
