import db from "./SQLiteDatabse";

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  // tx.executeSql("DROP TABLE condominiums;");
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS condominiums (id INT, corporate_name TEXT, unit_size INT, block_size INT, address TEXT, number TEXT, city TEXT, uf TEXT, date TEXT);"
  );
});

/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS condominiums (id INT, corporate_name TEXT, unit_size INT, block_size INT, address TEXT, number TEXT, city TEXT, uf TEXT, date TEXT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO condominiums (id, corporate_name, unit_size, block_size, address, number, city, uf, date) values (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [obj.id, obj.corporate_name, obj.unit_size, obj.block_size, obj.address, obj.number, obj.city, obj.uf, obj.date],
        //-----------------------
        (_, { rowsAffected, insertId }) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

const deleteTable = () => {
  db.transaction((tx)=>{
    tx.executeSql("DELETE FROM condominiums;")
  })
}

const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE condominiums;");
  })
}

/**
 * ATUALIZA UM REGISTRO JÁ EXISTENTE
 * - Recebe o ID do registro e um OBJETO com valores atualizados;
 * - Retorna uma Promise:
 *  - O resultado da Promise é a quantidade de registros atualizados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
// const update = (id, obj) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       //comando SQL modificável
//       tx.executeSql(
//         "UPDATE cars SET brand=?, model=?, hp=? WHERE id=?;",
//         [obj.brand, obj.model, obj.hp, id],
//         //-----------------------
//         (_, { rowsAffected }) => {
//           if (rowsAffected > 0) resolve(rowsAffected);
//           else reject("Error updating obj: id=" + id); // nenhum registro alterado
//         },
//         (_, error) => reject(error) // erro interno em tx.executeSql
//       );
//     });
//   });
// };

// /**
//  * BUSCA UM REGISTRO POR MEIO DO ID
//  * - Recebe o ID do registro;
//  * - Retorna uma Promise:
//  *  - O resultado da Promise é o objeto (caso exista);
//  *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
//  */
const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM condominiums WHERE id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

// /**
//  * BUSCA UM REGISTRO POR MEIO DA MARCA (brand)
//  * - Recebe a marca do carro;
//  * - Retorna uma Promise:
//  *  - O resultado da Promise é um array com os objetos encontrados;
//  *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
//  *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
//  */
// const findByBrand = (brand) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       //comando SQL modificável
//       tx.executeSql(
//         "SELECT * FROM cars WHERE brand LIKE ?;",
//         [brand],
//         //-----------------------
//         (_, { rows }) => {
//           if (rows.length > 0) resolve(rows._array);
//           else reject("Obj not found: brand=" + brand); // nenhum registro encontrado
//         },
//         (_, error) => reject(error) // erro interno em tx.executeSql
//       );
//     });
//   });
// };

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM condominiums;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * REMOVE UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
// const remove = (id) => {
//   return new Promise((resolve, reject) => {
//     db.transaction((tx) => {
//       //comando SQL modificável
//       tx.executeSql(
//         "DELETE FROM cars WHERE id=?;",
//         [id],
//         //-----------------------
//         (_, { rowsAffected }) => {
//           resolve(rowsAffected);
//         },
//         (_, error) => reject(error) // erro interno em tx.executeSql
//       );
//     });
//   });
// };

export default {
  create,
  deleteTable,
  all,
  // update,
  find,
  // findByBrand,
  // remove,
  dropTable
};
