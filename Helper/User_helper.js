const db = require('../config/connection');
const bcrypt = require('bcrypt');
const { response } = require('../app');
const { promise, reject } = require('bcrypt/promises');
const async = require('hbs/lib/async');
const objectId = require('mongodb').ObjectId


module.exports={
    doSignUp:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            userdata.password=await bcrypt.hash(userdata.password,10)
            db.get().collection('SignUpData').insertOne(userdata).then((response)=>{
                resolve(response.insertedId)
            }).catch((error)=>{
                reject({data:"Email already exist"})
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus = false
            let response={}
            let user = await db.get().collection('SignUpData').findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("login successfull");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login Failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login Failed")
                resolve({status:false})
            }
        })
    },
    getAllData:()=>{
        return new Promise(async(resolve,reject)=>{
            let datas =await db.get().collection('SignUpData').find().toArray()
            resolve(datas)
        })
    },
    deleteData:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('SignUpData').deleteOne({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getAllDataUpdate:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('SignUpData').findOne({_id:objectId(proId)}).then((values)=>{
                resolve(values)
            })
        })
    },
    UpdateDetails:(proId,proDetails)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection('SignUpData').updateOne({_id:objectId(proId)},{
                    $set:{
                        fname:proDetails.fname,
                        email:proDetails.email
                    }
                }).then((response)=>{
                    resolve()
                })
            })
    }
}