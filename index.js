require("dotenv").config(); // storing the information about the database in the .env file
const express=require('express');
const mysql=require('mysql');
const exphbs=require('express-handlebars');
const path=require('path');

const app=express();

app.use(express.static('public'));  // path of css folder


const port=process.env.PORT || 3000; 

//Handlebar creation
const hbs=exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname,'views/mainLayout')
});

app.engine('handlebars',hbs.engine);   
app.set('view engine','handlebars');


//Creating a connection of database.
var connection=mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    passsword: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//Checking database is connected or not.
connection.connect((err) => {
    if(err){
        console.log('Could not connected to database');
    }
    else {
        console.log('Connected to database...');
    }
});


app.get('/',(req,res)=>{
    res.render('index');
   
})

//Api for suggestion city
app.get('/suggestions',(req,res)=>{
   
    var q=req.query["term"];
   
    connection.query(`select name,lat,longi from geoname where name like '${q}%' ORDER BY name DESC`,(error,result,fields)=>{
        if(error){
                res.send(error.message);
            }
        if(result.length==0){
                res.json({suggestion:[]});
            }
        else{
                res.json({suggestion:result});
            }
        });
    });
    
app.listen(port,()=>{console.log(`server is running at ${port} port...`)});