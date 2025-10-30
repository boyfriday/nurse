import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Shift extends Model {
    public id!: number;
    public date_start_time!: Date;
    public date_end_time!: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Shift.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date_start_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_end_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Shift'
});

export default Shift;