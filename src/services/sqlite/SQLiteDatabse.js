import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("gestor.db")

export default db
