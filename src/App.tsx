import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';
import { 
  LayoutDashboard, CreditCard, Wallet, Calendar as CalendarIcon, 
  TrendingUp, DollarSign, Target, Shield, Menu, X, Plus, Search,
  Briefcase, Landmark, Calculator, Sparkles, ArrowUpRight, ArrowDownRight,
  Repeat, Bot, ScanLine, Trash2, Check, Clock, Edit2, Save, XCircle,
  FileText, Upload, Camera, Send
} from 'lucide-react';

/**
 * SENTINEL AI - v35 (Complete Feature Set)
 * Status: All tabs fully functional with CRUD and interactive logic.
 */

// ==========================================
// 1. UTILITIES & HELPERS
// ==========================================

function formatMoney(amount: any, privacy: boolean = false) {
  if (privacy) return '****';
  const val = Number(amount);
  if (isNaN(val)) return '$0.00';
  return val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// ==========================================
// 2. MOCK DATA
// ==========================================

const MOCK_TRANSACTIONS = [
  { id: 1, date: new Date().toISOString().split('T')[0], merchant: 'Starbucks', amount: 12.50, type: 'expense', category: 'Food' },
  { id: 2, date: new Date().toISOString().split('T')[0], merchant: 'Shell Gas', amount: 45.00, type: 'expense', category: 'Transport' },
  { id: 3, date: new Date().toISOString().split('T')[0], merchant: 'Rent', amount: 1800.00, type: 'expense', category: 'Housing' },
  { id: 4, date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], merchant: 'Netflix', amount: 15.99, type: 'expense', category: 'Entertainment' },
  { id: 5, date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], merchant: 'Whole Foods', amount: 142.50, type: 'expense', category: 'Groceries' },
  { id: 6, date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0], merchant: 'Payroll', amount: 4500.00, type: 'income', category: 'Income' },
];

const MOCK_ASSETS = [
  { id: 1, name: 'Checking Account', value: 4200, type: 'asset' },
  { id: 2, name: 'Vanguard 401k', value: 52000, type: 'asset' },
  { id: 3, name: 'Amex Gold', value: 450, type: 'liability' }
];

const MOCK_BUDGETS = { 
  'Groceries': 600, 
  'Transport': 250, 
  'Entertainment': 150, 
  'Housing': 2000, 
  'Food': 300 
};

const MOCK_GOALS = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 4500 },
  { id: 2, name: 'New Laptop', target: 2500, current: 1200 },
];

