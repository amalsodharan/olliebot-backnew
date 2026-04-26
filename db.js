import { Sequelize, Op } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from './modules/userModel.js';

dotenv.config();

let sequelize;
let Users;
let Models;

const connection = {};

export default async function connectDB() {
  if (connection.isConnected) {
    console.log('=> Using existing connection.');
    return Models;
  }

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialectOptions: { decimalNumbers: true },
      logging: false,
    }
  );

  Users = UserModel(sequelize, Sequelize);
  Models = { Users, Op };

  await sequelize.sync();
  await sequelize.authenticate();
  connection.isConnected = true;
  console.log('=> Created a new connection.');
  return Models;
}
