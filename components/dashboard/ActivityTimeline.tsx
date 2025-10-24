import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Activity } from '@/lib/mock-data/types';
import { getActivityColor } from '@/lib/mock-data/activities';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityTimelineProps {
  activities: Activity[];
  limit?: number;
}

export function ActivityTimeline({ activities, limit = 10 }: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Latest updates on your debts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayActivities.map((activity, index) => {
              const isLast = index === displayActivities.length - 1;
              const colorClass = getActivityColor(activity.event_type);

              return (
                <div key={activity.id} className="relative">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-5 top-10 w-px h-full bg-border" />
                  )}

                  {/* Activity Item */}
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 relative z-10',
                      colorClass
                    )}>
                      <span className="text-lg">
                        {getActivityIcon(activity.event_type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-relaxed">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {displayActivities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No activity yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getActivityIcon(eventType: string): string {
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



