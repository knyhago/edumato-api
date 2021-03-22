const express=require('express');
const app=express();
const port=process.env.PORT || 9800;
const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const mongourl="mongodb+srv://knyhago:kenny@cluster0.2kzve.mongodb.net/edumato?retryWrites=true&w=majority";
let db;
const cors=require('cors');
const bodyparser=require('body-parser');
let limit=100;

/*app.use(cors);
app.use()*/
//health check
app.get('/',(req,res)=>{
    res.send(`Health ok`)
})

//city route
app.get('/city',(req,res)=>{
    let sortcondition={city_name:1}
    if(req.query.sort){
        sortcondition={city_name:Number(req.query.sort)}
    }
    else if(req.query.limit){ 
        
      limit=Number(req.query.limit)
    }
    db.collection('city').find().sort(sortcondition).limit(limit).toArray((err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

//restaurant route

app.get('/restaurant',(req,res)=>{
    var sortcondition={"name":1}
    if(req.query.sort){
        sortcondition={"name":Number(req.query.sort)}
    }
    else if(req.query.limit){
        limit=Number(req.query.limit)
    }
    else if(req.query.sort && req.query.limit)
    {
        
        sortcondition={"name":Number(req.query.sort)};
        limit=Number(req.query.limit)


    }
    var condition={};
    if(req.query.cuisine && req.query.mealtype){
        condition={$and:[{"Cuisine.cuisine":req.query.cuisine,"type.mealtype":req.query.mealtype}]}}

        //cost 
        else if(req.query.mealtype && req.query.lcost && req.query.hcost){
            condition={$and:[{"type.mealtype":req.query.mealtype,cost:{$lt:Number(req.query.hcost),$gt:Number(req.query.lcost)}
        }]}
    
    }
    else if(req.query.city && req.query.cuisine){
        condition={$and:[{"city":req.query.city,"Cuisine.cuisine":req.query.cuisine}]}}
    else if(req.query.cuisine){
        condition={"Cuisine.cuisine":req.query.cuisine}
    }
    else if(req.query.mealtype){
        condition={"type.mealtype":req.query.mealtype}
}
    else if(req.query.city){
        condition={city:req.query.city}
    }
    
    db.collection('restaurent').find(condition).sort(sortcondition).limit(limit).toArray((err,result)=>{
if (err) throw err
res.send(result)
    
    })
})
//mealtype route
app.get('/mealtype',(req,res)=>{
    db.collection('mealType').find().toArray((err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

//cuisine route
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find().toArray((err,result)=>{
        if (err) throw err
        res.send(result)
    })
})

//


MongoClient.connect(mongourl,(err,connection)=>{
    if (err) console.log(err);
    db=connection.db('edumato');
  
    app.listen(port,(err)=>{
      if (err) throw err
      console.log(`server is running in ${port}`)
  })
  
  })
  

  
  