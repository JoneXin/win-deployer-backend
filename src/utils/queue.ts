// eslint-disable-next-line @typescript-eslint/no-var-requires
const schedule = require('node-schedule');

import { Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const queue = require('queue');
export class ScheduleQueue {
    public taskTag;
    public taskQueue;
    public huntingTaskSchedule;
    public isQueueAvailable = true;
    private taskLen = 0;
    private readonly logger = new Logger(ScheduleQueue.name);

    private maxQueueTaskNum = 200;
    private availableTaskNum = 170;
    private inspectTaskTimeout = '0 * * * * *';

    private socket: WebSocket | any = null;

    constructor(taskTag: string) {
        this.taskTag = taskTag;
        this.taskQueue = new queue({ concurrency: 1, autostart: true });

        this.init();
    }

    private init() {
        // init task inspect task
        this.huntingTaskSchedule = schedule.scheduleJob(this.inspectTaskTimeout, () => {
            this.inspectTaskProcees();
        });
    }

    public setSocket(socket: WebSocket | any) {
        this.socket = socket;
    }

    // 设置原始任务长度，方便获取进度条
    public setTaskLen(len: number) {
        this.taskLen = len;
    }

    // 设置原始任务长度，方便获取进度条
    public getTaskLen(): number {
        return this.taskLen;
    }

    // 当前队列里的任务长度
    public getCurrentTaskLen(): number {
        return this.taskQueue.length;
    }

    /**
     * 允许设置监控间隔
     * @param timeCornStr
     * @returns
     */
    public setInspectTaskTimeout(timeCornStr: string): boolean {
        this.inspectTaskTimeout = timeCornStr;
        return true;
    }

    /**
     * 设置 最大task数量
     * @param maxQueueTaskNum
     */
    public setMaxQueueTaskNum(maxQueueTaskNum: number) {
        this.maxQueueTaskNum = maxQueueTaskNum;
    }

    /**
     * 追踪任务情况
     */
    private inspectTaskProcees() {
        const taskQueueLen = this.taskQueue.length;

        // 停止向 add 任务
        if (taskQueueLen > this.maxQueueTaskNum) {
            this.logger.log(
                `task: ${this.taskTag} ==> 任务数量:${taskQueueLen}，超过阈值: ${this.maxQueueTaskNum},即将把队列转成不可用状态!!`,
            );
            this.isQueueAvailable = false;
        }

        // 低于可用状态阈值 置队列可用 可以添加新的任务
        if (taskQueueLen <= this.availableTaskNum && this.isQueueAvailable == false) {
            this.logger.log(
                `task: ${this.taskTag} ==> 任务数量:${taskQueueLen}，低于可用值: ${this.availableTaskNum},即将把队列转成可用状态`,
            );
            this.isQueueAvailable = true;
        }
    }

    /**
     * 添加任务
     * @param taskFunc 任务函数
     * @param task_tag 任务表示
     * @return 添加任务是否成功
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    public addTask(taskFunc: Function): boolean {
        // 队列不可用状态
        if (!this.isQueueAvailable) return false;
        this.logger.log(`${this.taskTag}==> 添加任务`);
        this.taskQueue.push(async (cb) => {
            await taskFunc();
            this.logger.log('完成任务!');
            cb();
        });

        return true;
    }
}
