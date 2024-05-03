![Cabecera](../../images/22795b6c552ff69919ee656e69d111faf19ed5ff1df20f76b3990496795076a2.png)

### Ejercitación 3: API con Express, Sequelize y SqLite

### Enunciado
El objetivo de esta ejercitación es desarrollar una API REST utilizando Node.js con Express y Sequelize para gestionar una base de datos SQLite. Los estudiantes aprenderán a configurar el entorno, definir modelos de datos, crear operaciones CRUD directamente en un solo archivo, y probar su API utilizando Postman.

### Paso 1: Configuración Inicial y Estructura del Proyecto
1. **Configuración del entorno Node.js**: Asegúrate de que Node.js esté instalado.
2. **Creación del proyecto**:
   - Inicia un nuevo proyecto de Node.js con `npm init -y`.
   - Crea un archivo principal, por ejemplo, `app.js`.
3. **Instalación de dependencias**:
   ```bash
   npm install express sequelize sqlite3
   ```

### Paso 2: Configuración de Express y Modelo de Datos
1. **Configuración de Express**:
   - Importa y configura Express para usar JSON:
     ```javascript
     const express = require('express');
     const app = express();
     app.use(express.json());
     ```
   - Define el puerto del servidor:
     ```javascript
     const PORT = 3000;
     ```
2. **Configuración de Sequelize y Modelo de Datos**:
   - Conecta Sequelize con SQLite y define el modelo `User`:
     ```javascript
     const { Sequelize, DataTypes } = require('sequelize');
     const sequelize = new Sequelize('sqlite::memory:');

     const User = sequelize.define('User', {
       username: DataTypes.STRING,
       email: { type: DataTypes.STRING, validate: { isEmail: true } },
       password: DataTypes.STRING
     }, {
       tableName: 'Users'
     });

     sequelize.sync();
     ```

### Paso 3: Iniciar la Aplicación

1. **Abrir la Terminal o CMD**:
   - Asegúrate de que estás en el directorio raíz de tu proyecto donde se encuentra el archivo `app.js`.

2. **Ejecutar la Aplicación**:
   - Utiliza el siguiente comando para iniciar tu aplicación:
     ```bash
     node app.js
     ```
   - Este comando carga el archivo `app.js`, inicializa la base de datos si es necesario y luego inicia el servidor de Express en el puerto configurado. Verás un mensaje en la consola que indica que el servidor está corriendo, similar a `Servidor corriendo en http://localhost:3000`.

### Paso 4: CRUD Operaciones Directamente en `app.js`
1. **Crear un usuario**:
   ```javascript
   app.post('/users', async (req, res) => {
     try {
       const newUser = await User.create(req.body);
       res.status(201).json(newUser);
     } catch (error) {
       res.status(400).json({ error: error.message });
     }
   });
   ```
2. **Leer usuarios**:
   ```javascript
   app.get('/users', async (req, res) => {
     try {
       const users = await User.findAll();
       res.json(users);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```
3. **Actualizar un usuario**:
   ```javascript
   app.put('/users/:id', async (req, res) => {
     try {
       const updated = await User.update(req.body, {
         where: { id: req.params.id }
       });
       if (updated) {
         const updatedUser = await User.findByPk(req.params.id);
         res.json(updatedUser);
       } else {
         res.status(404).send('Usuario no encontrado');
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```
4. **Eliminar un usuario**:
   ```javascript
   app.delete('/users/:id', async (req, res) => {
     try {
       const deleted = await User.destroy({
         where: { id: req.params.id }
       });
       if (deleted) {
         res.status(204).send("Usuario eliminado");
       } else {
         res.status(404).send('Usuario no encontrado');
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

### Paso 4: Iniciar el Servidor
   - Añade el código para iniciar el servidor:
     ```javascript
     app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
     ```
     
### Paso 5: Probar la API con Postman
1. **Crear un usuario**:
   - Método: POST
   - URL: `http://localhost:3000/users`
   - Body: `{"username": "newuser", "email": "newuser@example.com", "password": "newpass"}`
   - Este método debería retornar el usuario creado con un status 201 si es exitoso.
2. **Leer todos los usuarios**:
   - Método: GET
   - URL: `http://localhost:3000/users`
   - Este método debería listar todos los usuarios registrados.
3. **Actualizar un usuario**:
   - Método: PUT
   - URL: `http://localhost:3000/users/1` (asumiendo que el ID del usuario es 1)
   - Body: `{"username": "updateduser", "email": "updateduser@example.com", "password": "updatedpass"}`
   - Este método debería actualizar los datos del usuario especificado y retornar los datos actualizados.
4. **Eliminar un usuario**:
   - Método: DELETE
   - URL: `http://localhost:3000/users/1` (asumiendo que el ID del usuario es 1)
   - Este método debería eliminar el usuario especificado y retornar un status 204 si es exitoso.
