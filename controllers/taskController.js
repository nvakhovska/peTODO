
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

export async function getTaskStats(req, res) {
  try {
    const stats = await Task.aggregate([
      // Match tasks that are either in-progress or pending
      {
        $match: {
          status: { $in: ['in-progress', 'pending'] },
          assignedTo: { $exists: true, $not: { $size: 0 } } // Ensure assignedTo is not empty
        }
      },
      // Unwind the assignedTo array to process each user separately
      {
        $unwind: '$assignedTo'
      },
      // Group by assignedTo user and status, and count the tasks for each user per status
      {
        $group: {
          _id: { user: '$assignedTo', status: '$status' },
          count: { $sum: 1 }
        }
      },
      // Project the result to display user and task count in a clean format
      {
        $project: {
          user: '$_id.user',
          status: '$_id.status',
          taskCount: '$count',
          _id: 0
        }
      },
    ]);

    // Log the result of the aggregation to see the output
    //console.log(stats);  

    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  };
}