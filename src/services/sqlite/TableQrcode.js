import db from "./SQLiteDatabse";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS qrcodes (unit_id INT, qrcode TEXT, condominium_id INT, company_id INT, validity_id INT, read TEXT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS qrcodes (unit_id INT, qrcode TEXT, condominium_id INT, company_id INT, validity_id INT, read TEXT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO qrcodes (unit_id, qrcode, condominium_id, company_id,  validity_id, read) values (?, ?, ?, ?, ?, ?);",
        [obj.unit_id, obj.qrcode, obj.condominium_id, obj.company_id, obj.validity_id, obj.read],
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
    tx.executeSql("DELETE FROM qrcodes;")
  })
}


const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE qrcodes;");
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
        "SELECT * FROM qrcodes WHERE qrcode=?;",
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

const findUnit = (id, validity_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM qrcodes WHERE unit_id=? AND validity_id=?;",
        [id,validity_id],
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


const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM qrcodes;",
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
  findUnit,
  // findByBrand,
  // remove,
  dropTable
};
