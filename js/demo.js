// 属性描述符: ES5出的, 这个玩意的出现就是JS向全世界发布的声明，告诉全世界我不是个玩具语言, 而是正规军, 能保证写的功能模块是稳固的, 不可摧毁的
var aGoods = {
    pic: '.',
    title: '..',
    desc: `...`,
    sellNumber: 1,
    favorRate: 2,
    price: 3,
};

// function UIGoods(g) {
//     this.data = g;
//     this.choose = 0;
// }

// ES6
class UIGoods {

    // ES6 syntactic sugar语法糖
    get totalPrice() {
        return this.choose * this.data.price;
    }

    get isChoose() {
        return this.choose > 0;
    }

    constructor(g) {
        // Object.freeze(g);
        // 对象克隆
        g = { ...g };
        // 这样就没有操纵原始对象了
        Object.freeze(g);
        // this.data = g;
        Object.defineProperty(this, 'data', {
            get: function () {
                return g;
            },
            set: function () {
                throw new Error('data 属性是只读的, 不能重新赋值');
            },
            configurable: false,
        });

        // 外部访问不到
        var internalChooseValue = 0;
        Object.defineProperty(this, 'choose', {
            configurable: false,
            get: function () {
                return internalChooseValue;
            },
            set: function (val) {
                if (typeof val !== 'number') {
                    throw new Error('choose属性必须是数字');
                }
                // 1.5 -> 1
                var temp = parseInt(val);
                // 位运算
                // var temp = ~~val;
                if (temp !== val) {
                    throw new Error('choose属性必须是整数');
                }
                if (val < 0) {
                    throw new Error('choose属性必须大于等于0');
                }
                internalChooseValue = val;
            }
        });

        // Object.defineProperty(this, 'totalPrice', {
        //     get: function () {
        //         // this 指代当前使用这个属性的对象，哪个对象在用这个属性，this就指向谁
        //         return this.choose * this.data.price;
        //     },
        //     // 不写set就相当于set不是个函数
        // });
        this.a = 1;
        // Object.freeze(this);
        // 密封
        Object.seal(this);
    }
}

Object.freeze(UIGoods.prototype);

var g = new UIGoods(aGoods);
UIGoods.prototype.haha = 'abc';
console.log(g.haha);

g.abc = 123;
g.a = 3;
console.log(g);
g.data.price = 100;
console.log(g.data);

// 最好的做法是这句报错，而报错信息可以自定义，错误是好事，让你提前知道哪个地方出了问题
// 虽然代码写多了，写构造函数的时候代码变多了，是做的时间多还是用的时间多，肯定是用的时间多，以后方便了,做的时候可以幸苦一点，做的更加稳固一点
// 这些东西只有写第三方库和框架的时候才能形成这种思维
// g.data = 'abc';
g.choose = 2;
// 用这个属性就是一个函数, 总价感觉就是一个属性用成函数不好看，但不得不弄成函数，不然会出现数据冗余
// 现在两者兼顾了, 长的像属性，实际是函数
// console.log(g.totalPrice);
// console.log(g.isChoose);
// console.log(g.data);