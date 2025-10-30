import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Shift from './Shift';

class ShiftAssignment extends Model {
    public id!: number;
    public user_id!: number;
    public shift_id!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ShiftAssignment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    shift_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Shift,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'ShiftAssignment'
});

ShiftAssignment.belongsTo(User, { foreignKey: 'user_id' });
ShiftAssignment.belongsTo(Shift, { foreignKey: 'shift_id' });
User.hasMany(ShiftAssignment, { foreignKey: 'user_id' });
Shift.hasMany(ShiftAssignment, { foreignKey: 'shift_id' });

export default ShiftAssignment;