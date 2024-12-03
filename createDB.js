const sqlite3 = require('sqlite3').verbose();

// Crear (o abrir) la base de datos SQLite
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

// Crear las tablas si no existen
db.serialize(() => {
    // Crear la tabla 'clientes'
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT(30),
            last_name TEXT(30),
            sexo TEXT(1),
            edad INTEGER
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla 'clientes':", err.message);
        } else {
            console.log("Tabla 'clientes' creada o ya existe.");
        }
    });

    // Crear la tabla 'productos'
    db.run(`
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT(100),
            descripcion TEXT,
            precio REAL,
            cantidad INTEGER
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla 'productos':", err.message);
        } else {
            console.log("Tabla 'productos' creada o ya existe.");
        }
    });


    // Crear la tabla 'proveedores' si no existe
    db.run(`
        CREATE TABLE IF NOT EXISTS proveedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT(100),
            telefono TEXT(15),
            direccion TEXT
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla proveedores:", err);
        } else {
            console.log("Tabla 'proveedores' creada o ya existe.");
        }
    });


    // Crear la tabla 'ventas'
    db.run(`
        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT(100),
            descripcion TEXT,
            precio REAL,
            cantidad INTEGER
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla 'ventas':", err.message);
        } else {
            console.log("Tabla 'ventas' creada o ya existe.");
        }
    });
});

// Cerrar la conexión a la base de datos
db.close((err) => {
    if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos cerrada.');
    }
});
