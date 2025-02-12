import mongoose, { mongo } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: String,
    default: false, //by default tasks are not completed
  },
  createdAt: {
    type: Date,
    default: Date.now, //stores time stamp when task is created
  },
});

const taskModel = mongoose.model("Task", taskSchema); // Task is the name of the MongoDB collection that Mongoose will create.
export default taskModel;
