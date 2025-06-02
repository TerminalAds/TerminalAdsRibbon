export function reformatMenuResponse(items) {
  let menu = {};
  let pointerMap = {};

  //push object for each item
  for (let item of items) {
    menu[item.id] = item
    pointerMap[item.id] = item;
  }
  console.log(pointerMap,"POINTERmaP");
  // add each to parents
  for (let item in menu) {
    console.log(menu,"menu12");

    if (menu[item].parent_id && pointerMap[menu[item].parent_id]) {
      if (!pointerMap[menu[item].parent_id].children) {
        pointerMap[menu[item].parent_id].children = [];
        pointerMap[menu[item].parent_id].slug = ""
      }
      console.log(ribbonCan(menu[item].gate) || menu[item].gate === null,"ribbonCan(menu[item].gate) || menu[item].gate === null");
      console.log(menu[item].gate,"menu[item].gate");

      if (ribbonCan(menu[item].gate) || menu[item].gate === null)
        pointerMap[menu[item].parent_id].children.push(menu[item])

      delete menu[item];
    }
    console.log(menu,"menu23", item);

    if (!ribbonCan(menu[item]?.gate))
      delete menu[item];
  }
  console.log(menu,"menu");
  console.log(Object.values(menu)
  .filter(item => {
    return item.children === undefined ? true : item.children.length > 0
  })
  ,"result-menu")
  console.log(Object.values(menu)
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
  }),"result")

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