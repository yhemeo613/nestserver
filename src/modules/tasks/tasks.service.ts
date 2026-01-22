import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyCleanup() {
    this.logger.log('正在运行每日清理任务...');
    try {
      const inactiveUsers = await this.userRepository
        .createQueryBuilder('user')
        .where('user.lastLoginAt < :date', {
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        })
        .getMany();

      this.logger.log(`发现 ${inactiveUsers.length} 个非活跃用户`);
    } catch (error) {
      this.logger.error('每日清理任务失败', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyStats() {
    this.logger.log('正在运行每小时统计收集...');
    try {
      const totalUsers = await this.userRepository.count();
      const activeUsers = await this.userRepository.count({
        where: { isActive: true },
      });

      this.logger.log(`总用户数: ${totalUsers}, 活跃用户数: ${activeUsers}`);
    } catch (error) {
      this.logger.error('每小时统计任务失败', error);
    }
  }

  @Cron('0 */5 * * * *')
  async handleEveryFiveMinutes() {
    this.logger.debug('正在运行5分钟健康检查...');
  }

  @Timeout(5000)
  handleStartup() {
    this.logger.log('应用启动成功');
  }
}
