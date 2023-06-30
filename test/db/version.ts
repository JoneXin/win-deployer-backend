import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface versionAttributes {
    uid?: number;
    name?: string;
    version?: string;
    deployPath?: string;
    execPath?: string;
    packagePath?: string;
    isCurrent?: string;
    genTime?: string;
    runningConfig?: string;
    programConfig?: string;
    desc?: string;
}

@Table({ tableName: 'version', timestamps: false })
export class version extends Model<versionAttributes, versionAttributes> implements versionAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid?: number;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    @Index({ name: 'name', using: 'BTREE', order: 'ASC', unique: true })
    name?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    @Index({ name: 'name', using: 'BTREE', order: 'ASC', unique: true })
    version?: string;

    @Column({ field: 'deploy_path', allowNull: true, type: DataType.STRING(255) })
    deployPath?: string;

    @Column({ field: 'exec_path', allowNull: true, type: DataType.STRING(255) })
    execPath?: string;

    @Column({ field: 'package_path', allowNull: true, type: DataType.STRING(255) })
    packagePath?: string;

    @Column({ field: 'is_current', allowNull: true, type: DataType.STRING(255) })
    isCurrent?: string;

    @Column({ field: 'gen_time', allowNull: true, type: DataType.STRING(255) })
    genTime?: string;

    @Column({ field: 'running_config', allowNull: true, type: DataType.STRING(255) })
    runningConfig?: string;

    @Column({ field: 'program_config', allowNull: true, type: DataType.STRING(255) })
    programConfig?: string;

    @Column({ allowNull: true, type: DataType.STRING, comment: '版本备注' })
    desc?: string;
}
