import express from "express";
import connection from "../model/connection.js";
import taskModel from "../model/tasksModel.js";

const todoRoutes = express.Router();

todoRoutes.get("/", async (req, res) => {
  try {
    const tasks = await taskModel.find();
    /**
     * await bcz .find is a async operation , now tasks will contain array of objects. 
     * Below is the sample value how they will be defined and stored in DB.
     * [
     *   {
     *     "_id": "64a1c0dff29a3d001a5b3f2c",
     *     "title": "Complete the project",
     *     "completed": "false",
     *     "createdAt": "2024-02-11T10:15:00.000Z"
     *   
     *   },
     *   {
     *     "_id": "64a1c0e0f29a3d001a5b3f2d",
     *     "title": "Submit assignment",
     *     "completed": "true",
     *     "createdAt": "2024-02-10T09:30:00.000Z"
     *   }
     * ]

     */
    console.log("Tasks found: ", tasks);
    if (tasks.length === 0) {
      console.log("Tasks list is empty!!");
      return res.status(400).json({ message: "No tasks found!!" });
    }
    res.json(tasks);
    /**
     * res.json(tasks); sends the retrieved tasks as a JSON response to the client (browser or frontend).
     * The response status is 200 OK by default unless there's an error.
     * So when there is get request to (http://localhost:5000/tasks) then the it will send this data.
     * */
  } catch (err) {
    console.log("Error fetching task model!", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

todoRoutes.post("/", async (req, res) => {
  const { title, completed } = req.body; //collecting the content from request made by client (link this to frontend for post req)
  if (!title) return res.status(400).json({ message: "Title is required!" });

  try {
    const newTask = new taskModel({
      title,
      completed: completed !== undefined ? completed : false, //ensuring default value
    });
    /** above line creates a new instance of taskModel(MongoDB model)
     * It assigns title property from req body to newTask
     */
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.log("Error posting value", err);
    res.status(500).json({ message: err.message });
  }
});

const connectDB = async () => {
  try {
    await connection();
  } catch (err) {
    console.log("Error connecting to mongoDB server");
  }
};
connectDB();

export default todoRoutes;
