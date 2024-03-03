import db from "./SQLiteDatabse";

db.transaction((tx) => {
  // tx.executeSql("DROP TABLE companys;");
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS companys (id INT, company_name TEXT, condominium_id INT, company_type INT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS companys (id INT, company_name TEXT, condominium_id INT, company_type INT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO companys (id, company_name, condominium_id, company_type) values (?, ?, ?, ?);",
        [obj.id ,obj.company_name, obj.condominium_id, obj.company_type],
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
    tx.executeSql("DELETE FROM companys;")
  })
}

const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE companys;");
  })
}


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


const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM companys WHERE condominium_id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
          else reject("Obj not found: id=" + id); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const findById = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM companys WHERE id=?;",
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


const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM companys;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


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
  findById,
  // remove,
  dropTable
};
