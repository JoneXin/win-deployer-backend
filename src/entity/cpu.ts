import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface cpuAttributes {
    uid: number;
    cpuUsed?: number;
    cpuProcessUsed?: number;
    programName?: string;
    time?: number;
}

@Table({ tableName: 'cpu', timestamps: false })
export class cpu extends Model<cpuAttributes, cpuAttributes> implements cpuAttributes {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid!: number;

    @Column({
        field: 'cpu_used',
        allowNull: true,
        type: DataType.DOUBLE(40, 2),
        comment: 'Cpu 占用率：xx.xx  例：92.13',
    })
    cpuUsed?: number;

    @Column({
        field: 'cpu_process_used',
        allowNull: true,
        type: DataType.DOUBLE(40, 2),
        comment: '进程Cpu 占用率：xx.xx  例：92.13',
    })
    cpuProcessUsed?: number;

    @Column({ field: 'program_name', allowNull: true, type: DataType.STRING, comment: '程序名' })
    programName?: string;

    @Column({ allowNull: true, type: DataType.BIGINT, comment: '记录时间' })
    time?: number;
}
