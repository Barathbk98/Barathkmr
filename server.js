const express = require('express');
const Pool = require('pg').Pool
const cors = require('cors')
const app = express();
const port = 5000;

const pool = new Pool({
    user: 'bk',
    host: 'localhost',
    database: 'oauth',
    password: 'bk191998',
    port: 5432
})

const Success = function(success){                             //prototype design pattern
    this.success = success;
}

Success.prototype.code = 200;
const done = new Success(true);
const not = new Success(false)

var Exposer = (function() {                                      //module design pattern
    var privateVariable = 10;
  
    var methodToExpose = function() {
        if(data.rowCount>0){
            res.json({success : done,code:done.code,email,name,imageUrl})
        } else {
            pool.query(`INSERT INTO users (username,name,googleid,imageurl) VALUES ('${email}','${name}','${googleId}','${imageUrl}')`)
            .then(()=>{
                res.json({success : done,code:done.code,email,name,imageUrl})
            })
            .catch((err)=>{
                console.log(err);
                res.json({success : not,code:done.code,err})
            })
        }
    }
  
    return {
        first: methodToExpose,
    };
  })();                                                                     //IIFE



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());



app.post("/signupgoogle",(req,res)=>{
    const {email,name,googleId,imageUrl} = req.body.data
    pool.query(`SELECT * FROM users WHERE username = '${email}' AND googleid='${googleId}'`)
    .then((data)=>{
       Exposer.first();
    }).catch((err)=>{
        console.log(err);
        res.json({success:false,err})
    }) 
})

app.post("/signupfacebook",(req,res)=>{
    const {email,name} = req.body.data;
    const imageUrl = req.body.data.picture.data.url;
    const googleid = req.body.data.userId;
    pool.query(`SELECT * FROM users WHERE username = '${email}' AND googleid='${googleid}'`)
    .then((data)=>{
        if(data.rowCount>0){
            res.json({success : true,email,name,imageUrl})
        } else {
            pool.query(`INSERT INTO users (username,name,googleid,imageurl) VALUES ('${email}','${name}','${googleid}','${imageUrl}')`)
            .then(()=>{
                res.json({email,name,imageUrl,success:true})
            })
            .catch((err)=>{
                console.log(err);
                res.json({success:false,err})
            })
        }
    }).catch((err)=>{
        console.log(err);
        res.json({success:false,err})
    }) 

})

var Subject = function() {                                  //observer design pattern
    let observers = [];
  
    return {
      subscribeObserver: function(observer) {
        observers.push(observer);
      },
      unsubscribeObserver: function(observer) {
        var index = observers.indexOf(observer);
        if(index > -1) {
          observers.splice(index, 1);
        }
      },
      notifyObserver: function(observer) {
        var index = observers.indexOf(observer);
        if(index > -1) {
          observers[index].notify(index);
        }
      },
      notifyAllObservers: function() {
        for(var i = 0; i < observers.length; i++){
          observers[i].notify(i);
        };
      }
    };
  };
  
  var Observer = function() {
    return {
      notify: function(index) {
        console.log("Observer " + index + " is notified!");
      }
    }
  }
  
  var subject = new Subject();
  
  var observer1 = new Observer();
  var observer2 = new Observer();
  
  subject.subscribeObserver(observer1);
  subject.subscribeObserver(observer2);
  
  subject.notifyObserver(observer2); // Observer 2 is notified!
  
  subject.notifyAllObservers();

app.listen(port,()=>{
    console.log("listening on port====>",port)
})

module.export = app;