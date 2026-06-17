import { BellOff } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col h-full min-h-[60vh]">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-(--text-primary) tracking-tight mb-3">
          Notifications
        </h1>
        <p className="text-(--text-secondary) font-mono text-sm tracking-wide">
          UPDATES AND ALERTS
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-60">
        <div className="w-16 h-16 rounded-full bg-(--bg-card) border border-(--border) flex items-center justify-center">
          <BellOff className="w-8 h-8 text-(--text-muted)" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-(--text-primary)">All caught up</h3>
          <p className="text-(--text-secondary) text-sm mt-1">You have no new notifications.</p>
        </div>
      </div>
    </div>
  );
}
