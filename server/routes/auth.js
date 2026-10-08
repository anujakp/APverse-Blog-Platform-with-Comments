import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {auth} from "../middleware/auth.js";
const r=express.Router();
const token=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"});
r.post("/register",async(req,res)=>{
 try{
  const {name,email,password}=req.body;
  if(!name||!email||!password)return res.status(400).json({message:"All fields are required"});
  if(password.length<6)return res.status(400).json({message:"Password must be at least 6 characters"});
  const e=email.toLowerCase().trim();
  if(await User.findOne({email:e}))return res.status(409).json({message:"Email already registered"});
  const u=await User.create({name:name.trim(),email:e,password:await bcrypt.hash(password,12)});
  res.status(201).json({token:token(u._id),user:{id:u._id,name:u.name,email:u.email}});
 }catch{res.status(500).json({message:"Unable to register"})}
});
r.post("/login",async(req,res)=>{
 try{
  const u=await User.findOne({email:req.body.email?.toLowerCase().trim()});
  if(!u||!(await bcrypt.compare(req.body.password||"",u.password)))return res.status(401).json({message:"Invalid email or password"});
  res.json({token:token(u._id),user:{id:u._id,name:u.name,email:u.email}});
 }catch{res.status(500).json({message:"Unable to login"})}
});
r.get("/me",auth,(req,res)=>res.json(req.user));
export default r;
