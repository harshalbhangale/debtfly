import type { Activity, Debt } from './types';

export function generateActivityTimeline(debts: Debt[], count: number = 10): Activity[] {
  const activityTypes = [
    { type: 'document_sent', action: 'sent', description: 'LOA request sent to creditor' },
    { type: 'document_sent', action: 'sent', description: 'CCA request sent to creditor' },
    { type: 'document_received', action: 'received', description: 'Response received from creditor' },
    { type: 'stage_changed', action: 'updated', description: 'Debt stage updated' },
    { type: 'payment_made', action: 'completed', description: 'Monthly payment processed' },
    { type: 'client_upload', action: 'uploaded', description: 'ID document uploaded' },
    { type: 'client_upload', action: 'uploaded', description: 'Supporting document uploaded' },
    { type: 'debt_added', action: 'created', description: 'New debt added to case' },
    { type: 'review_started', action: 'started', description: 'Document review initiated' },
    { type: 'chaser_sent', action: 'sent', description: 'Follow-up request sent' },
  ];

  const activities: Activity[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const randomDebt = debts[Math.floor(Math.random() * debts.length)];
    const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    // Create activities spread over last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const timestamp = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    activities.push({
      id: `activity-${i}-${Math.random().toString(36).substr(2, 9)}`,
      debt_id: randomDebt?.id || null,
      client_id: randomDebt?.client_id,
      event_type: randomActivity.type,
      description: randomDebt 
        ? `${randomActivity.description} - ${randomDebt.creditor_name}`
        : randomActivity.description,
      entity_id: randomDebt?.id,
      actor_type: randomActivity.type.includes('client') ? 'client' : 'system',
      action: randomActivity.action,
      ip_address: '127.0.0.1',
      metadata: { creditor: randomDebt?.creditor_name },
      timestamp,
    });
  }

  // Sort by timestamp descending (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function getActivityIcon(eventType: string): string {
  const iconMap: Record<string, string> = {
    document_sent: '📤',
    document_received: '📥',
    stage_changed: '🔄',
    payment_made: '💳',
    client_upload: '📎',
    debt_added: '➕',
    review_started: '🔍',
    chaser_sent: '📧',
  };

  return iconMap[eventType] || '📌';
}

export function getActivityColor(eventType: string): string {
  const colorMap: Record<string, string> = {
    document_sent: 'text-blue-600 bg-blue-100',
    document_received: 'text-green-600 bg-green-100',
    stage_changed: 'text-purple-600 bg-purple-100',
    payment_made: 'text-emerald-600 bg-emerald-100',
    client_upload: 'text-amber-600 bg-amber-100',
    debt_added: 'text-indigo-600 bg-indigo-100',
    review_started: 'text-cyan-600 bg-cyan-100',
    chaser_sent: 'text-orange-600 bg-orange-100',
  };

  return colorMap[eventType] || 'text-gray-600 bg-gray-100';
}



