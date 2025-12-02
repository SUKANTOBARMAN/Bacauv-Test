import {Notify, useQuasar} from "quasar";
export function showSuccessMsg(message='Action Executed successfully'){
  Notify.create({
    type: "positive",
    message: message,
  });
}
export function showErrorMsg(message='Action Failed to Execute'){
  Notify.create({
    type: "error",
    message: message,
  });
}

export const buildCategoryHierarchy = (categories) => {
  const categoryMap = {};
  categories.forEach((category) => {
    category.children = [];
    categoryMap[category.id] = category;
  });
  const roots = [];
  categories.forEach((category) => {
    if (category.parent_id) {
      if (categoryMap[category.parent_id]) {
        categoryMap[category.parent_id].children.push(category);
      }
    } else {
      roots.push(category);
    }
  });
  return roots;
};

