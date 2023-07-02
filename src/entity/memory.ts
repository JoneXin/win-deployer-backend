import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface memoryAttributes {
    uid: number;
    memorySum?: number;
    memoryUsed?: number;
    memoryProccessUsed?: number;
    time?: number;
    programName?: string;
}

@Table({ tableName: 'memory', timestamps: false })
export class memory extends Model<memoryAttributes, memoryAttributes> implements memoryAttributes {
    @Column({ primaryKey: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid!: number;

    @Column({ field: 'memory_sum', allowNull: true, type: DataType.DOUBLE(40, 2), comment: '内存总量 单位：MB' })
    memorySum?: number;

    @Column({ field: 'memory_used', allowNull: true, type: DataType.DOUBLE(40, 2), comment: '总使用的内存 单位：MB' })
    memoryUsed?: number;

    @Column({
        field: 'memory_proccess_used',
        allowNull: true,
        type: DataType.DOUBLE(40, 2),
        comment: '进程使用的内存 单位：MB',
    })
    memoryProccessUsed?: number;

    @Column({ allowNull: true, type: DataType.BIGINT, comment: '记录时间' })
    time?: number;

    @Column({ field: 'program_name', allowNull: true, type: DataType.STRING, comment: '程序名' })
    programName?: string;
}
