const express=require("express");
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const _ = require("lodash")
const date=require(__dirname+"/date.js")

 
const app=express();
let ejs = require('ejs')
let workItems=[];
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static("public"))
mongoose.connect("mongodb+srv://admin-dinesh:dinesh1342@cluster0-m0bhk.mongodb.net/todoListDB",{ useNewUrlParser: true })

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

const ListSchema={
    customName:String,
    items: [Itemschema]
}

const List=mongoose.model("List",ListSchema)


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
    const listTitle=request.body.list
    const item=new Item({
        name: newitem
    })
    if(listTitle==="Today"){
   
        item.save();
        response.redirect("/");// this will direct to app.get("/")

    }
    else{
    
        List.findOne({ customName:listTitle}, function(err,foundList){
            foundList.items.push(item);
            foundList.save()
            response.redirect("/"+listTitle)
            //console.log(foundList);
            
        })
    }
  
})

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkboxvalue;
    const listName=req.body.listName;
    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId,function(err){
            console.log("The Checked Item has been successfully deleted");
            
        })
        res.redirect("/");// this will direct to app.get("/")

    }else{
        List.findOneAndUpdate({customName:listName},{$pull:{items:{_id:checkedItemId}}},function(err){
            if(!err){
                res.redirect("/"+listName)
            }
        });
    }
   
    
})

//creating custom list

app.get("/:customListName",function(req,res){
const customListName=_.capitalize(req.params.customListName)

List.findOne({customName:customListName},function(err,foundList){
    if(!err){
        if(!foundList){
            const list=new List({
                customName:customListName,
                items: documents
            })
            list.save();
            res.redirect("/"+customListName)
        }
        else{
           // console.log("Exist");
           res.render("list",{listTitle:foundList.customName,newListItem:foundList.items})
        }
    }
})
    

    
})

app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItem:workItems})
})
app.post("/work",function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work")

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
app.listen(port,function(){
    console.log("Server started Successfully")
})