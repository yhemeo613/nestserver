import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { QueueService } from "./queue.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/auth.decorator";

@ApiTags("队列管理")
@Controller("queue")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class QueueController {
    constructor(private readonly queueService: QueueService) {}

    @Get("stats/:queueName")
    @Roles("admin")
    @ApiOperation({ summary: "获取队列统计信息" })
    getQueueStats(@Param("queueName") queueName: string) {
        return this.queueService.getQueueStats(queueName);
    }

    @Post("email")
    @Roles("admin")
    @ApiOperation({ summary: "添加邮件任务到队列" })
    @ApiResponse({ status: 201, description: "邮件任务已添加到队列" })
    async addEmailJob(@Body() emailJob: { to: string; subject: string; template: string; data: any }) {
        const job = await this.queueService.addEmailJob(emailJob);
        return { success: true, jobId: job.id };
    }

    @Post("notification")
    @Roles("admin")
    @ApiOperation({ summary: "添加通知任务到队列" })
    @ApiResponse({ status: 201, description: "通知任务已添加到队列" })
    async addNotificationJob(@Body() notificationJob: { userId: string; type: string; message: string; data: any }) {
        const job = await this.queueService.addNotificationJob(notificationJob);
        return { success: true, jobId: job.id };
    }

    @Post("cleanup")
    @Roles("admin")
    @ApiOperation({ summary: "添加清理任务到队列" })
    @ApiResponse({ status: 201, description: "清理任务已添加到队列" })
    async addCleanupJob(@Body() cleanupJob: { type: string; beforeDate: Date }) {
        const job = await this.queueService.addCleanupJob(cleanupJob);
        return { success: true, jobId: job.id };
    }
}
