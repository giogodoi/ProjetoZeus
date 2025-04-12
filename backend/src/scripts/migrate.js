const { Sequelize } = require('sequelize');
const config = require('../config/database');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

async function runMigrations() {
  try {
    // Conecta ao banco de dados
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Ler todos os arquivos de migração
    const migrationsPath = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsPath).sort(); // Ordena os arquivos para garantir a ordem correta

    // Executar cada migração em ordem
    for (const file of files) {
      if (file.endsWith('.js')) {
        console.log(`Running migration: ${file}`);
        const migration = require(path.join(migrationsPath, file));
        await migration.up(sequelize.getQueryInterface(), Sequelize);
        console.log(`Migration ${file} completed successfully`);
      }
    }

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    // Fecha a conexão com o banco de dados
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

runMigrations();