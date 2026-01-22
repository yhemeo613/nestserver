import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Job } from 'bull';

export interface EmailJob {
  to: string;
  subject: string;
  template: string;
  data: any;
}

export interface NotificationJob {
  userId: string;
  type: string;
  message: string;
  data: any;
}

export interface CleanupJob {
  type: string;
  beforeDate: Date;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
    @InjectQueue('cleanup') private readonly cleanupQueue: Queue,
  ) {}

  async addEmailJob(emailJob: EmailJob): Promise<Job<EmailJob>> {
    this.logger.log(`正在添加邮件任务到队列: ${emailJob.to}`);
    return this.emailQueue.add('send-email', emailJob, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addNotificationJob(notificationJob: NotificationJob): Promise<Job<NotificationJob>> {
    this.logger.log(`正在添加通知任务到队列: ${notificationJob.userId}`);
    return this.notificationQueue.add('send-notification', notificationJob, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addCleanupJob(cleanupJob: CleanupJob): Promise<Job<CleanupJob>> {
    this.logger.log(`正在添加清理任务到队列: ${cleanupJob.type}`);
    return this.cleanupQueue.add('cleanup-data', cleanupJob, {
      attempts: 2,
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async getQueueStats(queueName: string) {
    let queue: Queue;
    switch (queueName) {
      case 'email':
        queue = this.emailQueue;
        break;
      case 'notification':
        queue = this.notificationQueue;
        break;
      case 'cleanup':
        queue = this.cleanupQueue;
        break;
      default:
        throw new Error(`未知队列: ${queueName}`);
    }

    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);

    return {
      queue: queueName,
      waiting,
      active,
      completed,
      failed,
    };
  }
}
