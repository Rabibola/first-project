const express = require('express')
const uuid = require('uuid')

const app = express()
app.use(express.json())

/* 
    - Query params => meusite.com/users?name=henrique&age=19  // filtro
    - Route params => /users/2  // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
    - Request Body => { "name":"Henrique", "age":}

    - GET      => Buscar informações no back-and
    - POST     => Criar Informações no back-and 
    - PUT      => alterar/Atualizar informações no bak-and
    - DELETE   => deletar informaçoes no back-and

    - MIDDLEWARE => INTERCEPTAÇÃO => Tem o poder de parar ou alterar dados da requisição
*/

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id ===id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

app.use(checkUserId)

app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.params
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age } 

    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})




app.listen(3000, () => {
    console.log("server started on port 3000😁")
})