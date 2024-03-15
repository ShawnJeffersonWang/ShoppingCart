var obj = {};

// Object.defineProperty(obj, 'a', {
//     value: 10,
//     writable: false,
// });

// 模拟一个普通属性的感觉
var internalValue = undefined;

// 整体叫做访问器
Object.defineProperty(obj, 'a', {
    // 读取器 getter
    get: function () {
        // console.log('hello world');
        // return 123;

        // return get();
        // return obj.a;
        // return internalValue;

        // 做一个超级爽的只读属性
        return 123;
    },
    // 设置器 setter
    set: function (val) {
        // console.log('haha');

        // set(val);
        // obj.a = val;
        // internalValue = val;
        throw new Error(`兄弟, 你正在给a这个属性重新赋值, 所赋的值是${val}, 但是这个属性不能赋值, 你再考虑考虑`);
    },
});

// 读属性a时, 不会去内存空间找a, 变成了运行get函数
// obj.a-- > get();

// console.log(obj.a);

// 运行set函数，把表达式的结果作为参数传递给set
// set(3+2)
// obj.a = 3 + 2;

// set(get()+2)  set(123+2)
obj.a = 123;
// get()
console.log(obj.a);

// console.log(get())
// console.log(obj.a);