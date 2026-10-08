import mongoose from "mongoose";
const schema=new mongoose.Schema({title:{type:String,required:true,trim:true},excerpt:{type:String,default:""},content:{type:String,required:true},category:{type:String,default:"General"},author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}},{timestamps:true});
export default mongoose.model("Post",schema);
