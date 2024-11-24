var express=require("express");
var fileuploader=require("express-fileupload");
var mysql2=require("mysql2");
var cloudinary=require("cloudinary").v2;
var app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(2003,function(){
    console.log("server started");
})

app.use(express.static("public"));
app.use(fileuploader());

// Configuration
cloudinary.config({ 
    cloud_name: 'dvuwwpqqo', 
    api_key: '651214518232877', 
    api_secret: '6HrD7tpIpo1kX0EZBHuufF8bK-4' // Click 'View API Keys' above to copy your API secret
});

let config="mysql://avnadmin:AVNS_oBHi7NS0G3bMEIuUX99@mysql-2c594c88-arshb6564.k.aivencloud.com:26690/defaultdb"//webserver? database? userid? password

let mysqlserver=mysql2.createConnection(config);
mysqlserver.connect(function(err){
    if(err==null){
        console.log("connected to  aiven server successfully");
    }
    else{
        console.log(err.message);
    }
})
//---singup----//
app.get("/adduser",function(req,resp){
    let email=req.query.txtMail;
    let pwd=req.query.txtPwd;
    let type=req.query.utype;
    const defaultStatus = 1;
  

    mysqlserver.query("INSERT INTO users (email, password, utype, dos, status) VALUES (?, ?, ?, CURDATE(),?)", [email, pwd, type, defaultStatus ], function(err){
        if(err==null){
            resp.send("Record saved successfully");
        }else{
            resp.send(err.message);
        }
    })
})
// login ------//
app.get("/checkuser",function(req,resp){
    let email=req.query.txtEMail;
    let pwd=req.query.txtPassword;
    
    mysqlserver.query("select * from  users where email = ?", [email], function(err,jsonArray){
        if(err!==null){
            resp.send(err.message)   
        }
        else if(jsonArray.length>0){

            let storedpass=jsonArray[0].password;
            let storedutype=jsonArray[0].utype;

            if(pwd === storedpass){
                resp.send(storedutype);
            }
            else{
                resp.send("Please check your  password");
            }
        }
        else{
            resp.send("Please check your email");
        }
    })
})
// save details --------//
app.post("/save", async function(req,resp){
    console.log(req.body);
    try {
        let filename="";
        if(req.files==null){
            filename="nopic.jpg";
        }else{
            filename=req.files.pic.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.pic.mv(path);
    
            // save your file on cloudnairy server
            await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
            });
        }
        req.body.pic=filename;
            // it is new onject which is created in which ALL files are stored
        //resp.send("U are Signedup with Id="+req.body.txtMail);
        //---------
        mysqlserver.query(
            "insert into organization values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.txtmail, req.body.txtorganization, req.body.txtmobilenumber, req.body.txtaddress, req.body.txtcity,req.body.txtstate,req.body.txtzip,req.body.txtid,filename,req.body.txtsports.toString(),req.body.txtprevioustournament,req.body.txtwebsite,req.body.txtinstagram],
            function (err) {
                if (err == null) {
                    resp.send("Record saved successfully");
                } else {
                    resp.send(err.message);
                }
            }
        );
    }catch (error) {
        console.error("Error occurred:", error);
        resp.status(500).send("An error occurred during signup.");
    }
    
})
//save  data for player.........//
app.post("/save-player", async function(req,resp){
    try {
        let filename="";
        if(req.files==null){
            filename="nopic.jpg";
        }else{
            filename=req.files.profilepic.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.profilepic.mv(path);
    
            // save your file on cloudnairy server
            await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
            });
        }
        req.body.profilepic=filename;
            // it is new onject which is created in which ALL files are stored
        //resp.send("U are Signedup with Id="+req.body.txtMail);
        //---------
        mysqlserver.query(
            "insert into players values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.txtMail, req.body.txtname, req.body.txtgames, req.body.txtmobile, req.body.txtdob,req.body.txtgender,req.body.txtAdress,req.body.txtCity,req.body.txtState,req.body.txtZip,req.body.txtId,filename,req.body.txtotherinfo],
            function (err) {
                if (err == null) {
                    resp.send("Record saved successfully");
                } else {
                    resp.send(err.message);
                }
            }
        );
    }catch (error) {
        console.error("Error occurred:", error);
        resp.status(500).send("An error occurred during signup.");
    }
    
})
//--update player---//
app.post("/update-player", async function(req,resp){
    try {
        let filename="";
        if(req.files==null){
            filename="nopic.jpg";
        }else{
            filename=req.files.profilepic.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.profilepic.mv(path);
    
            // save your file on cloudnairy server
            await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
            });
        }
        req.body.profilepic=filename;
            // it is new onject which is created in which ALL files are stored
        //resp.send("U are Signedup with Id="+req.body.txtMail);
        //---------
        mysqlserver.query("update players set name=?,games=?,mobile=?,dob=?,gender=?,adress=?,city=?,state=?,zip=?,proof=?,ppic=?,otherinfo=? where email=?",
            [req.body.txtname, req.body.txtgames, req.body.txtmobile, req.body.txtdob,req.body.txtgender,req.body.txtAdress,req.body.txtCity,req.body.txtState,req.body.txtZip,req.body.txtId,filename,req.body.txtotherinfo,req.body.txtMail],
            function (err) {
                if (err == null) {
                    resp.send("Record updated  successfully");
                } else {
                    resp.send(err.message);
                }
            });
    }catch (error) {
        console.error("Error occurred:", error);
        resp.status(500).send("An error occurred during signup.");
    }
    
})



 
//---update organiser ---//
app.post("/update", async function(req,resp){
    try {
        let filename="";
        if(req.files==null){
            filename="nopic.jpg";
        }else{
            filename=req.files.pic.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.pic.mv(path);
    
            // save your file on cloudnairy server
            await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
            });
        }
        req.body.pic=filename;
            // it is new onject which is created in which ALL files are stored
        //resp.send("U are Signedup with Id="+req.body.txtMail);
        //---------
        mysqlserver.query("update organization set organizations=?,contact=?,address=?,city=?,state=?,zip=?,proof=?,ppic=?,sports=?,prevtournament=?,website=?,insta=? where email=?",
            [req.body.txtorganization, req.body.txtmobilenumber, req.body.txtaddress, req.body.txtcity,req.body.txtstate,req.body.txtzip,req.body.txtid,filename,req.body.txtsports.toString(),req.body.txtprevioustournament,req.body.txtwebsite,req.body.txtinstagram,req.body.txtmail],
            function (err) {
                if (err == null) {
                    resp.send("Record updated  successfully");
                } else {
                    resp.send(err.message);
                }
            });
    }catch (error) {
        console.error("Error occurred:", error);
        resp.status(500).send("An error occurred during signup.");
    }
    
})