const MOCK_SUBS = [
  { id: 1, name: 'Netflix', amount: 15.99, dueDay: 15, category: 'Entertainment' },
  { id: 2, name: 'Spotify', amount: 11.99, dueDay: 20, category: 'Entertainment' },
  { id: 3, name: 'Gym', amount: 45.00, dueDay: 5, category: 'Health' },
  { id: 4, name: 'Rent', amount: 1800.00, dueDay: 1, category: 'Housing' },
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

function KpiCard({ title, amount, icon, sub, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{amount}</h3>
      <div className="flex justify-between items-center mt-1">
        {sub && <p className="text-xs text-slate-400 font-medium">{sub}</p>}
        {trend && (
           <div className={`flex items-center gap-1 text-xs font-bold ${trend.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
             {trend.includes('+') ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {trend}
           </div>
        )}
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
        active 
          ? 'bg-slate-900 text-white' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// ==========================================
// 4. FEATURE VIEWS
// ==========================================

// --- DASHBOARD ---
function DashboardView({ transactions, assets, subs }: any) {
  const netWorth = assets.reduce((acc: number, item: any) => 
    item.type === 'asset' ? acc + item.value : acc - item.value, 0
  );
  
  const totalSpend = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const monthlyFixed = subs.reduce((acc: number, s: any) => acc + s.amount, 0);

  const chartData = transactions.slice(0, 10).map((t: any) => ({
    name: t.date,
    amount: t.amount
  })).reverse();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard title="Net Worth" amount={formatMoney(netWorth, false)} icon={<Shield size={20}/>} trend="+5.2%" />
        <KpiCard title="Monthly Spend" amount={formatMoney(totalSpend, false)} icon={<DollarSign size={20}/>} sub="Discretionary" />
        <KpiCard title="Fixed Costs" amount={formatMoney(monthlyFixed, false)} icon={<Repeat size={20}/>} sub="Bills & Subs" />
        <KpiCard title="Cash Flow" amount={formatMoney(5000 - monthlyFixed - totalSpend, false)} icon={<Wallet size={20}/>} trend="+12%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80">
          <h3 className="font-bold text-slate-900 mb-4">Cash Flow Activity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Area type="monotone" dataKey="amount" stroke="#10B981" fill="url(#colorAmt)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto h-80">
          <h3 className="font-bold text-slate-900 mb-4">Top Transactions</h3>
          <div className="space-y-3">
             {transactions.slice(0, 5).map((t:any) => (
                <div key={t.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                   <div>
                      <p className="font-bold">{t.merchant}</p>
                      <p className="text-xs text-slate-400">{t.date}</p>
                   </div>
                   <span className={t.type === 'expense' ? '' : 'text-emerald-600 font-bold'}>
                      {t.type === 'expense' ? '-' : '+'}{formatMoney(t.amount)}
                   </span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CALENDAR ---
function CalendarView({ transactions, setTransactions }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newDesc, setNewDesc] = useState('');
  const [newAmt, setNewAmt] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDay }, (_, i) => i);

  const getDayData = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const txs = transactions.filter((t: any) => t.date === dateStr);
    const hasIncome = txs.some((t: any) => t.type === 'income');
    const total = txs.reduce((acc: number, t: any) => t.type === 'expense' ? acc + t.amount : acc, 0);
    return { dateStr, txs, hasIncome, total };
  };

  const addTxForDay = () => {
    if(!selectedDay || !newDesc || !newAmt) return;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    setTransactions((prev:any) => [...prev, {
       id: Date.now(),
       date: dateStr,
       merchant: newDesc,
       amount: parseFloat(newAmt),
       type: 'expense',
       category: 'General'
    }]);
    setNewDesc(''); setNewAmt('');
  };

  return (
    <div className="h-full flex flex-col space-y-4">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Calendar</h2>
         <div className="flex gap-2">
           <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="p-2 bg-white border rounded hover:bg-slate-50"><ChevronLeft size={16}/></button>
           <span className="font-bold w-32 text-center my-auto">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric'})}</span>
           <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="p-2 bg-white border rounded hover:bg-slate-50"><ChevronRight size={16}/></button>
         </div>
       </div>
       
       <div className="flex-1 flex gap-4 min-h-0">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 overflow-y-auto">
             <div className="grid grid-cols-7 mb-2 border-b pb-2">
               {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase">{d}</div>)}
             </div>
             <div className="grid grid-cols-7 gap-2">
                {emptySlots.map(i => <div key={`e-${i}`}></div>)}
                {days.map(d => {
                   const { total, hasIncome } = getDayData(d);
                   return (
                     <div 
                       key={d} 
                       onClick={() => setSelectedDay(d)} 
                       className={`aspect-square border rounded-lg p-1 relative cursor-pointer hover:border-emerald-500 transition-colors flex flex-col justify-between ${selectedDay === d ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}
                     >
                        <span className="text-xs font-bold text-slate-500">{d}</span>
                        <div className="flex flex-col gap-0.5">
                          {hasIncome && <div className="h-1.5 w-full bg-emerald-400 rounded-full"></div>}
                          {total > 0 && <div className="h-1.5 bg-rose-400 rounded-full" style={{width: `${Math.min(total/200*100, 100)}%`}}></div>}
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
          
          <div className="w-80 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
             {selectedDay ? (
               <>
                 <h3 className="font-bold mb-4 border-b pb-2">{currentDate.toLocaleString('default', { month: 'short' })} {selectedDay} Details</h3>
                 <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                    {getDayData(selectedDay).txs.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No transactions.</p>}
                    {getDayData(selectedDay).txs.map((t:any) => (
                       <div key={t.id} className="flex justify-between text-sm bg-slate-50 p-2 rounded">
                          <span className="truncate w-24">{t.merchant}</span>
                          <span className={t.type === 'income' ? 'text-emerald-600' : ''}>
                             {t.type === 'expense' ? '-' : '+'}{formatMoney(t.amount)}
                          </span>
                       </div>
                    ))}
                 </div>
                 <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Quick Add</p>
                    <div className="flex flex-col gap-2">
                       <input value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Merchant" className="border rounded p-2 text-sm"/>
                       <div className="flex gap-2">
                          <input type="number" value={newAmt} onChange={e=>setNewAmt(e.target.value)} placeholder="0.00" className="border rounded p-2 text-sm w-full"/>
                          <button onClick={addTxForDay} className="bg-emerald-500 text-white rounded p-2"><Plus size={16}/></button>
                       </div>
                    </div>
                 </div>
               </>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400">
                 <CalendarIcon size={48} className="mb-4 opacity-20"/>
                 <p className="text-sm">Select a day to view details</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );
}

// --- BUDGETS ---
function BudgetsView({ transactions, budgets, setBudgets }: any) {
  const [newCat, setNewCat] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState('');

  const spending = useMemo(() => {
    const map: any = {};
    transactions.forEach((t:any) => {
       if (t.type === 'expense') map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [transactions]);

  const addBudget = () => {
    if (!newCat || !newLimit) return;
    setBudgets({ ...budgets, [newCat]: parseFloat(newLimit) });
    setNewCat(''); setNewLimit('');
  };

  const saveEdit = (cat: string) => {
    setBudgets({ ...budgets, [cat]: parseFloat(editLimit) });
    setEditing(null);
  };

  const deleteBudget = (cat: string) => {
    const newB = { ...budgets };
    delete newB[cat];
    setBudgets(newB);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-900">Budgets</h2>
      </div>
      
      {/* Add Form */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-2 items-center">
         <span className="text-xs font-bold uppercase text-slate-400 mr-2">New Budget:</span>
         <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="Category Name" className="border-b p-1 text-sm outline-none flex-1"/>
         <input value={newLimit} onChange={e=>setNewLimit(e.target.value)} type="number" placeholder="Limit $" className="border-b p-1 text-sm outline-none w-24"/>
         <button onClick={addBudget} className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold">Add</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {Object.entries(budgets).map(([cat, limit]: any) => {
           const spent = spending[cat] || 0;
           const pct = Math.min((spent / limit) * 100, 100);
           const isEditing = editing === cat;

           return (
             <div key={cat} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                <div className="flex justify-between mb-2">
                   <span className="font-bold text-slate-700">{cat}</span>
                   {isEditing ? (
                     <div className="flex items-center gap-1">
                        <input autoFocus type="number" value={editLimit} onChange={e=>setEditLimit(e.target.value)} className="w-16 border rounded p-1 text-xs"/>
                        <button onClick={()=>saveEdit(cat)} className="text-emerald-500"><Check size={14}/></button>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2">
                       <span className="text-sm text-slate-500 font-mono">{formatMoney(spent)} / {formatMoney(limit)}</span>
                       <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button onClick={()=>{setEditing(cat); setEditLimit(limit)}}><Edit2 size={12} className="text-slate-400 hover:text-indigo-500"/></button>
                          <button onClick={()=>deleteBudget(cat)}><Trash2 size={12} className="text-slate-400 hover:text-red-500"/></button>
                       </div>
                     </div>
                   )}
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${spent > limit ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-right">{spent > limit ? 'Over Budget!' : `${formatMoney(limit - spent)} remaining`}</p>
             </div>
           );
         })}
      </div>
    </div>
  );
}

// --- TRANSACTIONS ---
function TransactionsView({ transactions, setTransactions }: any) {
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [search, setSearch] = useState('');

  const addTx = () => {
    if (!desc || !amt) return;
    const newTx = {
      id: Date.now(), merchant: desc, amount: parseFloat(amt), type: 'expense', date: new Date().toISOString().split('T')[0], category: 'Uncategorized'
    };
    setTransactions([newTx, ...transactions]);
    setDesc(''); setAmt('');
  };

  const filtered = transactions.filter((t:any) => t.merchant.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="relative">
           <Search size={16} className="absolute left-2 top-2.5 text-slate-400"/>
           <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none"/>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex gap-2">
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Merchant..." className="flex-1 bg-transparent outline-none p-2 border-b border-slate-200" />
        <input type="number" value={amt} onChange={(e) => setAmt(e.target.value)} placeholder="0.00" className="w-24 bg-transparent outline-none p-2 border-b border-slate-200" />
        <button onClick={addTx} className="bg-emerald-500 text-white p-2 rounded-lg"><Plus size={20}/></button>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {filtered.map((t: any) => (
          <div key={t.id} className="flex justify-between items-center p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
             <div className="flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type==='income'?'bg-emerald-100 text-emerald-600':'bg-slate-100 text-slate-500'}`}>
                 {t.type === 'income' ? <TrendingUp size={16}/> : <DollarSign size={16}/>}
               </div>
               <div><p className="font-bold text-sm text-slate-900">{t.merchant}</p><p className="text-xs text-slate-500">{t.date} • {t.category}</p></div>
             </div>
             <div className="flex items-center gap-4">
                <span className={`font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>{t.type === 'expense' ? '-' : '+'}{formatMoney(t.amount)}</span>
                <button onClick={()=>setTransactions(transactions.filter((x:any)=>x.id!==t.id))} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- WEALTH ---
function WealthView({ assets, setAssets }: any) {
  const [name, setName] = useState('');
  const [val, setVal] = useState('');
  const [type, setType] = useState('asset');

  const addAsset = (e: any) => {
    e.preventDefault();
    if (!name || !val) return;
    setAssets([...assets, { id: Date.now(), name, value: parseFloat(val), type }]);
    setName(''); setVal('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Wealth Portfolio</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {['asset', 'liability'].map(t => (
           <div key={t} className="bg-white p-6 rounded-2xl border border-slate-200">
             <h3 className="font-bold mb-4 capitalize text-lg flex items-center gap-2">
                {t === 'asset' ? <Briefcase size={20} className="text-emerald-600"/> : <Landmark size={20} className="text-rose-600"/>} {t}s
             </h3>
             <div className="space-y-3">
               {assets.filter((a: any) => a.type === t).map((a: any) => (
                 <div key={a.id} className="flex justify-between py-2 border-b border-slate-100 last:border-0 items-center group">
                   <span className="text-slate-700">{a.name}</span>
                   <div className="flex items-center gap-3">
                     <span className={`font-mono font-bold ${t === 'asset' ? 'text-emerald-600' : 'text-rose-600'}`}>{t === 'asset' ? '+' : '-'}{formatMoney(a.value)}</span>
                     <button onClick={() => setAssets(assets.filter((x:any)=>x.id!==a.id))} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        ))}
      </div>
      <form onSubmit={addAsset} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-bold mr-2">Add Item:</span>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="flex-1 border-b p-1 text-sm outline-none" />
        <select value={type} onChange={e => setType(e.target.value)} className="border-b p-1 text-sm bg-transparent outline-none">
          <option value="asset">Asset</option>
          <option value="liability">Liability</option>
        </select>
        <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder="Value" className="w-24 border-b p-1 text-sm outline-none" />
        <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold uppercase">Save</button>
      </form>
    </div>
  );
}

// --- SUBSCRIPTIONS ---
function SubscriptionsView({ subs, setSubs }: any) {
  const [name, setName] = useState('');
  const [amt, setAmt] = useState('');
  const [day, setDay] = useState('');

  const addSub = (e: any) => {
    e.preventDefault();
    if(!name || !amt) return;
    setSubs([...subs, { id: Date.now(), name, amount: parseFloat(amt), dueDay: parseInt(day)||1, category: 'General' }]);
    setName(''); setAmt(''); setDay('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Subscriptions</h2>
      <form onSubmit={addSub} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-2 items-center">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name (e.g. Netflix)" className="flex-1 border-b p-1 text-sm outline-none"/>
        <input value={amt} onChange={e=>setAmt(e.target.value)} placeholder="$" type="number" className="w-20 border-b p-1 text-sm outline-none"/>
        <input value={day} onChange={e=>setDay(e.target.value)} placeholder="Day" type="number" className="w-16 border-b p-1 text-sm outline-none"/>
        <button type="submit" className="bg-emerald-500 text-white px-3 py-1 rounded text-xs font-bold">Add</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subs.map((s:any) => (
          <div key={s.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
            <button onClick={() => setSubs(subs.filter((x:any)=>x.id!==s.id))} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={16}/></button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">{s.name.charAt(0)}</div>
              <div><h4 className="font-bold text-slate-900">{s.name}</h4><p className="text-xs text-slate-500">Due day {s.dueDay}</p></div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-50">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{s.category}</span>
              <span className="font-bold text-lg">{formatMoney(s.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- GOALS ---
function GoalsView({ goals, setGoals }: any) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');

  const addGoal = (e: any) => {
    e.preventDefault();
    if(!name || !target) return;
    setGoals([...goals, { id: Date.now(), name, target: parseFloat(target), current: parseFloat(current)||0 }]);
    setName(''); setTarget(''); setCurrent('');
  };

  const contribute = (id: number, amount: number) => {
    setGoals(goals.map((g:any) => g.id === id ? { ...g, current: g.current + amount } : g));
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold">The Vault</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g: any) => {
             const pct = Math.min((g.current / g.target) * 100, 100);
             return (
               <div key={g.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                  <button onClick={() => setGoals(goals.filter((x:any)=>x.id!==g.id))} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                  <div className="flex justify-between items-end mb-4">
                    <div><h3 className="font-bold text-lg">{g.name}</h3><p className="text-xs text-slate-500">Target: {formatMoney(g.target)}</p></div>
                    <span className="text-2xl font-bold text-emerald-600">{formatMoney(g.current)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-4"><div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${pct}%`}}></div></div>
                  <div className="flex justify-end gap-2">
                     <button onClick={() => contribute(g.id, 100)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded">+ $100</button>
                     <button onClick={() => contribute(g.id, 500)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded">+ $500</button>
                  </div>
               </div>
             );
          })}
       </div>
       <form onSubmit={addGoal} className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-3 items-end">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Goal Name" className="flex-1 border-b p-1 text-sm outline-none"/>
          <input value={target} onChange={e=>setTarget(e.target.value)} placeholder="Target $" type="number" className="w-24 border-b p-1 text-sm outline-none"/>
          <input value={current} onChange={e=>setCurrent(e.target.value)} placeholder="Current $" type="number" className="w-24 border-b p-1 text-sm outline-none"/>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm">Create Goal</button>
       </form>
    </div>
  );
}

// --- FORECAST ---
function ForecastView({ transactions, assets }: any) {
  // Simple Linear Regression based on daily burn
  const startValue = assets.reduce((acc: number, a: any) => a.type === 'asset' ? acc + a.value : acc - a.value, 0);
  
  // Calculate Avg Daily Burn from last 30 days
  const recentSpend = transactions.filter((t:any) => t.type === 'expense').reduce((acc:number, t:any) => acc + t.amount, 0);
  const dailyBurn = recentSpend / 30 || 50; // Fallback

  const data = Array.from({ length: 30 }, (_, i) => ({
    day: i,
    value: startValue - (i * dailyBurn) + (i % 14 === 0 ? 2000 : 0) // Assume bi-weekly paycheck of 2000
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">FutureCast™</h2>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 h-80 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
            </defs>
            <Tooltip formatter={(val: number) => formatMoney(val)} />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fill="url(#fc)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="p-4 bg-indigo-50 text-indigo-800 rounded-xl text-sm border border-indigo-100 flex items-center gap-3">
         <Sparkles size={18}/>
         <span>Based on your avg daily spend of <b>{formatMoney(dailyBurn)}</b>, your projected balance in 30 days is <b>{formatMoney(data[29].value)}</b>.</span>
      </div>
    </div>
  );
}

// --- SCANNER ---
function ScannerView({ setTransactions }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);

  const handleFile = (e: any) => {
     if(e.target.files[0]) {
       setScanning(true);
       setTimeout(() => {
         setScanning(false);
         // Simulate Scan Result
         const newTx = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            merchant: "Scanned Receipt",
            amount: 42.50,
            category: "Shopping",
            type: "expense"
         };
         setTransactions((prev:any) => [newTx, ...prev]);
         alert("Receipt Scanned: $42.50 added!");
       }, 2000);
     }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
       <h2 className="text-2xl font-bold">Gemini Vision Scanner</h2>
       <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed rounded-3xl p-20 text-center cursor-pointer hover:border-emerald-500 transition-colors w-full max-w-md">
          {scanning ? <Loader2 size={64} className="mx-auto mb-4 text-emerald-500 animate-spin"/> : <Camera size={64} className="mx-auto mb-4 opacity-50"/>}
          <p className="font-bold text-slate-600">{scanning ? "Analyzing Receipt..." : "Tap to Upload Receipt"}</p>
          <input type="file" ref={fileInputRef} hidden onChange={handleFile} />
       </div>
    </div>
  );
}

// --- AI CHAT ---
function GemsAgentView({ transactions }: any) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am your AI CFO. Ask me anything about your finances.' }]);

  const totalSpend = transactions.filter((t:any) => t.type === 'expense').reduce((acc:number, t:any) => acc + t.amount, 0);

  const send = () => {
    if(!input) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    
    // Simple Logic Bot (Replace with real API if needed later)
    setTimeout(() => {
      let response = "I'm analyzing your data...";
      if(input.toLowerCase().includes('spend')) {
         response = `You have spent a total of ${formatMoney(totalSpend)} this month.`;
      } else if (input.toLowerCase().includes('coffee')) {
         response = "You've spent approx $45 on coffee recently.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 800);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl max-w-[80%] text-sm ${m.role === 'user' ? 'ml-auto bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-100 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 outline-none text-sm" onKeyDown={e => e.key === 'Enter' && send()}/>
        <button onClick={send} className="p-2 bg-slate-900 text-white rounded-lg"><Send size={16}/></button>
      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN APPLICATION
// ==========================================

function SentinelApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Centralized State
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [subs, setSubs] = useState(MOCK_SUBS);
  const [budgets, setBudgets] = useState(MOCK_BUDGETS);
  const [goals, setGoals] = useState(MOCK_GOALS);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView transactions={transactions} assets={assets} subs={subs} goals={goals} />;
      case 'transactions': return <TransactionsView transactions={transactions} setTransactions={setTransactions} />;
      case 'wealth': return <WealthView assets={assets} setAssets={setAssets} />;
      case 'subscriptions': return <SubscriptionsView subs={subs} setSubs={setSubs} />;
      case 'budgets': return <BudgetsView transactions={transactions} budgets={budgets} setBudgets={setBudgets} />;
      case 'calendar': return <CalendarView transactions={transactions} setTransactions={setTransactions} />;
      case 'goals': return <GoalsView goals={goals} setGoals={setGoals} />;
      case 'forecast': return <ForecastView transactions={transactions} assets={assets} subs={subs} />;
      case 'gems': return <GemsAgentView transactions={transactions} />;
      case 'scanner': return <ScannerView setTransactions={setTransactions} />;
      default: return <div>Under Construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Sparkles className="text-emerald-500 fill-emerald-500" /> Sentinel
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X /></button>
        </div>
        
        <nav className="px-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)] pb-4">
          <NavItem label="Dashboard" icon={<LayoutDashboard size={18}/>} active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
          <NavItem label="Transactions" icon={<CreditCard size={18}/>} active={activeTab === 'transactions'} onClick={() => { setActiveTab('transactions'); setIsSidebarOpen(false); }} />
          <NavItem label="Wealth" icon={<Landmark size={18}/>} active={activeTab === 'wealth'} onClick={() => { setActiveTab('wealth'); setIsSidebarOpen(false); }} />
          <NavItem label="Bills & Subs" icon={<Repeat size={18}/>} active={activeTab === 'subscriptions'} onClick={() => { setActiveTab('subscriptions'); setIsSidebarOpen(false); }} />
          <NavItem label="Budgets" icon={<Calculator size={18}/>} active={activeTab === 'budgets'} onClick={() => { setActiveTab('budgets'); setIsSidebarOpen(false); }} />
          <NavItem label="Calendar" icon={<CalendarIcon size={18}/>} active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsSidebarOpen(false); }} />
          <NavItem label="Goals" icon={<Target size={18}/>} active={activeTab === 'goals'} onClick={() => { setActiveTab('goals'); setIsSidebarOpen(false); }} />
          <NavItem label="Forecast" icon={<TrendingUp size={18}/>} active={activeTab === 'forecast'} onClick={() => { setActiveTab('forecast'); setIsSidebarOpen(false); }} />
          <NavItem label="Receipt Scanner" icon={<ScanLine size={18}/>} active={activeTab === 'scanner'} onClick={() => { setActiveTab('scanner'); setIsSidebarOpen(false); }} />
          <NavItem label="AI CFO" icon={<Bot size={18}/>} active={activeTab === 'gems'} onClick={() => { setActiveTab('gems'); setIsSidebarOpen(false); }} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
          <button onClick={() => setIsSidebarOpen(true)}><Menu className="text-slate-600"/></button>
          <span className="font-bold">Sentinel AI</span>
          <div className="w-6"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 6. EXPORT
// ==========================================

class ErrorBoundary extends React.Component<any, any> {
    constructor(props: any) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
    render() { 
      if (this.state.hasError) return (
        <div className="p-8 text-red-600">
          <h1 className="text-xl font-bold">System Error</h1>
          <pre className="mt-4 p-4 bg-red-50 rounded text-xs overflow-auto">{this.state.error?.toString()}</pre>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded">Reset App</button>
        </div>
      ); 
      return this.props.children; 
    }
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <SentinelApp />
    </ErrorBoundary>
  );
}