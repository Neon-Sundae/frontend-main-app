const formatTasksData = (projectTasks: any[]) => {
  const data = projectTasks.reduce(
    (acc, task) => {
      if (acc[task.status]) {
        acc[task.status].push(task);
      } else {
        acc[task.status] = [task];
      }

      return acc;
    },
    {
      open: [],
      interviewing: [],
      'in progress': [],
      'in review': [],
      completed: [],
      cancelled: [],
    }
  );

  return data;
};

export default formatTasksData;
