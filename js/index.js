// function creaeteUiGoods(g) {
//     return {
//         data: g,
//         choose: 0,
//     };
// }

// 无头浏览器，浏览器内核，浏览器没有界面但包含浏览器的所有功能，能够解析html，能够生成dom, cssom, 生成绘制指令

// ES6
// 单件商品的数据
class UIGoods {
    constructor(g) {
        this.data = g;
        this.choose = 0;
    }

    // 获取总价
    getTotalPrice() {
        return this.data.price * this.choose;
    }

    // 是否选中了此件商品
    isChoose() {
        return this.choose > 0;
    }

    // 选择的数量+1
    increase() {
        this.choose++;
    }

    // 选择的数量-1
    decrease() {
        if (this.choose === 0) {
            return;
        }
        this.choose--;
    }
}

// function UIGoods(g) {
//     this.data = g;
//     this.choose = 0;
//     // 是作为属性出现还是方法出现
//     // 数据冗余, totalPrice可以根据data, choose算出来, 数据冗余就有可能出现数据不一致的问题, 降低了代码的可维护性
//     this.totalPrice = 0;
// }

// // 多了个函数，效率降低了，数据冗余有效率的好处，没有银弾(一招吃遍天)
// // 获取总价
// UIGoods.prototype.getTotalPrice = function () {
//     return this.data.price * this.choose;
// };

// // 是否选中了此件商品
// UIGoods.prototype.isChoose = function () {
//     return this.choose > 0;
// }

// var uig = creaeteUiGoods(goods[0]);
// console.log(uig);


// var uig = new UIGoods(goods[0]);
// console.log(uig);

// 整个界面的数据
class UIData {
    constructor() {
        var uiGoods = [];
        for (var i = 0; i < goods.length; i++) {
            var uig = new UIGoods(goods[i]);
            uiGoods.push(uig);
        }
        this.uiGoods = uiGoods;
        // 硬编码
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    getTotalPrice() {
        var sum = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            var g = this.uiGoods[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }

    // 非常高级的思想, 前端懂面向对象的很少, 面向对象的封装, 面向对象最难的在于面向对象的设计
    // 知识很简单, 思想性的东西比知识的构建要复杂得多, 不是一朝一夕的事，会改变思维方式和看待程序的方式
    // 为什么要重新封装, 避免直接操作里面的东西, 那是内部的零件, 操作外面的壳子就行了, 就像操作微波炉, 冰箱操作外面的触控屏和旋钮就行了而不用操作里面的零件

    // 增加某件商品的选中数量
    increase(index) {
        // 相当高级的写法
        this.uiGoods[index].increase();
    }

    // 减少某件商品的选中数量
    decrease(index) {
        this.uiGoods[index].decrease();
    }

    // 得到总共的选择数量
    getTotalChooseNumber() {
        var sum = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            sum += this.uiGoods[i].choose;
        }
        return sum;
    }

    // 数据逻辑和页面逻辑相分离的设计
    // 站在巨人的肩膀上，充分利用已经写好的函数, 已经有很多基础设施了
    // 为什么正确的感觉是越写越快， 因为前期编写代码的过程中已经创建了大量的基础设施
    // 购物车中有没有东西
    hasGoodsInCar() {
        // bug 之前直接return this.getTotalChooseNumber
        return this.getTotalChooseNumber() > 0;
    }

    // 长点无所谓，函数名即注释
    // 是否跨过了配送标准
    isCrossDeliveryThreshold() {
        // bug 之前直接return this.getTotalPrice
        return this.getTotalPrice() >= this.deliveryThreshold;
    }

    isChoose(index) {
        return this.uiGoods[index].isChoose();
    }
}

// 整个界面
class UI {
    constructor() {
        this.uiData = new UIData();
        // 放到一个对象里收纳一下
        // 相同的类型组装到一起分门别类的放好
        this.doms = {
            goodsContainer: document.querySelector('.goods-list'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            footerPayInnerSpan: document.querySelector('.footer-pay span'),
            totalPrice: document.querySelector('.footer-car-total'),
            car: document.querySelector('.footer-car'),
            badge: document.querySelector('.footer-car-badge'),
        };

        // 一开始就可以算出来
        var carRect = this.doms.car.getBoundingClientRect();
        var jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5,
        }
        this.jumpTarget = jumpTarget;

        this.createHTML();
        this.updateFooter();
        this.listenEvent();
    }

    // 监听各种事件
    listenEvent() {
        this.doms.car.addEventListener('animationend', function () {
            this.classList.remove('animate');
        });
    }

