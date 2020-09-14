import mongoose from 'mongoose'
import {user,notification,article} from '../Schema.js'
import jwt from 'jsonwebtoken'
import bcryt from 'bcrypt'

const userDB=mongoose.model('pratilipi_user',user)
const notificationDB=mongoose.model('pratilipi_noti',notification)
const articleDB=mongoose.model('pratilipi_article',article)

export const register=(req,res)=>{
	req.body.password=bcryt.hashSync(req.body.password,10)
	let data=new userDB(req.body)
	data.save((err,suc)=>{
		if(err)
			res.send('error')
		else{
			jwt.sign({email:req.body.email},'sitesitemangalbhavan',(err,token)=>{
				if(err)
					res.send('error')
				else
					res.send({'token':token})
			})
		}
	})

}
export const login=(req,res)=>{
	userDB.find({email:req.body.email},(err,info)=>{
		if(err) res.send('error')
		else{
			if(info.length===0){
				res.send('No User Found')
			}
			else {
				if(bcryt.hashSync(req.body.password,info[0].password)){
					jwt.sign({email:req.body.email},'sitesitemangalbhavan',(err,token)=>{
						res.send({'token':token})	
					})
				}
				else 
					res.send('error')	
				
			}
		}
	})
}
export const addStory=(req,res)=>{
//	console.log(req.body)
//	console.log(req.headers.authorization)
	jwt.verify(req.headers.authorization,'sitesitemangalbhavan',(err,decode)=>{
		if(err)	res.send('error')
		else{
			let ob=req.body
			ob.userEmail=decode.email
			ob.totalPeopleReadIds=[]
			let art=new articleDB(ob)
			art.save((err,suc)=>{
				if(err) res.send('error')
				else
					res.send(suc)
			})
		}
	})
}

export const getEmail=(req,res,next)=>{
	jwt.verify(req.headers.authorization,'sitesitemangalbhavan',(err,decode)=>{
		if(err)
			return null
		else{
			req.params.email=decode.email
			next()
		}	
	})
}

export const getStory=(req,res)=>{
	articleDB.find({_id:req.body.id},(err,data)=>{
		if(err) res.send('error')
		else{
			let found=false
			data[0].totalPeopleReadIds.map((v)=>{ 
							if(v===req.params.email)
								found=true 
				}
			)
			if(found===false)
			{
				let arr=data[0].totalPeopleReadIds
				arr.push(req.params.email)
				data[0].totalPeopleReadIds=arr
			}	
		//	console.log(data[0])
			articleDB.findOneAndUpdate({_id:req.body.id},data[0],(err,suc)=>{
				if(err) res.send('error')
				else{
				//	console.log('sending response',data[0])
					res.send(data[0])
				}
			})
		}
	})

}

export const listStory=(req,res)=>{
	articleDB.find({},(err,suc)=>{
		if(err) res.send('error')
		else{
			res.send(suc)
		}
	})
}


export const socketFunctions=(io)=>{
	io.on("connection", socket => {
		socket.on('imin',(id,token)=>{
			jwt.verify(token,'sitesitemangalbhavan',(err,decode)=>{
				if(err){
					socket.emit('errorOccured')
				}
				else{
			notificationDB.find({name:'atiksh'},(err,res)=>{
									let arr=res[0].data
									arr.push({"token":decode.email,"id":id})
									res[0].data=arr
									notificationDB.findOneAndUpdate({'name':'atiksh'},res[0],(err,final)=>{
										if(err){
											//console.log('err',err)
										}
										else
										{
											//console.log("HERE inside emitted")
											io.sockets.emit('notification',arr)
										}
									})
								})
			}
		})
		})

		socket.on('exit',(val,id)=>{
			jwt.verify(val,'sitesitemangalbhavan',(err,decode)=>{
				if(err) socket.emit('errorOccured')
				else{
					let email=decode.email
					notificationDB.find({name:'atiksh'},(err,res)=>{
						if(err)	socket.emit('errorOccured')
						else{
							let arr=res[0].data
							arr=arr.filter((v)=> v.token!==email || v.id!==id)
							res[0].data=arr
							notificationDB.findOneAndUpdate({'name':'atiksh'},res[0],(err,final)=>{
								if(err)console.log('err',err)
								else
								{	//console.log('exit res',res[0])
									//console.log('exit arr',arr)
									//console.log('exit final')
									io.sockets.emit('notification',res[0].data)
								}
							})
						}
					})
				}
			})
		})
	})

}



//Just to add an obejct with name-> "Atiksh " in the notfication DB runs only one time

// function a(){
// 	let ob={
// 		name:'atiksh',
// 		data:[]
// 	}
// 	let data= new notificationDB(ob)
// 	data.save((err,res)=>{
// 		console.log(res)
// 	})
// }