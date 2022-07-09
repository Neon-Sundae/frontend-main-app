interface IProjectCategories {
  flProjectCategoryId: number;
  categoryName: string;
}

const normalizeCategories = (categories: IProjectCategories[]) => {
  const data = categories.map(category => ({
    label: category.categoryName,
    value: category.flProjectCategoryId,
  }));

  return data;
};

export default normalizeCategories;