    // 根据商品数据创建商品列表元素
    // 一个列表元素就是一个div
    createHTML() {
        // 1. 生成html字符串(parse html)字符串要生成dom树，(执行效率低，开发效率高)
        // 2. 一个一个创建元素 dom树已经创建好了，少一个解析html的步骤，(执行效率高，开发效率低)
        var html = '';
        for (var i = 0; i < this.uiData.uiGoods.length; i++) {
            var g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
            <img src="${g.data.pic}" alt="" class="goods-pic" />
            <div class="goods-info">
              <h2 class="goods-title">${g.data.title}</h2>
              <p class="goods-desc">${g.data.desc}</p>
              <p class="goods-sell">
                <span>月售 ${g.data.sellNumber}</span>
                <span>好评率${g.data.favorRate}%</span>
              </p>
              <div class="goods-confirm">
                <p class="goods-price">
                  <span class="goods-price-unit">￥</span>
                  <span>${g.data.price}</span>
                </p>
                <div class="goods-btns">
                  <i index="${i}" class="iconfont i-jianhao"></i>
                  <span>${g.choose}</span>
                  <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
                </div>
              </div>
            </div>
          </div>`
        }
        this.doms.goodsContainer.innerHTML = html;
    }

    // 最后全部弄完，在控制台用函数能实现所有功能之后才做事件
    increase(index) {
        this.uiData.increase(index);
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index);
    }

    // 所有的功能全部做完，最后把事件做个连接
    decrease(index) {
        this.uiData.decrease(index);
        this.updateGoodsItem(index);
        this.updateFooter();
    }

    // 更新某个商品元素的显示状态
    updateGoodsItem(index) {
        var goodsDom = this.doms.goodsContainer.children[index];
        if (this.uiData.isChoose(index)) {
            goodsDom.classList.add('active');
        } else {
            goodsDom.classList.remove('active');
        }
        var span = goodsDom.querySelector('.goods-btns span');
        span.textContent = this.uiData.uiGoods[index].choose;
    }

    // 更新页脚
    updateFooter() {
        // 得到总价数据
        var total = this.uiData.getTotalPrice();
        // 设置配送费
        this.doms.deliveryPrice.textContent = `配送费￥${this.uiData.deliveryPrice}`;
        // 设置起送费还差多少
        if (this.uiData.isCrossDeliveryThreshold()) {
            // 到达起送点
            this.doms.footerPay.classList.add('active');
        } else {
            this.doms.footerPay.classList.remove('active');
            // 更新还差多少钱
            var dis = this.uiData.deliveryThreshold - total;
            dis = Math.round(dis);
            this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
        }

        // 设置总价 toFixed(2)表示保留两位小数
        this.doms.totalPrice.textContent = total.toFixed(2);
        // 设置购物车的样式状态
        if (this.uiData.hasGoodsInCar()) {
            this.doms.car.classList.add('active');
        } else {
            this.doms.car.classList.remove('active');
        }
        // 设置购物车中的数量
        // C3动画
        this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
    }

    // 购物车动画
    carAnimate() {
        this.doms.car.classList.add('animate');
        //这样做不好，每次调用这个函数都会注册一个事件监听器，监听只需要做一次就行

        // this.doms.car.addEventListener('animationend', function () {
        //     // 注意这里的this指向有问题，在这个事件函数里不再指向原来的对象
        //     // 指向当前注册事件的元素，给谁注册的事件，this就指向谁
        //     // 这里指向car
        //     // this.doms.car.classList.remove('animate');
        //     this.classList.remove('animate');
        // });
    }

    // 抛物线跳跃的元素
    jump(index) {
        // // 得到购物车元素的矩形
        // var carRect = this.doms.car.getBoundingClientRect();
        // // 这个目标不会变，所以不需要每次跳的时候都算一遍
        // var jumpTarget = {
        //     x: carRect.left + carRect.width / 2,
        //     y: carRect.top + carRect.height / 5,
        // };

        // 找到对应商品的加号
        var btnAdd = this.doms.goodsContainer.children[index].
            querySelector('.i-jiajianzujianjiahao');
        var rect = btnAdd.getBoundingClientRect();
        var start = {
            x: rect.left,
            y: rect.top,
        };
        // 跳
        var div = document.createElement('div');
        div.className = 'add-to-car';
        // div.innerHTML=``;
        var i = document.createElement('i');
        i.className = 'iconfont i-jiajianzujianjiahao';
        // 设置初始位置
        // 改动了cssom树，先只管x, y先不管
        // div.style.transform = `translateX(${start.x}px, ${start.y}px)`;
        div.style.transform = `translateX(${start.x}px`;

        // i元素管纵向，外面的div管横向, 当时创建i元素也是为了方便控制坐标
        i.style.transform = `translateY(${start.y}px)`;

        div.appendChild(i);
        document.body.appendChild(div);
        // 强行渲染 reflow 读它的任何一个布局属性都会导致强行渲染. 
        // 学过H5还可以用requestAnimationFrame, 他不会导致reflow，它的原理就是等，等渲染完才做下一件事
        div.clientWidth;

        // 设置结束位置，然后加个过渡效果就完事了
        // 又改动了cssom树, 执行完JS后主线程才会渲染
        // div.style.transform = `translate(${this.jumpTarget.x}px, ${this.jumpTarget.y}px)`;
        // bug 这里没有加X和Y
        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;

        // 先用个变量保存this,后面的函数里this会用不了
        var that = this;
        // 添加当过渡效果结束时的事件, 会什么会出发两次事件，第一次是div自己过渡结束，第二次是i元素过渡结束
        div.addEventListener('transitionend', function () {
            div.remove();
            // this指向会出问题, ES6学了后可以用箭头函数来控制this
            // this.carAnimate();
            that.carAnimate();
        }, {
            // 表示事件仅触发一次
            once: true,
        });
    }
}

var ui = new UI();

// 事件
ui.doms.goodsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('i-jiajianzujianjiahao')) {
        // 自定义属性
        // 学过H5的话可以用data-index
        var index = +e.target.getAttribute('index');
        ui.increase(index);
    } else if ('i-jianhao') {
        var index = +e.target.getAttribute('index');
        ui.decrease(index);
    }
});

// 哪怕后面事件有变, 用户按加号, 减号 可维护性，可扩展性无与伦比, 功能变动很平常，这种代码结构无惧变动
// window.addEventListener('keypress', function (e) {
//     // console.log(e.code);
//     if (e.code === 'Equal') {
//         ui.increase(0);
//     } else if (e.code === 'Minus') {
//         ui.decrease(0);
//     }
// });