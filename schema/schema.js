const graphql = require('graphql');

const userModel = require('../models/userModel');

const taskModel = require('../models/taskModel');


const { GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLSchema, 
    GraphQLNonNull } = graphql;

const UserType=new GraphQLObjectType({
    name:'User',
    fields:()=>({
        id:{type:new GraphQLNonNull(GraphQLID)},
        name: { type: new GraphQLNonNull(GraphQLString) },
        password:{type: new GraphQLNonNull(GraphQLString)}
    })
});


const AddTaskType = new GraphQLObjectType({
    name:"AddTask",
    fields:()=>({
        id:{type: new GraphQLNonNull(GraphQLID)},
        name:{type: new GraphQLNonNull(GraphQLString)},
        user:{type: new GraphQLNonNull(GraphQLID)},

    })
})

const TaskType = new GraphQLObjectType({
    name:"Task",
    fields:()=>({
        id:{type: new GraphQLNonNull(GraphQLID)},
        name:{type: new GraphQLNonNull(GraphQLString)},
        user:{
            type: UserType,
            resolve(parent, args){
                return userModel.findOne({"_id": parent.user.toString()})
            }

        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        Users:{
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return userModel.find({});
            }
        },
        User:{
            type:UserType,
            args:{id:{type: new GraphQLNonNull(GraphQLID)}},
            resolve(parent,args){
                return userModel.findOne({"_id":args.id})
            }
        },
        Tasks:{
            type:new GraphQLList(TaskType),
            resolve(parent, args){
                return taskModel.find({});
            }

        },
        Task:{
            type: TaskType,
            args:{id:{type:new GraphQLNonNull(GraphQLID)}},
            resolve(parent, args){
                return taskModel.findOne({"_id":args.id})

            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addUser:{
            type:UserType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)}, 
                password:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                const newUser = new userModel({
                    name:args.name, 
                    password:args.password
                })
                return newUser.save();
            }
        },
        editUser:{
            type:UserType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                const update = {name:args.name}
                return userModel.findByIdAndUpdate({_id:args.id}, {$set:update}, {new:true})
            }
        },
        deleteUser:{
            type:UserType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return userModel.findByIdAndDelete({_id:args.id})
            }
        },
        addTasks:{
            type:AddTaskType,
            args:{
                name:{type: new GraphQLNonNull(GraphQLString)},
                user:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                const newTask = new taskModel({
                    name:args.name,
                    user:args.user
                })
                return newTask.save();
            }
        },
        editTask:{
            type:TaskType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let update = {"name":args.name}
                return taskModel.findByIdAndUpdate({"_id":args.id}, {$set:update}, {new:true})
            }
        },
        deleteTask:{
            type:TaskType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                return taskModel.findByIdAndDelete({_id:args.id})
            }
        },

        
    }
})

const schema = new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})
module.exports=schema;