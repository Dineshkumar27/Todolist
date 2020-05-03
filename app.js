const express=require("express");
const bodyparser=require("body-parser")
const date=require(__dirname+"/date.js")
 
const app=express();
let ejs = require('ejs')
let items=['Buy Food','Cook Food','Bake Food']
let workItems=[];
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))

app.set("view engine",'ejs');
app.get("/",function(req,res){
  
    let day=date.getDay();

    res.render("list",{listTitle:day,newListItem:items})
})

app.post("/",function(request,response){
    let item=request.body.newItem;
    if(request.body.list==='Work'){
        workItems.push(item)
        response.redirect('/work')
    }else{
        items.push(item);
        response.redirect('/')
    }
    
    //items.push(item)
   // response.redirect("/");
})


app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItem:workItems})
})
app.post("/work",function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work")

})
app.listen(3000,function(){
    console.log("Server started in the port 3000")
})