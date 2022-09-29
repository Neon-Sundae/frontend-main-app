const getProfileProjects = (responseData: any[]) => {
  const filteredData = responseData.filter(x => x.flProjects.length > 0);

  const data = filteredData.map(row => {
    const flProjects = row.flProjects.map((flProject: any) => {
      const taskCount = flProject.flProjectCategory.reduce(
        // eslint-disable-next-line no-underscore-dangle
        (acc: number, current: any) => acc + current._count.tasks,
        0
      );

      return {
        id: flProject.flProjectId_uuid,
        name: flProject.name,
        description: flProject.description,
        taskCount,
        organisation: row.name,
        image: row.profileImage,
        smartContractId: flProject.smartContractId,
        type: 'project_contract',
      };
    });

    return flProjects;
  });

  return data.flat();
};

export default getProfileProjects;
