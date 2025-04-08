import { Sequelize } from "sequelize";

//configuração da conexão com o banco de dados
const sequelize = new Sequelize('biblioteca2025', 'postgres', 'postgrespw', {
    host: 'localhost',
    port: 32768,
    dialect: 'postgres',
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

export default sequelize;