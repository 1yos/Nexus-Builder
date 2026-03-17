'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  CreditCard, 
  Zap, 
  Plus,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Projects', href: '/dashboard' },
  { icon: FolderOpen, label: 'Templates', href: '/templates' },
  { icon: CreditCard, label: 'Billing', href: '/pricing' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <span className="font-bold text-xl tracking-tight">Nexus</span>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
              pathname === item.href 
                ? "bg-blue-50 text-blue-600" 
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-100">
        <div className="bg-zinc-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-900 truncate">John Doe</p>
              <p className="text-xs text-zinc-500 truncate">Free Plan</p>
            </div>
          </div>
          <Link 
            href="/pricing" 
            className="block w-full py-2 bg-white border border-zinc-200 rounded-lg text-center text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
        
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all">
          <LogOut className="w-5 h-5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
