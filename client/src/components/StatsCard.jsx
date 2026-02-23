export default function StatsCard({ title, value, icon: Icon, trend, trendValue, colorClass = "bg-white", textClass = "text-slate-900", iconColor = "text-slate-600" }) {
  return (
    <div className={`rounded-xl p-5 shadow-sm border border-slate-200/60 ${colorClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-semibold mb-1 opacity-80 ${textClass}`}>{title}</p>
          <p className={`text-3xl font-bold tracking-tight ${textClass}`}>{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className={`text-xs font-medium opacity-70 ${textClass}`}>vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-white/50 border border-white/20 flex items-center justify-center shadow-sm ${iconColor}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
