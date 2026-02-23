import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['in-progress','review','completed'],
        default:'in-progress'
    },
    priority:{
        type:String,
        enum:['low','medium','high','critical'],
        default:'medium'
    },
    category:{
        type:String,
        enum:['frontend','backend','design','testing','devops','other'],
        default:'other'
    },
    deadLine:{
        type:Date,
        required:true
    },
    completedAt:{
        type:Date,
        default:null
    }
},{
    timestamps:true
})

const Task = mongoose.model('Task',taskSchema)
export default Task
