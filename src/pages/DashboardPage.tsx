import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wallet, ArrowDownRight, ArrowUpRight, Plus, Edit2, Trash2,
  Coffee, ShoppingBag, Bus, Zap, Bell, LayoutDashboard, Users, Settings, LogOut, X, Tag
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Helper for category colors and icons
function getCategoryDesign(category: string) {
  const c = category.toLowerCase();
  if (c.includes("food") || c.includes("drink") || c.includes("coffee") || c.includes("restaurant")) 
    return { icon: Coffee, color: "text-orange-500", bg: "bg-orange-50", hex: "#f97316" };
  if (c.includes("transport") || c.includes("ride") || c.includes("uber") || c.includes("car")) 
    return { icon: Bus, color: "text-blue-500", bg: "bg-blue-50", hex: "#3b82f6" };
  if (c.includes("shop") || c.includes("grocer") || c.includes("market")) 
    return { icon: ShoppingBag, color: "text-purple-500", bg: "bg-purple-50", hex: "#a855f7" };
  if (c.includes("bill") || c.includes("utilit") || c.includes("internet") || c.includes("electric")) 
    return { icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50", hex: "#eab308" };
  return { icon: Tag, color: "text-indigo-500", bg: "bg-indigo-50", hex: "#6366f1" };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

  // Modal Visibility
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [userName, setUserName] = useState("New User");
  const [userEmail, setUserEmail] = useState("newuser@example.com");
  
  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Expense Form State
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("");
  const [txType, setTxType] = useState("expense");

  // Budget Form State
  const [budgetInput, setBudgetInput] = useState("");

  React.useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleLogout = () => {
    // Clear user data (optional, based on requirement, but usually good practice)
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const openExpenseModal = (tx?: any) => {
    if (tx) {
      setEditingId(tx.id);
      setTxTitle(tx.title);
      setTxAmount(tx.amount.toString());
      setTxCategory(tx.category);
      setTxType(tx.type);
    } else {
      setEditingId(null);
      setTxTitle("");
      setTxAmount("");
      setTxCategory("");
      setTxType("expense");
    }
    setIsExpenseModalOpen(true);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle || !txAmount || !txCategory) return;
    
    if (editingId) {
      setTransactions(transactions.map(t => t.id === editingId ? {
        ...t,
        title: txTitle,
        category: txCategory,
        amount: parseFloat(txAmount),
        type: txType,
      } : t));
    } else {
      const newTx = {
        id: Date.now(),
        title: txTitle,
        category: txCategory,
        amount: parseFloat(txAmount),
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        type: txType,
      };
      setTransactions([newTx, ...transactions]);
    }
    
    setIsExpenseModalOpen(false);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetInput) return;
    setMonthlyBudget(parseFloat(budgetInput));
    setIsBudgetModalOpen(false);
    setBudgetInput("");
  };

  // Calculations
  const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = monthlyBudget - totalSpent;

  // Chart Data format
  const chartData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(t => {
      const cat = t.category;
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });

    return Object.keys(categoryTotals).map(key => ({
      name: key,
      value: categoryTotals[key],
      color: getCategoryDesign(key).hex
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col relative z-20">
        <div className="h-20 px-6 flex items-center border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-indigo-700 font-semibold text-xl">
            <Wallet className="w-6 h-6" />
            <span className="text-gray-900 tracking-tight">SpendWise</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1">
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
            <SidebarItem icon={<Wallet />} label="Transactions" />
            <SidebarItem icon={<Users />} label="Groups" onClickPath="/groups" />
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <nav className="space-y-1">
            <SidebarItem icon={<Settings />} label="Settings" />
            <SidebarItem icon={<LogOut />} label="Logout" onClickPath="/" onClick={handleLogout} />
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {userName.substring(0, 2).toUpperCase()}
              </button>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">Personal Account</p>
              </div>
              
              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-12 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 py-3 divide-y divide-gray-100 z-20">
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsSettingsModalOpen(true); setIsProfileMenuOpen(false); }} 
                      className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setIsProfileMenuOpen(false); }} 
                      className="block w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Your Dashboard</p>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Summary</h2>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setBudgetInput(monthlyBudget ? monthlyBudget.toString() : "");
                  setIsBudgetModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
              >
                <Edit2 className="w-4 h-4 text-gray-500" />
                Set Budget
              </button>
              <button 
                onClick={() => openExpenseModal()}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Monthly Budget" 
              amount={`৳ ${monthlyBudget.toLocaleString()}`}
              trendUp={true}
              icon={<Zap className="text-indigo-600 w-5 h-5" />} 
              bgClass="bg-indigo-50"
            />
            <MetricCard 
              title="Total Spent" 
              amount={`৳ ${totalSpent.toLocaleString()}`}
              trendUp={false}
              icon={<ArrowUpRight className="text-red-600 w-5 h-5" />} 
              bgClass="bg-red-50"
            />
            <MetricCard 
              title="Remaining Budget" 
              amount={`৳ ${remainingBudget.toLocaleString()}`}
              trendUp={remainingBudget >= 0}
              icon={<Wallet className="text-emerald-600 w-5 h-5" />} 
              bgClass="bg-emerald-50"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Expense History */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Expense History</h3>
              </div>
              
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium mb-1">No transactions yet</h4>
                  <p className="text-gray-500 text-sm">Add your first expense to see your history.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {transactions.map((tx) => {
                    const design = getCategoryDesign(tx.category);
                    const TxIcon = tx.type === 'income' ? ArrowDownRight : design.icon;
                    const txColor = tx.type === 'income' ? 'text-emerald-500' : design.color;
                    const txBg = tx.type === 'income' ? 'bg-emerald-50' : design.bg;

                    return (
                      <div key={tx.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${txBg} ${txColor}`}>
                            <TxIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{tx.title}</p>
                            <p className="text-sm text-gray-500">{tx.category} • {tx.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.type === 'income' ? '+' : '-'}৳ {tx.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openExpenseModal(tx)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteTransaction(tx.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Expenses Breakdown / Pie Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-900 w-full text-left mb-6">Expense Breakdown</h3>
              
              {chartData.length === 0 ? (
                <div className="text-center py-10 flex-1 w-full border-t border-dashed border-gray-200 mt-4">
                  <p className="text-sm text-gray-500 mt-6">Add expenses to see your pie chart.</p>
                </div>
              ) : (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `৳${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Transaction Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-xl">
            <button 
              onClick={() => setIsExpenseModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${txType === 'expense' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >Expense</button>
                  <button 
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all ${txType === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >Income</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input required type="text" value={txTitle} onChange={e => setTxTitle(e.target.value)} placeholder="e.g. Uber Ride" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (৳)</label>
                <input required type="number" min="0" step="any" value={txAmount} onChange={e => setTxAmount(e.target.value)} placeholder="0.00" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select 
                  required 
                  value={txCategory} 
                  onChange={e => setTxCategory(e.target.value)} 
                  className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white appearance-none"
                >
                  <option value="" disabled>Select a category...</option>
                  <option value="Food & Drink">Food & Drink</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills & Utilities</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 py-2.5 rounded-lg transition-colors mt-4">
                {editingId ? 'Save Changes' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Set Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-xl">
            <button 
              onClick={() => setIsBudgetModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Set Monthly Budget</h3>
            
            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Overall Monthly Limit (৳)</label>
                <input required type="number" min="0" step="any" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="e.g. 15000" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 py-2.5 rounded-lg transition-colors mt-2">
                Save Budget
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-xl">
            <button 
              onClick={() => setIsSettingsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">User Settings</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsSettingsModalOpen(false); /* Handle setting save */ }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Change Name</label>
                <input type="text" placeholder="New Name" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1.5">Change Password</label>
                <input type="password" placeholder="New Password" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 py-2.5 rounded-lg transition-colors mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClickPath, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClickPath?: string, onClick?: () => void }) {
  const content = (
    <>
      <span className={`w-5 h-5 mr-3 ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </>
  );

  const baseClasses = `w-full flex items-center px-3 py-2.5 rounded-xl transition-colors group ${
    active 
      ? 'bg-indigo-50 text-indigo-700' 
      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
  }`;

  if (onClickPath) {
    if (onClick) {
      return (
        <Link to={onClickPath} className={baseClasses} onClick={onClick}>
          {content}
        </Link>
      );
    }
    return (
      <Link to={onClickPath} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
}

function MetricCard({ title, amount, trendUp, icon, bgClass }: { title: string, amount: string, trendUp: boolean, icon: React.ReactNode, bgClass: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}>
          {icon}
        </div>
        <div className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{amount}</h3>
    </div>
  );
}
