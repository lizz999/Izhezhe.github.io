(function($){
 
    var waitComment = {};
    var layer = require('app/assets/libs/layer/layer');
    var laypage = require('app/assets/libs/laypage/index');
    // require('app/assets/libs/showloading/loading');
    var tpl = require('view/waitComment_tpl');

    waitComment.list = function(page){
        var self=this;

        var approveListUrl = reqConfig.getInterface('approveList');
        // $('.public-main').showLoading();
        $.ajax({
            url:approveListUrl,
            type:'get',
            data:{
            	pageNumber:(page || self.curr),
                keyWords:$("#search").val(),
            	approveStatus:1
            }
        }).done(function (data) {
            var html = tpl.waitComment(data.data.commentList);
            $('#search-count').text(data.data.page.totalCount);
            $('#container').html(html);  
            if(!$('p.name').text()) {
                $('.view-all').hide();
                $('td.t3').hide();
            }
            var page = data.data.page;
            laypage({
                cont: $('.public-fanye'), //容器。值支持id名、原生dom对象，jquery对象,
                pages: page.pageTotal, //总页数
                curr: page.pageNumber || 1,
                skin: 'yahei', //加载内置皮肤，也可以直接赋值16进制颜色值，如:#c00
                groups: 5, //连续显示分页数
                jump: function (obj, first) {
                    if (!first) {
                        self.curr = obj.curr;
                        self.list(self.curr);
                    }
                }
            });
            // $('.public-main').hideLoading();         
        });    
    }
  	waitComment.search = function(){
	    var self = this;
	    self.list(1);
    }

    waitComment.view = function(){
        $(document).on("click",".view-all",function(){
	    var self = this;
            var conText = ($(this).parents('tr').find(".t2 p.name").text());
            
            $(".public-mask").show();
            $(".public-box").show();

            $(".content-party").text(conText);
         });
    } 
    waitComment.calcel = function(){
     
        $(document).on("click",".cancel",function(){
            var self = this;
            layer.confirm("确定删除本条数据？",function(){
                var id = $(self).parents('tr').data('id'); 
                console.log('cancel---'+id);
		var approveDeleteUrl = reqConfig.getInterface('approveDelete');
                $.ajax({
                    url:approveDeleteUrl,
                    type:'post',
                    dataType:'json',
                    data:{
                        id:id
                    }
                }).done(function (data) {

                      console.log('删除通过');
                        // 刷新列表  
                      waitComment.list();   
                      $('.layui-layer-shade').hide();
                      $('.layui-layer').hide();
                }); 
                  
		    }); 
        });
    } 
    waitComment.pass = function(){
    	$(document).on("click",".pass",function(){
            var self = this;
            var currentStatus = $(self).data("status"); 
		 	var id = $(self).parents('tr').data('id'); 
            var approvePassUrl = reqConfig.getInterface('approvePass');
            if(currentStatus == 2){
                layer.confirm("确定撤销这条数据？",function(){
                    $.ajax({
                        url:approvePassUrl,
                        type:'post',
                        dataType:'json',
                        data:{
                            id:id,
                            approveStatus:1
                        }
                    }).done(function (data) {
                        $(self).text('审核通过');
                        $(self).data("status","1");
                        $(self).parents('tr').find('h2 span').removeClass('checkpass').addClass('checking').text('审核中');
                        $('.layui-layer-shade').hide();
                        $('.layui-layer').hide();     
                    });
                });
            }else{
                $.ajax({
                    url:approvePassUrl,
                    type:'post',
                    dataType:'json',
                    data:{
                        id:id,
                        approveStatus:2
                    }
                }).done(function (data) {
                    layer.alert("审核通过.");
                    $(self).text('取消审核');
                    $(self).data("status","2"); 
                    $(self).parents('tr').find('h2 span').removeClass('checking').addClass('checkpass').text('审核通过');   
                });
            }
		 });
    }

    waitComment.closeBox=function(){
		 $(document).on("click","#_close_box",function(){
		 	$(".public-mask").hide();
		 	$(".public-box").hide();
		 });
		  $(document).on("click","#_close_button",function(){
		 	$(".public-mask").hide();
		 	$(".public-box").hide();
		 });
	}

    module.exports = waitComment;

 })($);



