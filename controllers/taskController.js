
import Task from '../models/taskModel.js';
import APIFeatures from '../utils/apiFeatures.js';

export async function getAllTasks(req, res) {
  try {
    
    const features = new APIFeatures(Task.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tasks = await features.query;
    
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
}

export async function getTask(req, res) {
  try{
    const task = await Task.findById(req.params.id);
    console.log(task);
    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    })
  };


}

export async function createTask(req, res) {
  try {
    const newTask = await create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        task: newTask
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

export async function updateTask(req, res) {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        task: task
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  };
  
}

export async function deleteTask(req, res) {
  try {
    await findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  };
  
}
