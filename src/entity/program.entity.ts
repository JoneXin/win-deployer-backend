import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

@Table({ tableName: 'program', timestamps: false })
export class ProgramModel extends Model {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid?: number;
    @Column({ type: DataType.STRING(255) })
    name!: string;
    @Column({ allowNull: true, type: DataType.STRING(255) })
    desc?: string;
}
