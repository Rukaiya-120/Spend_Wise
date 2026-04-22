import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Wallet, Plus, Edit2, Trash2, Users, Receipt,
  Coffee, ShoppingBag, Bus, Zap, Bell, LayoutDashboard, Settings, LogOut, X, Tag, Shield, 
  UserPlus, PlusCircle, ArrowLeft, Hash
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

export default function GroupsPage() {
  const navigate = useNavigate();
  // Navigation Flow States: 'selection', 'create', 'join', 'dashboard'
  const [currentView, setCurrentView] = useState<'selection' | 'create' | 'join' | 'dashboard'>('selection');
  
  // User & Group Context State
  const [isCreator, setIsCreator] = useState(false);
  const [groupDetails, setGroupDetails] = useState({ name: "", code: "", budget: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);

  // Forms context
  const [createName, setCreateName] = useState("");
  const [createBudget, setCreateBudget] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [userName, setUserName] = useState("New User");
  const [userEmail, setUserEmail] = useState("user@example.com");

  React.useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedName) setUserName(savedName);
    if (savedEmail) setUserEmail(savedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  const currentUser = {
    id: isCreator ? 'U1' : 'U_ME',
    name: userName
  };

  // Flow Handlers
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName || !createBudget) return;
    
    // Generate random 6-digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    setGroupDetails({
      name: createName,
      code: newCode,
      budget: parseFloat(createBudget)
    });
    setIsCreator(true);
    setTransactions([]); // Fresh start for new group
    setCurrentView('dashboard');
  };

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate 6 digits
    if (!joinCode || joinCode.length !== 6 || !/^\d+$/.test(joinCode)) {
      alert("Please enter a valid 6-digit group code.");
      return;
    }

    // Mock joining an existing group
    setGroupDetails({
      name: "Shared Apartment",
      code: joinCode,
      budget: 45000
    });
    setIsCreator(false);
    
    // Pre-populate with typical group transactions by the "creator"
    setTransactions([
      { id: 1, title: "Apartment Rent", category: "Bills & Utilities", amount: 25000, date: "1 Apr, 10:00 AM", userName: "Admin", userId: "U1", type: "expense" },
      { id: 2, title: "Groceries", category: "Shopping", amount: 4200, date: "8 Apr, 11:20 AM", userName: "Admin", userId: "U1", type: "expense" }
    ]);
    
    setCurrentView('dashboard');
  };

  // Dashboard Modal Visibility
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Dashboard Edit State
  const [editingId, setEditingId] = useState<number | null>(null);

  // Dashboard Expense Form State
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("");

  // Dashboard Budget Form State (Creator Only)
  const [budgetInput, setBudgetInput] = useState("");

  const openExpenseModal = (tx?: any) => {
    if (tx) {
      setEditingId(tx.id);
      setTxTitle(tx.title);
      setTxAmount(tx.amount.toString());
      setTxCategory(tx.category);
    } else {
      setEditingId(null);
      setTxTitle("");
      setTxAmount("");
      setTxCategory("");
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
      } : t));
    } else {
      const newTx = {
        id: Date.now(),
        title: txTitle,
        category: txCategory,
        amount: parseFloat(txAmount),
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        userName: currentUser.name,
        userId: currentUser.id,
        type: "expense"
      };
      setTransactions([newTx, ...transactions]);
    }
    
    setIsExpenseModalOpen(false);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetInput) return;
    setGroupDetails(prev => ({ ...prev, budget: parseFloat(budgetInput) }));
    setIsBudgetModalOpen(false);
    setBudgetInput("");
  };

  // Calculations for Dashboard
  const totalSpent = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const remainingBudget = groupDetails.budget - totalSpent;

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-gray-900">
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
            <SidebarItem icon={<LayoutDashboard />} label="Dashboard" onClickPath="/dashboard" />
            <SidebarItem icon={<Wallet />} label="Transactions" />
            <SidebarItem icon={<Users />} label="Groups" active />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <nav className="space-y-1">
            <SidebarItem icon={<Settings />} label="Settings" onClick={() => setIsSettingsModalOpen(true)} />
            <SidebarItem icon={<LogOut />} label="Logout" onClickPath="/" onClick={handleLogout} />
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        
        {/* Onboarding Flow: Selection, Create, Join */}
        {currentView !== 'dashboard' && (
          <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 w-full max-w-4xl mx-auto min-h-screen md:min-h-0">
            
            {currentView === 'selection' && (
              <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Group Expenses</h1>
                  <p className="text-gray-500 text-lg">Split bills and track shared budgets effortlessly.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setCurrentView('create')}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:border-blue-200 hover:shadow-lg transition-all group text-left flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Create a Group</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Become the creator. Set a monthly budget and share a 6-digit code with your roommates or friends.
                      </p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setCurrentView('join')}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] hover:border-emerald-200 hover:shadow-lg transition-all group text-left flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Join a Group</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        Have a code? Join an existing group to start logging your combined expenses immediately.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {currentView === 'create' && (
              <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in zoom-in-95 duration-300">
                <button onClick={() => setCurrentView('selection')} className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Create New Group</h2>
                <p className="text-gray-500 text-sm mb-8">Set up your shared budget space.</p>
                
                <form onSubmit={handleCreateGroup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Group Name</label>
                    <input required type="text" value={createName} onChange={e=>setCreateName(e.target.value)} placeholder="e.g. 123 Main St. Apartment" className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Limit (৳)</label>
                    <input required type="number" min="0" step="any" value={createBudget} onChange={e=>setCreateBudget(e.target.value)} placeholder="e.g. 40000" className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 py-3.5 rounded-xl transition-colors mt-4">
                    Create Group Code
                  </button>
                </form>
              </div>
            )}

            {currentView === 'join' && (
              <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in zoom-in-95 duration-300">
                <button onClick={() => setCurrentView('selection')} className="flex items-center gap-2 text-sm text-gray-500 font-medium hover:text-gray-900 transition-colors mb-6">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join Existing Group</h2>
                <p className="text-gray-500 text-sm mb-8">Enter the 6-digit code provided by the group creator.</p>
                
                <form onSubmit={handleJoinGroup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">6-Digit Code</label>
                    <div className="relative">
                      <Hash className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input 
                        required 
                        type="text" 
                        maxLength={6}
                        value={joinCode} 
                        onChange={e=>setJoinCode(e.target.value.replace(/\D/g, ''))} 
                        placeholder="000000" 
                        className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-lg font-mono tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 py-3.5 rounded-xl transition-colors mt-4">
                    Join Group
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* The Group Dashboard */}
        {currentView === 'dashboard' && (
          <div className="flex-1 flex flex-col w-full h-full overflow-y-auto animate-in fade-in duration-500">
            {/* Top Dashboard Header */}
            <header className="h-20 bg-white border-b border-gray-100 flex-shrink-0 px-6 flex items-center justify-between sticky top-0 z-10 w-full">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-800">{groupDetails.name}</h1>
                <div className="hidden sm:flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Group Code:</span>
                  <span className="text-sm font-mono font-bold text-indigo-600">{groupDetails.code}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
                  <Bell className="w-5 h-5" />
                </button>
                <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isCreator ? 'bg-blue-100 text-blue-600 focus:ring-blue-500' : 'bg-emerald-100 text-emerald-600 focus:ring-emerald-500'}`}
                  >
                    {userName.substring(0, 2).toUpperCase()}
                  </button>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{currentUser.name}</p>
                    <p className={`text-xs font-medium flex items-center gap-1 ${isCreator ? 'text-blue-600' : 'text-emerald-600'}`}>
                      {isCreator && <Shield className="w-3 h-3"/>}
                      {isCreator ? 'Creator' : 'Member'}
                    </p>
                  </div>
                  
                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 py-3 divide-y divide-gray-100 z-20">
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
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

            <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
              
              {/* Action Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Group Finances</p>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Overview</h2>
                </div>
                <div className="flex items-center gap-3">
                  {/* Only show 'Set Budget' if Admin/Creator */}
                  {isCreator && (
                    <button 
                      onClick={() => {
                        setBudgetInput(groupDetails.budget.toString());
                        setIsBudgetModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm focus:ring-2 focus:ring-gray-200 focus:outline-none"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                      Edit Group Budget
                    </button>
                  )}
                  <button 
                    onClick={() => openExpenseModal()}
                    className={`inline-flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 ${isCreator ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'}`}
                  >
                    <Plus className="w-5 h-5" />
                    Share Expense
                  </button>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  title="Group Monthly Budget" 
                  amount={`৳ ${groupDetails.budget.toLocaleString()}`}
                  icon={<Zap className="text-blue-600 w-5 h-5" />} 
                  bgClass="bg-blue-50"
                />
                <MetricCard 
                  title="Total Group Spent" 
                  amount={`৳ ${totalSpent.toLocaleString()}`}
                  icon={<Receipt className="text-orange-600 w-5 h-5" />} 
                  bgClass="bg-orange-50"
                  txColor="text-gray-900"
                />
                <MetricCard 
                  title="Remaining Budget" 
                  amount={`৳ ${remainingBudget.toLocaleString()}`}
                  icon={<Wallet className="text-emerald-600 w-5 h-5" />} 
                  bgClass="bg-emerald-50"
                  txColor={remainingBudget >= 0 ? "text-emerald-600" : "text-red-600"}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Expense History */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Group Transactions</h3>
                  </div>
                  
                  {transactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Receipt className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-gray-900 font-medium mb-1">No group expenses yet</h4>
                      <p className="text-gray-500 text-sm">Add a shared expense to split it with your group.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {transactions.map((tx) => {
                        const design = getCategoryDesign(tx.category);
                        const txColor = design.color;
                        const txBg = design.bg;
                        
                        // Allow edit/delete if the current user belongs to the one who made the tx
                        const isMyTransaction = tx.userId === currentUser.id;

                        return (
                          <div key={tx.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className={`w-11 h-11 rounded-full flex items-center justify-center ${txBg} ${txColor}`}>
                                <design.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{tx.title}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                  <span className={`font-medium ${isMyTransaction ? (isCreator ? 'text-blue-600' : 'text-emerald-600') : 'text-gray-700'}`}>{tx.userName}</span> • {tx.category} • {tx.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="font-semibold text-gray-900">
                                ৳ {tx.amount.toLocaleString()}
                              </div>
                              
                              <div className={`flex items-center gap-2 transition-opacity ${isMyTransaction ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 pointer-events-none w-[52px]'}`}>
                                {isMyTransaction && (
                                  <>
                                    <button onClick={() => openExpenseModal(tx)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit your expense">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteTransaction(tx.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete your expense">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
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
                  <h3 className="text-lg font-semibold text-gray-900 w-full text-left mb-6">Group Breakdown</h3>
                  
                  {chartData.length === 0 ? (
                    <div className="text-center py-10 flex-1 w-full border-t border-dashed border-gray-200 mt-4">
                      <p className="text-sm text-gray-500 mt-6">Add group expenses to see the pie chart.</p>
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
          </div>
        )}
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
            <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Shared Expense' : 'Share an Expense'}</h3>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Paid By</label>
                <div className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm bg-gray-50 text-gray-600 cursor-not-allowed font-medium">
                  {currentUser.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input required type="text" value={txTitle} onChange={e => setTxTitle(e.target.value)} placeholder="e.g. Internet Bill" className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
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
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <button type="submit" className={`w-full text-white font-medium py-3 rounded-xl transition-colors mt-4 shadow-sm ${isCreator ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                {editingId ? 'Save Changes' : 'Share Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Set Budget Modal (Only accessible by Admin) */}
      {isBudgetModalOpen && isCreator && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-xl">
            <button 
              onClick={() => setIsBudgetModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5"/>
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Group Monthly Budget</h3>
            
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Group Limit (৳)</label>
                <input required type="number" min="0" step="any" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} placeholder="e.g. 40000" className="w-full rounded-xl border border-gray-200 py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <p className="text-xs text-gray-500 mt-2">Only you, the Group Creator, can change this shared limit.</p>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 py-3 rounded-xl transition-colors mt-2 shadow-sm">
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

function MetricCard({ title, amount, icon, bgClass, txColor = "text-gray-900" }: { title: string, amount: string, icon: React.ReactNode, bgClass: string, txColor?: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgb(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgClass}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className={`text-3xl font-bold tracking-tight ${txColor}`}>{amount}</h3>
    </div>
  );
}
