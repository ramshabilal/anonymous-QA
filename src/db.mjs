import './config.mjs';
import mongoose from 'mongoose'

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [String]
})

// mongoose.connect(process.env.DSN) 
mongoose.connect("mongodb+srv://ramshabilal:RsRRPoY9gZCVNjhi@cluster0.siam2zv.mongodb.net/hw06?retryWrites=true&w=majority&appName=Cluster0")

const Question = mongoose.model("Questions", QuestionSchema)
export default Question
