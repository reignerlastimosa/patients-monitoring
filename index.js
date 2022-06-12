const express = require('express');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 8080;


database.connect((err)=>{
    if(!err){
        console.log("Connected to mysql database at port 3306");
    }
    else{
        console.log("failed to conenct at mysql...")
    }
});

app.use(express.json());

app.use(express.urlencoded());

app.use(express.static('public'));


app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs');

app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/create', (req,res)=>{
    res.render('create');
});

app.get('/home', (req,res)=>{
    let sql = "SELECT * FROM patients";

    database.query(sql,(err,result)=>{
        if(!err){
           
            res.render('index', {patients: result});
            
           }
        
        else{
            throw err;
        }
    });
   
   
});

app.get('/add', (req,res)=>{
    res.render('add');
});

app.get('/edit', (req,res)=>{
    res.render('edit');
});


app.get('/delete', (req,res)=>{
    let sql = "SELECT * FROM patients";

    database.query(sql,(err,result)=>{
        if(!err){
           
            res.render('delete', {patients: result});
            
           }
        
        else{
            throw err;
        }
    });
});



app.get("/create-patients-db",(req,res)=>{
    let sql = "CREATE DATABASE hospital";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfulyl created the hospital database");
        }
        else{
            res.send("failed to create hospital database");
        }
    });
});


app.get("/create-patients-table",(req,res)=>{
    let sql = "CREATE TABLE patients(id int AUTO_INCREMENT, firstname varchar(50), lastname varchar(50), occupation varchar(50), address varchar(50), sex varchar(10), age varchar(10), PRIMARY KEY(id))";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfulyl created  patients table");
        }
        else{
            res.send("failed to create patients table");
        }
    });
});

app.get("/create-account",(req,res)=>{
    let sql="CREATE TABLE account(id int AUTO_INCREMENT, username varchar(50), password varchar(50), PRIMARY KEY (id))";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully created account table");
        }
        else{
            res.send("failed to create account table");
        }
    });
});

app.get("/delete-patients-table", (req,res)=>{
    let sql = "DROP TABLE patients";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send("successfully deleted enrollment table");
        }
        else{
            res.send("failed to delete enrollment table"); 
        }
    });
});


app.post('/add',(req,res)=>{
    
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var occupation = req.body.occupation;
    var address = req.body.address;
    var sex = req.body.sex;
    var age = req.body.age;


    var sql = `INSERT INTO patients (firstname, lastname, occupation, address, sex, age) VALUES ("${firstname}", "${lastname}", "${occupation}","${address}", "${sex}", "${age}")`;
    database.query(sql,(err,result)=>{
        if (!err){
            console.log("successfully inserted new record");
            res.redirect('/add');
        }
        else{
            throw err;
        }
    });
  
  
});


app.post('/create',(req,res)=>{
    var create_username = req.body.create_username;
    var create_password = req.body.create_password;
    var confirm_password = req.body.confirm_password;

    if(create_password == confirm_password){
        var sql = `INSERT INTO account (username, password) VALUES ("${create_username}","${create_password}")`;
        database.query(sql,(err,result)=>{
            if(!err){
                console.log("successfully inserted new account");
                res.redirect("/login");
            }
            else{
                console.log("failed to create new account");
            }
        });
    }
    else{
        res.send("password does not match");
    }

});

app.get('/search_account',(req,res)=>{
    let sql = "SELECT * FROM account";
    database.query(sql,(err,result)=>{
        if(!err){
            res.send(result);
        }
        else{
            throw err;
        }
    });
});


app.post('/login_account',(req,res)=>{
    
    var username = req.body.username;
    var password = req.body.password;

    var sql = "SELECT * FROM account";
    database.query(sql,(err,result)=>{
        if(!err){
            for(var i =0; i<result.length;i++){
                if(username == result[i].username && password == result[i].password){
                    console.log("success");
                    res.redirect("/home");
                }
                
            }
            

          
           
        }
        else{
            throw err;
        }
    });
    

   
});


app.listen(PORT, ()=>{
    console.log("Listening to port 8080...")
});