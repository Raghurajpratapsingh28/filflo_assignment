import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

export interface InventoryAttributes {
  id: number;
  jwl_part: string;
  customer_part: string;
  description: string;
  uom: string;
  batch: string;
  mfg_date: Date;
  exp_date: Date;
  qty: number;
  weight: number;
  ageing_days?: number;
  days_to_expiry?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'ageing_days' | 'days_to_expiry' | 'created_at' | 'updated_at'> {}

export class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
  public id!: number;
  public jwl_part!: string;
  public customer_part!: string;
  public description!: string;
  public uom!: string;
  public batch!: string;
  public mfg_date!: Date;
  public exp_date!: Date;
  public qty!: number;
  public weight!: number;
  public ageing_days?: number;
  public days_to_expiry?: number;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    jwl_part: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    customer_part: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    uom: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    batch: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mfg_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    exp_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    weight: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    ageing_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    days_to_expiry: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'inventories',
    indexes: [
      {
        fields: ['batch']
      },
      {
        fields: ['jwl_part']
      },
      {
        fields: ['mfg_date']
      },
      {
        fields: ['exp_date']
      },
      {
        fields: ['batch', 'jwl_part'],
        unique: true
      }
    ]
  }
);

export default Inventory;
