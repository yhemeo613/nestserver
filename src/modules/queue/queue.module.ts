import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { EmailProcessor, NotificationProcessor, CleanupProcessor } from './queue.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'notification' },
      { name: 'cleanup' },
    ),
  ],
  controllers: [QueueController],
  providers: [
    QueueService,
    EmailProcessor,
    NotificationProcessor,
    CleanupProcessor,
  ],
  exports: [QueueService],
})
export class QueueModule {}
