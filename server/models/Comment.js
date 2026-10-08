import mongoose from "mongoose";
const schema=new mongoose.Schema({text:{type:String,required:true,trim:true,maxlength:500},post:{type:mongoose.Schema.Types.ObjectId,ref:"Post",required:true},author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}},{timestamps:true});
export default mongoose.model("Comment",schema);
