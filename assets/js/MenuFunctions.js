
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
            pointerMap[menu[item].parent_id].children.push(menu[item])
            delete menu[item];
        }
    }

    return Object.values(menu);
}