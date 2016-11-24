function person(canvas,cobj,runs,jumps){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runs=runs;
    this.jumps=jumps;
    this.x=0;
    this.y=270;
    this.width=100;
    this.height=100;
    this.speedx=5;
    this.speedy=5;
    this.zhongli=0.4;
    this.status="runs";
    this.state=0;
    this.num=0;
    this.life=3;
}
person.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        //显示那张图片（状态）（张数）（多大的图片）（放到哪个区间）
        this.cobj.drawImage(this[this.status][this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    }
};
//子弹
function zidan(canvas,cobj,zhidan){
    this.canvas=canvas;
    this.cobj=cobj;
    this.zhidan=zhidan;
    this.x=0;
    this.y=320;
    this.state=0;
    this.width=60;
    this.height=40;
    this.color="blue";
    this.speedx=5;
    this.jia=1;
}
zidan.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.zhidan[this.state],0,0,392,220,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//障碍物
function hinder(canvas,cobj,hinderImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.state=0;
    this.x=canvas.width-20;
    this.y=350-(100*Math.random());
    this.width=400;
    this.height=400;
    this.speedx=6;
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,800,500,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
//血
function lizi(cobj,color){
    this.cobj=cobj;
    this.x = 380;
    this.y = 130;
    this.r = 1+3*Math.random();
    this.color = color;
    this.speedy = -2;
    this.speedx = Math.random()*4-3;
    this.zhongli = 0.3;
    this.speedr = 0.05;
}
lizi.prototype = {
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.beginPath();
        cobj.fillStyle = this.color;
        cobj.arc(0,0,this.r,0,2*Math.PI);
        cobj.fill();
        cobj.restore();
    },
    update:function(){
        this.x+=this.speedx;
        this.speedy+=this.zhongli;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
}
function xue(cobj,x,y,color){
    var arr = [];
    for(var i = 0;i<30;i++) {
        var obj = new lizi(cobj,color);
        obj.x = x;
        obj.y = y;
        arr.push(obj);
    }
    var t = setInterval(function(){
        for(var i = 0;i<arr.length;i++) {
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    },50)
}
//游戏的主类
function game(canvas,cobj,runs,jumps,hinderImg,zhidan,runA,jumpA,zhuangA,zhuangB,overA){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.zhidan=zhidan;
    this.runA=runA;
    this.jumpA=jumpA;
    this.zhuangA=zhuangA;
    this.zhuangB=zhuangB;
    this.overA=overA;
    this.height=canvas.height;
    this.width=canvas.width;
    this.person=new person(canvas,cobj,runs,jumps);
    this.backx=0;
    this.backSpeed=6;
    this.score=0;//积分
    this.hinderArr=[];
    this.isfire=false;
    this.zidan=new zidan(canvas,cobj,zhidan);
    this.z=1;
    this.color="red";
    this.rand=(4+Math.ceil(6*Math.random()))*1000;
}
game.prototype={
    //主运行方法
    play:function(start,mask){
        //大幕拉起
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        this.run();
        this.key();
        this.mouse();
        this.runA.play();
    },
    run:function(){
        var that = this;
        this.runA.play();
        var num=0;
        that.rand=(4+Math.ceil(6*Math.random()))*1000;
        setInterval(function(){
            num+=50;
            that.cobj.clearRect(0,0,that.width,that.height);
            that.person.num++; /*计算显示的图片*/
            //that.person.speedx=0;
            that.backSpeed=6;
            if(that.person.status=="runs"){
                that.person.state =that.person.num%8;///控制第几张
            }
            else{
                that.person.state = 0;
            }
            /*让人物的x轴发生变化*/
            that.person.x+=that.person.speedx;
            if(that.person.x>that.width/3){
                that.person.x=that.width/3;
                //that.backx-=that.backSpeed;
            }
            that.person.draw();
            //操作障碍物
            if(num%that.rand==0){
                num=0;
                var obj=new hinder(that.canvas,that.cobj,that.hinderImg);
                obj.state=Math.floor(Math.random()*that.hinderImg.length);
                if(obj.state==6){
                    /*积分+5*/
                    obj.flag=true;
                    obj.flag2=true
                }else if(obj.state==9){
                    /*关卡+1*/
                    obj.flag=true;
                    obj.flag3=true
                }
                that.hinderArr.push(obj);
            }
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.hinderArr[i].speedx;
                that.hinderArr[i].draw();
                /*判断子弹与障碍物碰撞*/
                if(hitPix(that.canvas,that.cobj,that.zidan,that.hinderArr[i])){
                    that.zhuangA.play();
                    if(!that.hinderArr[i].flag){
                        that.color="#ccc";
                        xue(that.cobj,that.zidan.x+that.zidan.width/2,that.zidan.y+that.zidan.height/2,that.color);
                        that.hinderArr[i].width=0;
                        that.hinderArr[i].flag=true;
                    }
                    if(that.hinderArr[i].flag2){
                        alert("打到钱袋子，积分+1")
                        that.hinderArr[i].width=0
                            that.score++;
                            document.querySelectorAll("span")[0].innerHTML=that.score;
                        that.hinderArr[i].flag2=false;
                    }
                    if(that.hinderArr[i].flag3){
                        alert("打破月光宝盒，难度提升10次")
                        that.hinderArr[i].width=0
                        for(var q=0;q<10;q++){
                            that.z++;
                        }
                        document.querySelectorAll("span")[1].innerHTML=that.z;
                        that.hinderArr[i].flag3=false;
                    }
                }
                /*判断人与障碍物碰撞*/
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    that.zhuangB.play();
                    if(!that.hinderArr[i].flag){
                            xue(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2,that.color);
                            that.person.life--;
                            that.hinderArr[i].width=0;
                            document.querySelectorAll("span")[2].innerHTML=that.person.life;
                        if(that.person.life==0){
                            that.overA.play();
                            alert("Game over");
                            location.reload();
                        }
                        that.hinderArr[i].flag=true;
                    }
                    if(that.hinderArr[i].flag2){
                        that.hinderArr[i].width=0
                        alert("捡到钱袋子，积分+3")
                            that.score++;
                            that.score++;
                            that.person.life++;
                            document.querySelectorAll("span")[0].innerHTML=that.score;
                        that.hinderArr[i].flag2=false;
                    }
                    if(that.hinderArr[i].flag3){
                        alert("捡到月光宝盒，随机出现关卡，生命值刷新")
                        that.hinderArr[i].width=0
                        for(var j=0;j<Math.floor(5*Math.random());j++){
                            that.z++;
                        }
                        that.person.life=3;
                        document.querySelectorAll("span")[2].innerHTML=that.person.life;
                        document.querySelectorAll("span")[1].innerHTML=that.z;
                        that.hinderArr[i].flag3=false;
                    }
                }
                if(that.person.x>(that.hinderArr[i].x+that.hinderArr[i].width)){
                    if(!that.hinderArr[i].flag&&!that.hinderArr[i].flag1){
                        that.score++;
                        document.querySelectorAll("span")[0].innerHTML=that.score;
                        if(that.score>3*that.z){
                            that.z++;
                            that.score=0;
                            that.rand=(4-that.z+Math.ceil(6*Math.random()))*1000
                            that.person.life++;
                            document.querySelectorAll("span")[2].innerHTML=that.person.life;
                            if(that.person.life>5){
                                alert("你很健康，请继续奔跑吧！")
                            }
                            document.querySelectorAll("span")[0].innerHTML=that.score;
                            document.querySelectorAll("span")[1].innerHTML=that.z;
                        }
                        that.hinderArr[i].flag1=true;
                    }
                }
            }
            //操作子弹
            if(that.isfire){
                var obj=new zidan(that.canvas,that.cobj,that.zhidan)
                that.zidan.speedx+=that.zidan.jia;
                that.zidan.x+=that.zidan.speedx;
                that.zidan.draw();
            }
            /*操作背景*/
            that.backx-=that.backSpeed;
            that.canvas.style.backgroundPositionX = that.backx+"px";
        },50)
    },
    key:function(){
        var that = this;
        var flag = true;
        document.onkeydown = function(e) {
            if (!flag) {
                return;
            }
            flag = false;
            if (e.keyCode == 32) {  //空格
                that.person.status = "jumps";
                that.runA.pause();
                that.jumpA.play();
                var inita = 0;
                var speeda = 15;
                var r = 80;
                var y = that.person.y//记录
                /*跳跃动画*/
                var t = setInterval(function () {
                    inita += speeda;
                    if (inita >= 180) {
                        that.person.y = y;
                        clearInterval(t);
                        that.runA.play();
                        flag = true;
                        that.person.status = "runs";
                    }
                    else {
                        var top = Math.sin(inita * Math.PI / 180) * r;
                        that.person.y = y - top;
                        //that.person.y=y;
                    }
                }, 50)
            }
        }
    },
    mouse:function(){
        var that=this;
        document.querySelector(".mask").onclick=function(){
            that.zidan.x=that.person.x+that.person.y;
            that.zidan.y=that.person.y+that.person.height/2;
            that.zidan.speedx=5;
            that.isfire=true;
        }
    }
};