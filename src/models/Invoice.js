const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  // Customer information
  customerName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'customer_name',
    validate: {
      notEmpty: { msg: 'Customer name is required' }
    }
  },
  customerEmail: {
    type: DataTypes.STRING(255),
    field: 'customer_email',
    validate: {
      isEmail: { msg: 'Invalid email format' }
    }
  },
  customerPhone: {
    type: DataTypes.STRING(50),
    field: 'customer_phone'
  },
  customerAddress: {
    type: DataTypes.TEXT,
    field: 'customer_address'
  },
  // Financial information
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.ENUM('LYD', 'USD', 'EUR'),
    defaultValue: 'LYD',
    allowNull: false
  },
  // Status and dates
  status: {
    type: DataTypes.ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'issue_date'
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'due_date',
    validate: {
      notEmpty: { msg: 'Due date is required' }
    }
  },
  paidDate: {
    type: DataTypes.DATE,
    field: 'paid_date'
  },
  notes: {
    type: DataTypes.TEXT
  },
  // Foreign keys
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    field: 'updated_by',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  hooks: {
    // Generate invoice number before creating
    beforeCreate: async (invoice) => {
      if (!invoice.invoiceNumber) {
        const count = await Invoice.count();
        const year = new Date().getFullYear();
        invoice.invoiceNumber = `INV-${year}-${String(count + 1).padStart(5, '0')}`;
      }
    },
    // Calculate totals before saving
    beforeSave: async (invoice) => {
      // Total = subtotal + tax
      invoice.total = parseFloat(invoice.subtotal || 0) + parseFloat(invoice.tax || 0);
    }
  },
  indexes: [
    { fields: ['invoiceNumber'] },
    { fields: ['status'] },
    { fields: ['created_by'] },
    { fields: ['customer_name'] },
    { fields: ['issue_date'] }
  ]
});

// Invoice Items (separate table)
const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoice_id',
    references: {
      model: 'invoices',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Item description is required' }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Quantity must be at least 1' }
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'unit_price',
    validate: {
      min: { args: [0], msg: 'Unit price cannot be negative' }
    }
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'invoice_items',
  timestamps: true,
  hooks: {
    beforeSave: async (item) => {
      // Calculate item total
      item.total = parseFloat(item.quantity) * parseFloat(item.unitPrice);
    }
  }
});

// Define relationships
Invoice.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Invoice.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });
Invoice.hasMany(InvoiceItem, { as: 'items', foreignKey: 'invoiceId' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });

module.exports = {
  Invoice,
  InvoiceItem
};
