export function reformatMenuResponse(items) {
  let menu = {};
  let pointerMap = {};

  //push object for each item
  for (let item of items) {
    menu[item.id] = item
    pointerMap[item.id] = item;
  }

  // add each to parents
  for (let item in menu) {
    if (menu[item].parent_id && pointerMap[menu[item].parent_id]) {
      if (!pointerMap[menu[item].parent_id].children) {
        pointerMap[menu[item].parent_id].children = [];
        pointerMap[menu[item].parent_id].slug = ""
      }

      if (ribbonCan(menu[item].gate) || menu[item].gate === null)
        pointerMap[menu[item].parent_id].children.push(menu[item])

      delete menu[item];
    }

    if (!ribbonCan(menu[item]?.gate))
      delete menu[item];
  }

  return Object.values(menu)
      .filter(item => {
        return item.children === undefined ? true : item.children.length > 0
      })
      .map(item => {
        return !!item.children
            ? {
              ...item,
              children: item.children?.sort((a, b) => a.sort_order - b.sort_order)
            }
            : item
      })
}