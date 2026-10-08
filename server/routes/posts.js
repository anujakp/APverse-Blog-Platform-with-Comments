import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import {auth} from "../middleware/auth.js";
const r=express.Router();
r.get("/",async(req,res)=>{
 try{
  const {search="",category=""}=req.query,q={};
  if(search)q.$or=[{title:{$regex:search,$options:"i"}},{content:{$regex:search,$options:"i"}},{excerpt:{$regex:search,$options:"i"}}];
  if(category&&category!=="All")q.category=category;
  res.json(await Post.find(q).populate("author","name email").sort({createdAt:-1}));
 }catch{res.status(500).json({message:"Unable to load posts"})}
});
r.get("/:id",async(req,res)=>{
 try{
  const post=await Post.findById(req.params.id).populate("author","name email");
  if(!post)return res.status(404).json({message:"Post not found"});
  const comments=await Comment.find({post:post._id}).populate("author","name").sort({createdAt:-1});
  res.json({post,comments});
 }catch{res.status(400).json({message:"Invalid post ID"})}
});
r.post("/",auth,async(req,res)=>{
 try{
  const {title,excerpt,content,category}=req.body;
  if(!title?.trim()||!content?.trim())return res.status(400).json({message:"Title and content are required"});
  const p=await Post.create({title:title.trim(),excerpt:excerpt?.trim()||"",content:content.trim(),category:category?.trim()||"General",author:req.user._id});
  await p.populate("author","name email");res.status(201).json(p);
 }catch{res.status(400).json({message:"Unable to create post"})}
});
r.put("/:id",auth,async(req,res)=>{
 try{
  const p=await Post.findOne({_id:req.params.id,author:req.user._id});
  if(!p)return res.status(404).json({message:"Post not found or not owned by you"});
  ["title","excerpt","content","category"].forEach(k=>{if(req.body[k]!==undefined)p[k]=req.body[k]});
  await p.save();await p.populate("author","name email");res.json(p);
 }catch{res.status(400).json({message:"Unable to update post"})}
});
r.delete("/:id",auth,async(req,res)=>{
 try{
  const p=await Post.findOneAndDelete({_id:req.params.id,author:req.user._id});
  if(!p)return res.status(404).json({message:"Post not found or not owned by you"});
  await Comment.deleteMany({post:p._id});res.json({message:"Post deleted"});
 }catch{res.status(400).json({message:"Unable to delete post"})}
});
export default r;
