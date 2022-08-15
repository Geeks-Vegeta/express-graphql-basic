const mongoose = require('mongoose');

const TaskSchema= mongoose.Schema({
    name:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

const taskModel = mongoose.model("Task", TaskSchema);
module.exports=taskModel;