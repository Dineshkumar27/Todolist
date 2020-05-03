const express=require("express");
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const date=require(__dirname+"/date.js")
 
const app=express();
let ejs = require('ejs')
let workItems=[];
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))
mongoose.connect("mongodb://localhost:27017/todoListDB",{ useNewUrlParser: true })

const Itemschema={
    name : String
}

const Item=mongoose.model("Item",Itemschema);
const Item1=new Item({
    name:"Eating"
})
const Item2=new Item({
    name:"Sleeping"
})
const Item3=new Item({
    name:"Drinking"
})

const documents=[Item1,Item2,Item3];



app.set("view engine",'ejs');
app.get("/",function(req,res){


  
   Item.find({},function(err,foundItems){
       if(foundItems.length===0){
        Item.insertMany(documents,function(err){
            if(err){
                console.log("Error in inserting the data");
                }
            else{
                console.log("Inserted successfully");
                
            }
        });
        res.redirect("/")
       }
    res.render("list",{listTitle:"Today",newListItem:foundItems})
      
   })

   
})

app.post("/",function(request,response){
    const newitem=request.body.newItem;
    const item=new Item({
        name: newitem
    })
    item.save();
    
    //items.push(item)
   response.redirect("/");// this will direct to app.get("/")
})

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkboxvalue;
    Item.findByIdAndRemove(checkedItemId,function(err){
        console.log("The Checked Item has been successfully deleted");
        
    })
    res.redirect("/")
    
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