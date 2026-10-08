import jwt from "jsonwebtoken";
import User from "../models/User.js";
export async function auth(req,res,next){
 try{
  const h=req.headers.authorization;
  if(!h?.startsWith("Bearer ")) return res.status(401).json({message:"Authentication required"});
  const d=jwt.verify(h.split(" ")[1],process.env.JWT_SECRET);
  const u=await User.findById(d.id).select("-password");
  if(!u) return res.status(401).json({message:"User not found"});
  req.user=u; next();
 }catch{res.status(401).json({message:"Invalid or expired token"})}
}
