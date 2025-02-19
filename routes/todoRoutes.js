import express from "express";
import connection from "../model/connection.js";
import taskModel from "../model/tasksModel.js";
import mongoose from "mongoose";
const todoRoutes = express.Router();

// Validate ID middleware
const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    /** checks for routes which are other then valid ObjectID */
    return res.status(400).json({ message: "Invalid Task ID" });
  }
  next(); //if the ObjectID passed is valid it'll trigger next middleware moves to intended handler where validateObjectId method is defined like get by id, delete by ID or put by ID routes.
};

/** get all tasks */
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

/** create a new task */
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

/** get a single task by ID */
todoRoutes.get("/:id", validateObjectId, async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found!!" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**Update a task (mark as completed) */
todoRoutes.put("/:id", validateObjectId, async (req, res) => {
  try {
    const updatedTask = await taskModel.findByIdAndUpdate(
      /**
       * taskModel.findByIdAndUpdate(id, update, options) - function args for findByIdAndUpdate
       * taskModel.findByIdAndUpdate(...) → This function finds a task by its ID and updates it in MongoDB.
       * req.params.id → Extracts the id from the URL (e.g., if the request is to /tasks/123,
       * req.params.id will be "123").
       * { completed: req.body.completed } → Updates the completed field of the task with the
       * value sent in the request body. In MongoDB, updates are performed using an object,
       * where the keys represent fields and values represent new values to be set.
       * { new: true } → Ensures that the function returns the updated document instead of the old one.
       *
       * other common properties:
       * { upsert: true }  // Creates the document if it doesn’t exist
       * { runValidators: true }  // Runs Mongoose validation rules
       */
      req.params.id,
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found!!" });

    res.json(updatedTask);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/** Deleting a task by ID */
todoRoutes.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const deletedTask = await taskModel.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res
        .status(404)
        .json({ message: "Cannot find the task to be deleted." });

    res.json({ message: `Task: ${deletedTask} Deleted Successfully!` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

todoRoutes.get("/error", (req, res, next) => {
  next(new Error("Intentional Server Error!!"));
});

export default todoRoutes;
