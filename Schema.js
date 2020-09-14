import mongoose from 'mongoose'


export const user=mongoose.Schema({     // To store user information
	email:String,
	password:String,
	articles:[String]
})

export const notification=mongoose.Schema({    // A utility DB schema for real time feature of Number of current Viewing users
	name:String,
	data:[Object]
})

export const article=mongoose.Schema({		// Story Schema
	title:String,
	data:String,
	coverImage:String,
	totalPeopleReadIds:[String],
	totalUniqueCount:{type:Number,default:0},
	userEmail:String
})
