import express from "express";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import {auth} from "../middleware/auth.js";
const r=express.Router();
r.post("/posts/:id/comments",auth,async(req,res)=>{
 try{
  if(!req.body.text?.trim())return res.status(400).json({message:"Comment cannot be empty"});
  const p=await Post.findById(req.params.id);
  if(!p)return res.status(404).json({message:"Post not found"});
  const c=await Comment.create({text:req.body.text.trim(),post:p._id,author:req.user._id});
  await c.populate("author","name");res.status(201).json(c);
 }catch{res.status(400).json({message:"Unable to add comment"})}
});
r.delete("/comments/:id",auth,async(req,res)=>{
 try{
  const c=await Comment.findOneAndDelete({_id:req.params.id,author:req.user._id});
  if(!c)return res.status(404).json({message:"Comment not found or not owned by you"});
  res.json({message:"Comment deleted"});
 }catch{res.status(400).json({message:"Unable to delete comment"})}
});
export default r;