//-search user//

app.get("/fetch-user",function(req,resp){
    let email=req.query.txtmail;
    mysqlserver.query("select * from organization where email=?",[email],function(err,jsonArray){
        if(err){
            resp.send(err.message);
        }else{
            resp.send(jsonArray);
        }
    })

})

//----save data for  publishing tournament------
app.post("/savedata", async function(req,resp){
    try {
        let filename="";
        if(req.files==null){
            filename="nopic.jpg";
        }else{
            filename=req.files.txtposter.name;
            let path=__dirname+"/public/uploads/"+filename;
            console.log(path);
            req.files.txtposter.mv(path);
    
            // save your file on cloudnairy server
            await cloudinary.uploader.upload(path).then(function(result){
                filename=result.url;
            });
        }
        req.body.txtposter=filename;
            // it is new onject which is created in which ALL files are stored
        //resp.send("U are Signedup with Id="+req.body.txtMail);
        //---------
        mysqlserver.query(
            "insert into tournaments values(?,?,?,?,?,?,?,?,?,?,?,?)",
            [null,req.body.txtMail,req.body.txtContact,req.body.txtgame, req.body.txttitle, req.body.txtfees, req.body.txtdate,req.body.txtcity,req.body.txtlocation,req.body.txtprizes,req.body.txtinfo,filename],
            function (err) {
                if (err == null) {
                    resp.send("Record saved successfully");
                } else {
                    resp.send(err.message);
                }
            }
        );
    }catch (error) {
        console.error("Error occurred:", error);
        resp.status(500).send("An error occurred during signup.");
    }
})   

//--------To send ajax req using angular and to get detials of all tournaments that we saved-----//
app.get("/fetch-all-users",function(req,resp)
{
    let city=req.query.city;
    let game=req.query.game;
    mysqlserver.query("select * from tournaments where city=? and game=?",[city,game],function(err,jsonArray)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       
                resp.send(jsonArray);
           
    })

})
//----to fetch diff cities in combo box in tournament finder.html-------

app.get("/fetch-all-cities",function(req,resp)
{
    
    mysqlserver.query("select distinct city from tournaments",function(err,jsonArrayC)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       
                resp.send(jsonArrayC);
           
    })

})
//---to fill detail of different games in combo box in tournament finder.html----- 
app.get("/fetch-all-games",function(req,resp)
{
    
    mysqlserver.query("select distinct game from tournaments",function(err,jsonArrayG)
    {
        
        if(err!=null)
        {
            resp.send(err.message);
        }
        else
       
                resp.send(jsonArrayG);
           
    })

})

//---setting--
app.get("/Update-Password",function(req,resp)
{   
    email=req.query.x;
    newpass=req.query.y;
    currpass=req.query.z;
    
    mysqlserver.query("update users set password=? where email=? and password=?",[newpass,email,currpass],function(err,result)
    {
        if(err!=null)
        {
            resp.send(err.message);
        }
        else if(result.affectedRows==1){
            resp.send("Updated Successfully");
        }
        else 
        {
          resp.send("invalid credentials");

        }
           
    })

})

app.get("/", function(req,resp){
    let path=__dirname+"public/index.html/";
    resp.sendFile(path);
})
