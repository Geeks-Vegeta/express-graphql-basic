const express = require('express');

const {graphqlHTTP} = require('express-graphql');

const app=express();

const dotenv = require("dotenv");

const schema = require("./schema/schema");

dotenv.config();

require('./models/connection');
app.use("/graphql", graphqlHTTP({
    schema:schema,
    graphiql:true
}));


const PORT =5000 || process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`running on localhost:5000`)
})