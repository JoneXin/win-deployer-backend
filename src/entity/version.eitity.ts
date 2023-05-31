import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

@Table({ tableName: 'version', timestamps: false })
export class VersionModel extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid?: number;
    @Column({ type: DataType.STRING(255) })
    name!: string;
    @Column({ type: DataType.STRING(255) })
    version!: string;
    @Column({ field: 'deploy_path', type: DataType.STRING(255) })
    deployPath!: string;
    @Column({ field: 'exec_path', type: DataType.STRING(255) })
    execPath!: string;
    @Column({ field: 'package_path', type: DataType.STRING(255) })
    packagePath!: string;
    @Column({ field: 'is_current', type: DataType.STRING(255) })
    isCurrent!: string;
    @Column({ field: 'gen_time', type: DataType.STRING(255) })
    genTime!: string;
    @Column({ field: 'running_config', type: DataType.STRING(255) })
    runningConfig!: string;
    @Column({ field: 'program_config', type: DataType.STRING(255) })
    programConfig!: string;
    @Column({ field: 'desc', type: DataType.STRING(255) })
    desc!: string;
}
