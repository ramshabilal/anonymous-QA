import './config.mjs';
import mongoose from 'mongoose'

console.log(process.env.DSN)

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [String]
})

console.log('connecting to database', process.env.DSN)
let DSN = 'mongodb+srv://ramshabilal:RsRRPoY9gZCVNjhi@cluster0.siam2zv.mongodb.net/hw06?retryWrites=true&w=majority';
//mongoose.connect(process.env.DSN)
mongoose.connect(DSN); 

const Question = mongoose.model("Questions", QuestionSchema)
export default Question
