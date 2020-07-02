const mongoose = require ("mongoose");

const ActivitySchema = new mongoose.Schema({
name : {type : String , required: true}} ,
{ timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model("activity" , ActivitySchema);