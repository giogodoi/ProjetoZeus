const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Budget extends Model {
    static associate(models) {
      Budget.belongsTo(models.User, {
        foreignKey: 'responsibleId',
        as: 'responsible'
      });
      Budget.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator'
      });
    }
  }

  Budget.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    budgetNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      defaultValue: () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ORC${year}${month}${random}`;
      }
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A descrição do projeto não pode estar vazia'
        }
      }
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome do cliente não pode estar vazio'
        }
      }
    },
    responsibleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'ID do responsável inválido'
        }
      }
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'O valor estimado deve ser um número decimal'
        },
        min: {
          args: [0],
          msg: 'O valor estimado não pode ser negativo'
        }
      }
    },
    expectedCosts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          msg: 'Os custos previstos devem ser um número decimal'
        },
        min: {
          args: [0],
          msg: 'Os custos previstos não podem ser negativos'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('under_review', 'approved', 'rejected'),
      defaultValue: 'under_review',
      allowNull: false,
      validate: {
        isIn: {
          args: [['under_review', 'approved', 'rejected']],
          msg: 'Status inválido'
        }
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'ID do criador inválido'
        }
      }
    },
    history: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Budget',
    tableName: 'Budgets',
    timestamps: true,
    paranoid: true, // Para soft delete (opcional)
    hooks: {
      beforeCreate: async (budget) => {
        if (!budget.status) {
          budget.status = 'under_review';
        }
        
        // Verificação adicional para os relacionamentos
        if (!budget.responsibleId) {
          throw new Error('Responsável é obrigatório');
        }
        if (!budget.createdBy) {
          throw new Error('Criador é obrigatório');
        }
      },
      beforeUpdate: async (budget) => {
        if (budget.changed()) {
          const oldBudget = await Budget.findByPk(budget.id);
          if (oldBudget) {
            const changes = budget.changed().map(field => ({
              field,
              oldValue: oldBudget[field],
              newValue: budget[field],
              changedAt: new Date()
            }));
            budget.history = [...oldBudget.history, ...changes];
          }
        }
      }
    }
  });

  return Budget;
};