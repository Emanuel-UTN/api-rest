// Configuracion de Express
const express = require('express');
const { questionEMail } = require('readline-sync');
const app = express();
app.use(express.json())

// Definicion del puerto
const PORT = 3000;

// Configuracion de Sequelize
const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

// Modelo de Datos
const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: { type: DataTypes.STRING, validate: {isEmail: true}},
    password: DataTypes.STRING
},{
    tableName: 'Users'
});
sequelize.sync()

// Crear un Usuario
app.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({error: error})
    }
});

// Leer Usuarios
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error})
    }
});

// Actualizar un Usuario
app.put('/users/:id', async (req, res) => {
    try {
      const updated = await User.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedUser = await User.findByPk(req.params.id);
        res.status(200).json(updatedUser);
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Eliminar un Usuario
app.delete('/users/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({ where: {
            id: req.params.id
        }});

        if(deleted){
            res.status(204).send("Usuario eliminado");
        }else{
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        res.status(500).json({error: error})
    }
});

// Inicializar Servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));