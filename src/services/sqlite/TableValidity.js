import db from "./SQLiteDatabse";

db.transaction((tx) => {
  // tx.executeSql("DROP TABLE validitys;");
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS validitys (id INT, name TEXT, company_id INT, condominium_id INT,percentage FLOAT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS validitys (id INT, name TEXT, company_id INT, condominium_id INT,percentage FLOAT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO validitys (id, name, company_id, condominium_id, percentage) values (?, ?, ?, ?, ?);",
        [obj.id, obj.name, obj.company_id, obj.condominium_id, obj.percentage],
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
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM validitys;")
  })
}

const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE validitys;");
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


const find = (idCondo, idCompany) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM validitys WHERE condominium_id=? AND company_id=?;",
        [idCondo,idCompany],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
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
        "SELECT * FROM validitys WHERE id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: brand=" + id); // nenhum registro encontrado
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
        "SELECT * FROM validitys;",
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
  dropTable
  // remove,
};
