var obj = {
    a: 1,
    b: 2,
};

// 描述a 值为1 可重写 可遍历

// for (var key in obj) {
//     console.log(key);
// }

// var keys = Object.keys(obj);
// console.log(keys);

// console.log(obj);

// 得到属性描述符
// var desc = Object.getOwnPropertyDescriptor(obj, 'a');
// console.log(desc);

// 设置属性描述符
Object.defineProperty(obj, 'a', {
    value: 10,
    // 不可重写
    writable: false,
    // 不可遍历
    enumerable: false,
    // 不可修改属性描述符本身
    configurable: false,
});
// Object.defineProperty(obj, 'a', {
//     writable: true,
// });
// obj.a = 'abc';
// console.log(obj.a);

for (var key in obj) {
    console.log(key);
}