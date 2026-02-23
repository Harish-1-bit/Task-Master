import mongoose from "mongoose";

const projectSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['open','in-progress','completed'],
        default:'open'
    },
    priority:{
        type:String,
        enum:['low','medium','high','critical'],
        default:'medium'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    assignedManager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    assignedEmployees:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    deadLine:{
        type:Date,
        required:true
    },
    budget:{
        type:Number,
        default:0
    },
    tags:[{
        type:String
    }]
},{
    timestamps:true
})

const Project = mongoose.model('Project',projectSchema)
export default Project
