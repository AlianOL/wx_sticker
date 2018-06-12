// pages/gif/gif.js
var items = new Array();
var index = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stickers: [
      '../../images/sticker/1.png',
      '../../images/sticker/2.png',
      '../../images/sticker/3.png',
      '../../images/sticker/4.png',
      '../../images/sticker/5.png',
      '../../images/sticker/6.png',
      '../../images/sticker/7.png',
      '../../images/sticker/8.png',
      '../../images/sticker/9.png',
      '../../images/sticker/10.png',
      '../../images/sticker/11.png'],
    // itemList: [{
    //   id: 1,
    //   image: '../../images/sticker/1.png',//图片地址
    //   top: 100,//初始图片的位置 
    //   left: 100,
    //   x: 150, //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出
    //   y: 150,
    //   scale: 1,//缩放比例  1为不缩放
    //   angle: 0,//旋转角度
    //   active: false, //判定点击状态
    //   width: 100,
    //   height: 100
    // }, {
    //   id: 2,
    //   image: '../../images/sticker/2.png',
    //   top: 50,
    //   left: 50,
    //   x: 100,
    //   y: 100,
    //   scale: 1,
    //   angle: 0,
    //   active: false,
    //   width: 100,
    //   height:100
    // }],

  },
  WraptouchStart: function (e) {
    for (let i = 0; i < items.length; i++) {  //旋转数据找到点击的
      items[i].active = false;
      if (e.currentTarget.dataset.id == items[i].id) {
        index = i;   //记录下标
        items[index].active = true;  //开启点击属性
      }
    }

    items[index].lx = e.touches[0].clientX;  // 记录点击时的坐标值
    items[index].ly = e.touches[0].clientY;
    this.setData({   //赋值 
      itemList: items
    })
  }
  , WraptouchMove: function (e) {
    //移动时的坐标值也写图片的属性里
    items[index]._lx = e.touches[0].clientX;
    items[index]._ly = e.touches[0].clientY;

    //追加改动值
    items[index].left += items[index]._lx - items[index].lx;  // x方向
    items[index].top += items[index]._ly - items[index].ly;    // y方向
    items[index].x += items[index]._lx - items[index].lx;
    items[index].y += items[index]._ly - items[index].ly;

    //把新的值赋给老的值
    items[index].lx = e.touches[0].clientX;
    items[index].ly = e.touches[0].clientY;
    this.setData({//赋值就移动了
      itemList: items
    })
  },
  WraptouchEnd:function(e) {

  },
  // 触摸开始事件  items是this.data.itemList的全局变量，便于赋值  所有的值都应给到对应的对象里
  touchStart: function (e) {
    //找到点击的那个图片对象，并记录
    for (let i = 0; i < items.length; i++) {
      items[i].active = false;

      if (e.currentTarget.dataset.id == items[i].id) {
        console.log('e.currentTarget.dataset.id', e.currentTarget.dataset.id)
        index = i;
        console.log(items[index])
        items[index].active = true;
      }
    }
    //获取作为移动前角度的坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    //移动前的角度
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    console.log("移动前的角度", items[index].anglePre)
    //获取图片半径
    items[index].r = this.getDistancs(items[index].x, items[index].y, items[index].left, items[index].top)-20;//20是右下角移动图片到本图边缘的估计值，因为这个获取半径的方法跟手指的位置有关
    console.log("半径", items[index].r);
  },
  
  // 触摸移动事件  
  touchMove: function (e) {
    //记录移动后的位置
    items[index]._tx = e.touches[0].clientX;
    items[index]._ty = e.touches[0].clientY;
    //移动的点到圆心的距离
    var width = wx.getSystemInfoSync().windowWidth
    items[index].disPtoO = this.getDistancs(items[index].x, items[index].y, items[index]._tx - width * 0.125, items[index]._ty - 10)

    items[index].scale = items[index].disPtoO / items[index].r; //手指滑动的点到圆心的距离与半径的比值作为图片的放大比例
    items[index].oScale = 1 / items[index].scale;//图片放大响应的右下角按钮同比缩小

    //移动后位置的角度
    items[index].angleNext = this.countDeg(items[index].x, items[index].y, items[index]._tx, items[index]._ty)
    //角度差
    items[index].new_rotate = items[index].angleNext - items[index].anglePre;

    //叠加的角度差
    items[index].rotate += items[index].new_rotate;
    items[index].angle = items[index].rotate; //赋值

    //用过移动后的坐标赋值为移动前坐标
    items[index].tx = e.touches[0].clientX;
    items[index].ty = e.touches[0].clientY;
    items[index].anglePre = this.countDeg(items[index].x, items[index].y, items[index].tx, items[index].ty)
    items[index].angle = items[index].anglePre-135;

    //赋值setData渲染
    this.setData({
      "itemList": items
    })
  },
  deleteItem:function(e){
  console.log("删除按钮:",e)
  for (let i = 0; i < items.length; i++) {


    if (e.currentTarget.dataset.id == items[i].id) {
      items.splice(i, 1);
      this.setData({
        "itemList": items
      })
    }
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // items = this.data.itemList;
    // this.setData({
    //   "itemList": items
    // })
  },
  changeImg:function(e){


  var temDic = {
    id: e.currentTarget.dataset.index+1,
    image: e.currentTarget.dataset.url,//图片地址
    top: 100,//初始图片的位置 
    left: 100,
    x: 150, //初始圆心位置，可再downImg之后又宽高和初始的图片位置得出
    y: 150,
    scale: 1,//缩放比例  1为不缩放
    angle: 0,//旋转角度
    active: false, //判定点击状态
    width: 100,
    height: 100
  }
  items.push(temDic)
  this.setData({
    "itemList": items
  })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*
     *参数1和2为图片圆心坐标
     *参数3和4为手点击的坐标
     *返回值为手点击的坐标到圆心的角度
     */
  countDeg: function (cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    var to = Math.abs(ox / oy);
    var angle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度

    if (ox < 0 && oy < 0)//相对在左上角，第四象限，js中坐标系是从左上角开始的，这里的象限是正常坐标系  
    {
      angle = -angle;
    } else if (ox <= 0 && oy >= 0)//左下角,3象限  
    {
      angle = -(180 - angle)
    } else if (ox > 0 && oy < 0)//右上角，1象限  
    {
      angle = angle;
    } else if (ox > 0 && oy > 0)//右下角，2象限  
    {
      angle = 180 - angle;
    }

    return angle;
  },
  //计算触摸点到圆心的距离
  getDistancs(cx, cy, pointer_x, pointer_y) {
    var ox = pointer_x - cx;
    var oy = pointer_y - cy;
    return Math.sqrt(
      ox * ox + oy * oy
    );
  }
})