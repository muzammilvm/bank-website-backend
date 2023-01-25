const express = require('express')
const cors = require('cors')
const dataService = require('./services/dataService')


// importing jsonwebtoken
const jwt = dataService.jwt


// create server app using express
const server = express()


// use corse
server.use(cors({
    origin: 'http://localhost:4200'
}))


// to parse json data
server.use(express.json())

// set up port for server app
server.listen(3000, () => {
    console.log('server started at 3000');
})

// application specific middleware
const appMiddleware = (req, res, next) => {
    console.log('inside application specific middleware');
    next()
}

server.use(appMiddleware)

// token verify middleware
const jwtMiddleware = (req, res, next) => {
    console.log('router specific middleware')
    // get token from headers
    const token = req.headers['acces-token']
    try {
        // verify token
        const data = jwt.verify(token, 'secretkey0000')
        console.log(data);
        req.fromAcno = data.currentAcno
        console.log('Valid token');
        next()
    }
    catch {
        console.log('Invalid token');
        res.status(401).json({
            message: 'Please Login'
        })
    }

}

server.post('/register', (req, res) => {
    console.log(req.body);
    dataService.register(req.body.uname, req.body.acno, req.body.pass).then((result) => {
        res.status(result.statusCode).json(result)

    })
})

server.post('/login', (req, res) => {
    console.log('Login Api');
    console.log(req.body);
    dataService.login(req.body.acno, req.body.pass).then((result) => {
        res.status(result.statusCode).json(result)

    })
})

server.get('/getBalance/:acno', jwtMiddleware, (req, res) => {

    console.log('balance Api');
    console.log(req.params.acno);
    dataService.getBalance(req.params.acno).then((result) => {
        res.status(result.statusCode).json(result)

    })
})

server.post('/deposit', jwtMiddleware, (req, res) => {
    console.log('Deposit Api');
    console.log(req.body);
    dataService.deposit(req.body.acno, req.body.amount).then((result) => [
        res.status(result.statusCode).json(result)
    ])
})


server.post('/fundTransfer', jwtMiddleware, (req, res) => {
    console.log('fundTransfer Api');
    console.log(req.body);
    dataService.fundTransfer(req, req.body.toAcno, req.body.pass, req.body.amount).then((result) => {
        // res.status(result.statusCode).json(result)
        console.log(result);
        res.status(result.statusCode).json(result)
    })
})

server.get('/all-transactions', jwtMiddleware, (req, res) => {
    console.log('getallTransaction api');
    dataService.getAllTransactions(req).then((result) => {
        res.status(result.statusCode).json(result)
    })
})

server.delete('/delete-account/:acno', jwtMiddleware, (req, res) => {
    console.log('delete-account api');
    console.log(req.params.acno);
    dataService.deleteMyAccount(req.params.acno).then((result) => {
        res.status(result.statusCode).json(result)
    })
})


