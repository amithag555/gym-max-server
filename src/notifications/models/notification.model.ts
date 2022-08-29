import { Notification } from '@prisma/client';

export class NotificationModel implements Notification {
  id: number;
  title: string;
  context: string;
  isRead: boolean;
}
