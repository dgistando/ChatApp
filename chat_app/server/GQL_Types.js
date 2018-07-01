const {
    GraphQLObjectType,
    GraphQLList,

    GraphQLString,
    GraphQLInt,
    GraphQLFloat, //might use for hash instead of int.(longer range)
    GraphQLNonNull
} = require('graphql/type')

UsersType = new GraphQLObjectType({
    name:'user',
    fields : function (){
        return {
            name : {
                type : GraphQLString
            }, 
            handle : {
                type : GraphQLNonNull(GraphQLString)
            }, 
            id : {
                type : GraphQLNonNull(GraphQLInt)
            }, 
            dateJoined : {
                type : GraphQLFloat
            },
            myChats : {
                type : GraphQLList(GraphQLFloat)
            }
        }
    }
})

ChatType = new GraphQLObjectType({
    name:'chat',
    fields : function (){
        return {
            name : {
                type: GraphQLString
            },
            img : {
                type: GraphQLString
            },
            dateCreated : {
                type: GraphQLFloat
            },
            lastActive : {
                type: GraphQLFloat
            },
            hash : {
                type: GraphQLString
            },
        }
    }
})

MessagType = new GraphQLObjectType({
    name:'message',
    fields : function (){
        return {
            /*_id : {
                type: GraphQLString
            },*/
            content : {
                type: GraphQLString
            },
            userName : {
                type: GraphQLString //made of handle + id
            },
            time : {
                type: GraphQLString
            },
            chatHash : {
                type: GraphQLString
            },
        }
    }
})

module.exports = {
    UsersType,
    ChatType,
    MessagType
}