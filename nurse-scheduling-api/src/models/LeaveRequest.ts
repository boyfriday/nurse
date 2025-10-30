import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import ShiftAssignment from './ShiftAssignment';
import User from './User';

class LeaveRequest extends Model {
    public id!: number;
    public shift_assignment_id!: number;
    public reason!: string;
    public status!: 'pending' | 'approved' | 'rejected';
    public approved_by?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

LeaveRequest.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shift_assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ShiftAssignment,
            key: 'id'
        }
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    approved_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'LeaveRequest'
});

LeaveRequest.belongsTo(ShiftAssignment, { foreignKey: 'shift_assignment_id' });
LeaveRequest.belongsTo(User, { as: 'approver', foreignKey: 'approved_by' });
ShiftAssignment.hasMany(LeaveRequest, { foreignKey: 'shift_assignment_id' });

export default LeaveRequest;