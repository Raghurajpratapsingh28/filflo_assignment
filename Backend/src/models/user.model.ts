import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

export interface UserAttributes {
  id: number;
  username: string;
  hashed_password: string;
  email?: string;
  role?: 'manager' | 'employee';
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'email' | 'role' | 'created_at' | 'updated_at'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public hashed_password!: string;
  public email?: string;
  public role?: 'manager' | 'employee';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    hashed_password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'employee',
      validate: {
        isIn: [['manager', 'employee']]
      }
    }
  },
  {
    sequelize,
    tableName: 'users',
    indexes: [
      {
        fields: ['username'],
        unique: true
      },
      {
        fields: ['email'],
        unique: true
      }
    ]
  }
);

export default User;
