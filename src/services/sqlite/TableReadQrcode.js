import db from "./SQLiteDatabse";

db.transaction((tx) => {
  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS qrcodes_read (unit_id INT, image_filename TEXT, reading INT, image TEXT, send INT, validity_id INT);"
  );
});


const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS qrcodes_read (unit_id INT, image_filename TEXT, reading INT, image TEXT, send INT, validity_id INT);"
      );
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO qrcodes_read (unit_id, image_filename, reading, image, send, validity_id) values (?, ?, ?, ?, ?, ?);",
        [obj.unit_id, obj.image_filename, obj.reading, obj.image, obj.send, obj.validity_id],
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
    tx.executeSql("DELETE FROM qrcodes_read;")
  })
}

const deleteSend = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM qrcodes_read WHERE send=?",[1])
  })
}

const dropTable = ()=>{
  db.transaction((tx)=>{
    tx.executeSql("DROP TABLE qrcodes_read;");
  })
}



const update = (isSend, unit_id, validity_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE qrcodes_read SET send=? WHERE unit_id=? AND validity_id=?;",
        [isSend, unit_id, validity_id],
        //-----------------------
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Error updating obj: id=" + unit_id); // nenhum registro alterado
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
        "SELECT * FROM qrcodes_read WHERE send=?;",
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


const findById = (id,validity_id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM qrcodes_read WHERE unit_id=? AND validity_id=?;",
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


const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM qrcodes_read;",
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
  deleteSend,
  all,
  update,
  find,
  findById,
  dropTable
  // remove,
};
