import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript';

export interface programAttributes {
    uid?: number;
    name?: string;
    desc?: string;
}

@Table({ tableName: 'program', timestamps: false })
export class program extends Model<programAttributes, programAttributes> implements programAttributes {
    @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
    @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
    uid?: number;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    @Index({ name: 'name', using: 'BTREE', order: 'ASC', unique: true })
    name?: string;

    @Column({ allowNull: true, type: DataType.STRING(255) })
    desc?: string;
}
