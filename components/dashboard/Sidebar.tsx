'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  Hexagon, 
  LogOut,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Projects', href: '/dashboard' },
  { icon: FolderOpen, label: 'Templates', href: '/templates' },
  { icon: CreditCard, label: 'Billing', href: '/pricing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-surface border-r border-border flex flex-col h-screen sticky top-0 z-40">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20"
          >
            <Hexagon className="w-6 h-6 text-white fill-current" />
          </motion.div>
          <span className="text-2xl font-black tracking-widest text-text-primary uppercase">
            ETHEREAL
          </span>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all relative group",
              pathname === item.href 
                ? "text-white" 
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            )}
          >
            {pathname === item.href && (
              <motion.div 
                layoutId="activeNav"
                className="absolute inset-0 bg-accent-gradient rounded-2xl -z-10 shadow-lg shadow-[var(--accent-primary)]/20"
              />
            )}
            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-text-secondary group-hover:text-text-primary")} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-6 space-y-4 border-t border-border">
        <div className="bg-background/50 backdrop-blur-md rounded-3xl p-6 border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2">
            <Sparkles className="w-4 h-4 text-accent-primary opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-gradient p-[1px]">
              <div className="w-full h-full rounded-full bg-surface flex items-center justify-center text-text-primary font-black text-xs">
                JD
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-text-primary truncate tracking-tight">John Doe</p>
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Free Plan</p>
            </div>
          </div>
          <Link 
            href="/pricing" 
            className="block w-full py-3 bg-accent-gradient text-white rounded-xl text-center text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>
        
        <button className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-sm font-black uppercase tracking-widest text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
