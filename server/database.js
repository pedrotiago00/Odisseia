import { createRequire } from "module";
const require = createRequire(import.meta.url);
const firebird = require("node-firebird");

const options = {
  host: '127.0.0.1', 
  port: 3050,
  database: 'C:\\Users\\pedro.tiago\\Desktop\\Banco de dados Projeto Integrador\\banco.fdb', 
  user: 'SYSDBA',
  password: 'masterkey',
  lowercase_keys: false,
  role: null,
  pageSize: 4096,
};

const pool = firebird.pool(5, options);
export default {
  get: (callback) => pool.get(callback),
};