import mongoose from 'mongoose';

 export const connetDB=async() =>{
 await   mongoose.connect(`${process.env.MONGO_URI}/prescripto`)
 console.log('db is connected');
 


}