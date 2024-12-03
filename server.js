const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./mydb.sqlite3', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear la tabla 'clientes' si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT(30),
            last_name TEXT(30),
            sexo TEXT(1),
            edad INTEGER
        )
    `);
    console.log("Tabla 'clientes' creada o ya existe.");
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

// Ruta para insertar datos en la base de datos
app.post('/insert', (req, res) => {
    const { first_name, last_name, sexo, edad } = req.body;

    // Verificar que todos los datos estén presentes
    if (!first_name || !last_name || !sexo || !edad) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    // Insertar el nuevo registro en la base de datos
    const query = `INSERT INTO clientes (first_name, last_name, sexo, edad) VALUES (?, ?, ?, ?)`;
    db.run(query, [first_name, last_name, sexo, edad], function(err) {
        if (err) {
            return res.status(500).send('Error al insertar el registro: ' + err.message);
        }
        res.send('Registro insertado correctamente');
    });
});

// Ruta para obtener todos los registros de la base de datos
app.get('/getAll', (req, res) => {
    const query = `SELECT * FROM clientes`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error al obtener los registros: ' + err.message);
        }
        res.json(rows); // Devuelve todos los registros como un arreglo JSON
    });
});

// Ruta para mostrar la página principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para insertar producto
app.post('/insertProducto', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    const sql = `INSERT INTO productos (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`;

    db.run(sql, [nombre, descripcion, precio, cantidad], function (err) {
        if (err) {
            return res.status(500).send("Error al insertar producto.");
        }
        res.status(200).send("Producto insertado correctamente");
    });
});

// Ruta para consultar todos los productos
app.get('/getAllProductos', (req, res) => {
    const sql = 'SELECT * FROM productos';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error al obtener productos.");
        }
        res.status(200).json(rows);
    });
});

// Ruta para insertar venta
app.post('/insertVenta', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;

    const sql = `INSERT INTO ventas (nombre, descripcion, precio, cantidad) VALUES (?, ?, ?, ?)`;
    db.run(sql, [nombre, descripcion, precio, cantidad], function (err) {
        if (err) {
            console.error("Error al insertar venta:", err.message); // Imprimir el error en la consola del servidor
            return res.status(500).send("Error al insertar venta.");
        }
        res.status(200).send("Venta insertada correctamente");
    });
});


// Ruta para consultar todas las ventas
app.get('/getAllVentas', (req, res) => {
    const sql = 'SELECT * FROM ventas';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error al obtener ventas desde la base de datos:", err.message);
            return res.status(500).send("Error al obtener ventas.");
        }
        console.log("Ventas obtenidas:", rows);
        res.status(200).json(rows);
    });
});


// Ruta para eliminar venta
app.delete('/deleteVenta/:id', (req, res) => {
    const id = req.params.id;

    // Validar que el ID sea un número
    if (!id || isNaN(id)) {
        return res.status(400).send("El ID proporcionado no es válido.");
    }

    const sql = `DELETE FROM ventas WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            console.error("Error al eliminar venta:", err.message);
            return res.status(500).send("Error al eliminar venta.");
        }

        // Verificar si se eliminó alguna fila
        if (this.changes === 0) {
            return res.status(404).send("No se encontró una venta con el ID proporcionado.");
        }

        res.status(200).send("Venta eliminada correctamente.");
    });
});

// Ruta para actualizar producto
app.put('/updateProducto/:id', (req, res) => {
    const { nombre, descripcion, precio, cantidad } = req.body;
    const id = req.params.id;

    const sql = `UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, cantidad = ? WHERE id = ?`;
    db.run(sql, [nombre, descripcion, precio, cantidad, id], function (err) {
        if (err) {
            return res.status(500).send("Error al actualizar producto.");
        }
        res.status(200).send("Producto actualizado correctamente");
    });
});

// Ruta para eliminar producto
app.delete('/deleteProducto/:id', (req, res) => {
    const id = req.params.id;

    const sql = `DELETE FROM productos WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).send("Error al eliminar producto.");
        }
        res.status(200).send("Producto eliminado correctamente");
    });
});

// Ruta para insertar proveedor
app.post('/insertProveedor', (req, res) => {
    const { nombre, telefono, direccion } = req.body;
    const sql = `INSERT INTO proveedores (nombre, telefono, direccion) VALUES (?, ?, ?)`;

    db.run(sql, [nombre, telefono, direccion], function (err) {
        if (err) {
            console.error("Error al insertar proveedor:", err);  // Imprime el error en consola
            return res.status(500).send("Error al insertar proveedor: " + err.message);  // Devuelve el mensaje de error
        }
        res.status(200).send("Proveedor insertado correctamente");
    });
});

// Ruta para consultar todos los proveedores
app.get('/getAllProveedores', (req, res) => {
    const sql = 'SELECT * FROM proveedores';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Error al obtener proveedores:", err);  // Imprime el error en la consola
            return res.status(500).json({ error: "Error al obtener proveedores: " + err.message });  // Enviar JSON con error
        }
        res.status(200).json(rows);  // Devuelve los datos en JSON
    });
});


// Ruta para eliminar proveedor
app.delete('/deleteProveedor/:id', (req, res) => {
    const id = req.params.id;

    const sql = 'DELETE FROM proveedores WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).send("Error al eliminar proveedor.");
        }
        res.status(200).send("Proveedor eliminado correctamente");
    });
});


// Configuración del puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
