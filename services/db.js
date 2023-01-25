const mongoose=require('mongoose')
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/bank',()=>{
    console.log('Database Connected Successfully');
})

const User= mongoose.model('User',{
    username:String,
    acno:Number,
    password:String,
    balance:Number,
    transaction:[]
})
module.exports={
    User
}