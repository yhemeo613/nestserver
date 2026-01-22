import { Processor, Process, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { EmailJob, NotificationJob, CleanupJob } from './queue.service';

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process('send-email')
  async handleSendEmail(job: Job<EmailJob>) {
    this.logger.log(`正在处理邮件任务 #${job.id}`);
    const { to, subject, template, data } = job.data;

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.logger.log(`邮件已发送至 ${to}: ${subject}`);
    return { success: true, messageId: `msg_${Date.now()}` };
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`正在处理邮件任务 #${job.id} 类型: ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.debug(`邮件任务完成 #${job.id}: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`邮件任务失败 #${job.id}: ${error.message}`);
  }
}

@Processor('notification')
export class NotificationProcessor {
  private readonly logger = new Logger(NotificationProcessor.name);

  @Process('send-notification')
  async handleSendNotification(job: Job<NotificationJob>) {
    this.logger.log(`正在处理通知任务 #${job.id}`);
    const { userId, type, message, data } = job.data;

    await new Promise(resolve => setTimeout(resolve, 500));

    this.logger.log(`通知已发送至用户 ${userId}: ${type}`);
    return { success: true, notificationId: `notif_${Date.now()}` };
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`正在处理通知任务 #${job.id} 类型: ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.debug(`通知任务完成 #${job.id}: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`通知任务失败 #${job.id}: ${error.message}`);
  }
}

@Processor('cleanup')
export class CleanupProcessor {
  private readonly logger = new Logger(CleanupProcessor.name);

  @Process('cleanup-data')
  async handleCleanup(job: Job<CleanupJob>) {
    this.logger.log(`正在处理清理任务 #${job.id}`);
    const { type, beforeDate } = job.data;

    await new Promise(resolve => setTimeout(resolve, 2000));

    this.logger.log(`清理完成 ${type} 时间前 ${beforeDate}`);
    return { success: true, deletedCount: Math.floor(Math.random() * 100) };
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`正在处理清理任务 #${job.id} 类型: ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.logger.debug(`清理任务完成 #${job.id}: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error(`清理任务失败 #${job.id}: ${error.message}`);
  }
}
