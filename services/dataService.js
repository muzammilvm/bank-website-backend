// import db.js
const db = require('./db')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

const register = (uname, acno, pass) => {
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);
        if (result) {
            return {
                statusCode: 403,
                message: 'Account Already exist'
            }
        } else {
            const newUser = new db.User({
                username: uname,
                acno,
                password: pass,
                balance: 0,
                transaction: []
            })

            newUser.save()
            return {
                statusCode: 200,
                message: 'Registration Successfull'
            }
        }
    })
}

// login
const login = (acno, pass) => {
    console.log('login function')
    return db.User.findOne({
        acno: acno,
        password: pass
    }).then((result) => {
        console.log(result);
        if (result) {
            // generating token
            const token = jwt.sign({
                currentAcno: acno
            }, 'secretkey0000')
            return {
                statusCode: 200,
                message: 'login Successfull',
                username: result.username,
                currentAcno: acno,
                token: token
            }
        } else {
            return {
                statusCode: 403,
                message: 'Invalid Account or password'
            }
        }
    })
}

// getBalance
const getBalance = (acno) => {
    return db.User.findOne({
        acno: acno
    }).then((result) => {
        if (result) {
            return {
                statusCode: 200,
                balance: result.balance,
            }
        } else {
            return {
                statusCode: 403,
                message: 'Something Went Wrong'
            }
        }
    })
}

// deposit
const deposit = (acno, amt) => {
    let amount = Number(amt)
    return db.User.findOne({
        acno
    }).then((result) => {
        if (result) {
            result.balance += amount
            result.transaction.push({
                type: 'CREDIT',
                fromAcno: acno,
                toAcno: acno,
                amount
            })
            result.save()

            return {
                statusCode: 200,
                message: 'Amount Succesfully Deposited'
            }
        } else {
            return {
                statusCode: 403,
                message: 'Invalid Account'
            }
        }
    })
}

// fundTransfer
const fundTransfer = (req, toAcno, pass, amt) => {
    let amount = Number(amt)
    let fromAcno = req.fromAcno

    return db.User.find({
        acno: fromAcno,
        password: pass
    }).then((result) => {

        if (toAcno == fromAcno) {
            return {
                statusCode: 401,
                message: 'Permission Denied due to Own Account Transfer!!'
            }
        }

        console.log(result);
        if (result[0]) {

            //    debit account details
            let fromAcnoBalance = result[0].balance



            if (fromAcnoBalance >= amount) {
                result[0].balance = fromAcnoBalance - amount


                // credit account details
                return db.User.findOne({
                    acno: toAcno
                }).then((creditdata) => {
                    if (creditdata) {
                        creditdata.balance += amount
                        creditdata.transaction.push({
                            type: 'CREDIT',
                            fromAcno,
                            toAcno,
                            amount
                        })

                        creditdata.save()
                        console.log(creditdata);

                        // debited from
                        result[0].transaction.push({
                            type: 'DEBIT',
                            fromAcno,
                            toAcno,
                            amount
                        })
                        result[0].save()
                        console.log(result);

                        return {
                            statusCode: 200,
                            message: 'Amount Transfer Successfully'
                        }
                    } else {
                        return {
                            statusCode: 401,
                            message: 'Invalid Credit Account Number'
                        }
                    }
                })

            } else {
                return {
                    statusCode: 403,
                    message: 'Insufficient Balance'
                }
            }
        } else {
            return {
                statusCode: 401,
                message: 'Invalid Password'
            }
        }
    })
}

// get all transactions
const getAllTransactions = (req) => {
    let acno = req.fromAcno
    return db.User.findOne({
        acno
    }).then((result) => {
        console.log(result);
        if (result) {
            return {
                statusCode:200,
                transaction:result.transaction
            }
        } else {
            return {
                statusCode: 401,
                message: 'Invalid Account Number'
            }
        }
    })
}

const deleteMyAccount=(acno)=>{
return db.User.deleteOne({
    acno
}).then((result)=>{
    if(result){
        return {
            statusCode: 200,
            message: 'Account Deleted successfully'
        }
    }else{
        return {
            statusCode: 401,
            message: 'Invalid Account Number'
        }
    }
})
}

module.exports = {
    register,
    login,
    getBalance,
    jwt,
    deposit,
    fundTransfer,
    getAllTransactions,
    deleteMyAccount
}