$(function () {
    var clientW=$(window).width();
    var clientH=$(window).height();
    var canvas=document.querySelector("canvas");
    canvas.width=clientW;
    canvas.height=clientH;
    var cobj=canvas.getContext("2d");
    var runs=$(".run");
    var jumps=$(".jump");
    var zhidan=$(".zhidan");
    var start=$(".start");
    var hinderImg=$(".hinder");
    var mask=$(".mask");
    var btn=$(".btn");
    var runA=document.querySelector(".runA");
    var jumpA=document.querySelector(".jumpA");
    var zhuangA=document.querySelector(".zhuangA");
    var zhuangB=document.querySelector(".zhuangB");
    var overA=document.querySelector(".overA");
    var gameobj=new game(canvas,cobj,runs,jumps,hinderImg,zhidan,runA,jumpA,zhuangA,zhuangB,overA);
    btn.one("click",function (e) {
        e.preventDefault();
        gameobj.play(start,mask);
    })
})