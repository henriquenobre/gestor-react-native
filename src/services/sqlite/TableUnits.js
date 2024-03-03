import db from "./SQLiteDatabse";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS units (id INT, name TEXT, block TEXT, status INT, reading INT, validity_id INT, image_url TEXT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS units (id INT, name TEXT, block TEXT, status INT, reading INT, validity_id INT, image_url TEXT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO units (id, name, block, status, reading, validity_id, image_url) values (?, ?, ?, ?, ?, ?, ?);",
        [obj.id, obj.name, obj.block, obj.status, obj.reading, obj.validity_id, obj.image_url],
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
    tx.executeSql("DELETE FROM units;")
  })
}

const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE units;");
  })
}


const update = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE units SET status=?, reading=? WHERE id=? AND validity_id=?;",
        [obj.status, obj.reading, obj.id, obj.validity_id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Error updating obj: id=" + obj.id); // nenhum registro alterado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};


const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM units WHERE validity_id=?;",
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


const findByQrCode = (unitId, validityId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM units WHERE id=? AND validity_id=?;",
        [unitId, validityId],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + unitId); // nenhum registro encontrado
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
        "SELECT * FROM units;",
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
  update,
  find,
  findByQrCode,
  dropTable
  // remove,
};
