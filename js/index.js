let mySwiper = new Swiper ('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
    },
    speed:300,
    })
var isScroll=new IScroll('.content',{
    mouseWheel: true,
    scrollbars: true,
    shrinkScrollbars:'scale',
    click:true,
});
//点击新增
//project 未完成状态 done 完成状态
var state="project";
$(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active")
    state="project";
    render();
})
$(".done").click(function(){
    $(this).addClass("active").siblings().removeClass("active")
    state="done";
    render();
})
$(".add").click(function(){
    $(".mask").show();
    $(".update").hide();
    $(".inputarea").transition({y:0},500);
})
$(".cancel").click(function(){
    $(".inputarea").transition({y:"-62vh"},500,function(){
        $(".mask").hide(10);
    });
})
$(".submit").click(function(){
    let val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    let data=getData();
    console.log(data);
    let time=new Date().getTime();
    data.push({content:val,time,star:false,done:false});

    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},1000,function(){
        $(".mask").hide();
    })
})
$(".update").click(function(){
    let val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    let data=getData();
    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},1000,function(){
        $(".mask").hide();
    })
})
//changestate 完成 del删除   事件委派
$(".itemlist")
    .on("click",".changestate",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        // console.log(index)
        data[index].done=true;
        saveData(data);
        render();
    })
    .on("click",".del",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1)
        saveData(data);
        render();
    })
    .on("click","span",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].star=!data[index].star;
        saveData(data);
        render();
    })
    .on("click","p",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show().data("index",index);
    })
function getData(){
    return localStorage.todo?JSON.parse(localStorage.todo):[];
}
function saveData(date){
    localStorage.todo=JSON.stringify(date);
}
function render(){
    let data=getData();
    let str="";
    data.forEach(function(val,index){
        // console.log(index)
        if(state==="project"&& val.done===false){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+
                "</time><span class="+(val.star?"activex":"")+">&#xe642;</span><div class='changestate'>完成</div></li>"
        }else if(state==="done"&& val.done===true){
            str+="<li id="+index+"><p>"+val.content+"</p><time>"+parseTime(val.time)+
                "</time><span class="+(val.star?"activex":"")+">&#xe642;</span><div class='del'>删除</div></li>"
        }

    })
    $(".itemlist").html(str);
    isScroll.refresh();
    addTouchEvent();
}
render();
function parseTime(time) {
    var data=new Date();
    data.setTime(time);
    var year=data.getFullYear();
    var month=setZero(data.getMonth()+1)
    var day=setZero(data.getDate())
    var hour=setZero(data.getHours())
    var min=setZero(data.getMinutes())
    var sec=setZero(data.getSeconds())
    return year+"/"+month+"/"+day+"<br>"+hour+":"+min+":"+sec;
}
function setZero(n)
{
    return n<10?"0"+n:n;
}
//li 移动时判断的函数
function addTouchEvent(){
    $(".itemlist>li").each(function(index,ele){
        var hammerobj=new Hammer(ele);
        let state="start";
        let sx,movex;
        let flag=true;//手指离开需不需要动画
        let max=window.innerWidth/5;
        hammerobj.on("panstart",function(e){
            sx=e.center.x;
            ele.style.transition="none";
        })

        hammerobj.on("panmove",function(e){
            let cx=e.center.x;
            movex=cx-sx;
            if(movex>0&&state==="start"){//开始不能右
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){//结束不能左
                flag=false;
                return;
            }
            if(Math.abs(movex)>max){
                flag=false;
                state=state==="start"?"end":"start";
                if(state==="end"){
                    $(ele).css("x","-max")
                }else{
                    $(ele).css("x","0")
                }
                return;
            }
            if(state==="end"){//删除往回移的距离

                movex=cx-sx-max;

            }
            flag=true;
            $(ele).css("x",movex)

        })
        hammerobj.on("panend",function(e){
            if(!flag){return;}
            ele.style.transition="all 0.5s";
            if(Math.abs(movex)<max/2){
                $(ele).transition({x:0});
                state=="start"

            }else{
                $(ele).transition({x:-max});
                state=="end"
            }

        })
    })
}




