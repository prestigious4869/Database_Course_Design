$(function(){
    $('#searchButton').on('click', function(){
        $.post({
            url: "http://127.0.0.1:5000/orderForBusiness",
            contentType: "application/json",
            data: JSON.stringify(),
            /* 取到这个商家的全部订单 + 用户nickname */
            success: function (response) {
                minNo = 0
                maxNo = 4
                var get_data = JSON.parse(response)
                data = []
                totalNo = 0
                keyword = $("#searchInfo").val()
                get_data.forEach(element => {
                    if(keyword == "" || element.name.includes(keyword) || element.nickname.includes(keyword) || element.commit_time.includes(keyword))
                        totalNo = data.push(element)
                });
                showPage()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 点击 下一页 */
    $('#nextButton').on('click', function () {
        goToTop()
        if (maxNo < totalNo-1) {
            minNo = minNo + 5
            maxNo = maxNo + 5
            showPage()
        }
    })
    /* 点击 上一页 */
    $('#lastButton').on('click', function () {
        goToTop()
        if (minNo != 0) {
            minNo = minNo - 5
            maxNo = maxNo - 5
            showPage()
        }
    })
    function showPage(){
        $('#itemList').empty()
        for (i = minNo; i < totalNo && i <= maxNo; i++){
            totalPrice = parseFloat(data[i].number) * parseFloat(data[i].discount) * parseFloat(data[i].price)
            $("#itemList").append('<li id="item_1">\
            <div class="indentInfo1 clearfix">\
                <p>&nbsp;#&nbsp;\
                    <span class="indentID">'+data[i].id+'</span><!--在此填充订单ID-->\
                </p>\
                <p>&nbsp;date&nbsp;\
                    <span>'+data[i].commit_time+'</span><!--在此填充订单时间-->\
                </p>\
            </div>\
            <div class="indentInfo2 clearfix">\
                <p>&nbsp;\
                    <span>'+data[i].name+'</span><!--在此填充商品名称-->\
                </p>\
                <p>&nbsp;#&nbsp;\
                    <span>'+data[i].commodity_id+'</span><!--在此填充商品ID-->\
                </p>\
                <p>&nbsp;$&nbsp;\
                    <span>'+data[i].price+'</span><!--在此填充商品价格-->\
                </p>\
                <p>&nbsp;num&nbsp;\
                    <span>'+data[i].number+'</span><!--在此填充商品数量-->\
                </p>\
            </div>\
            <div class="indentInfo3 clearfix">\
                <p>&nbsp;@&nbsp;\
                    <span>'+data[i].nickname+'</span><!--在此填充顾客名称-->\
                </p>\
                <p>&nbsp;#&nbsp;\
                    <span>'+data[i].account_username+'</span><!--在此填充顾客ID-->\
                </p>\
                <p>&nbsp;%&nbsp;\
                    <span>'+data[i].discount+'</span><!--在此填充订单商品折扣-->\
                </p>\
                <p>&nbsp;total&nbsp;\
                    <span>'+totalPrice+'</span><!--在此填充订单总价-->\
                </p>\
            </div>\
        </li>')
        }
    }


    /* 点击 订单查询 跳转页面 */
    $('#indent').on('click', function () {
        window.open("http://127.0.0.1:5000/orderForBusiness","_blank")
    })
    /* 点击 会员折扣 跳转页面 */
    $('#discount').on('click', function () {
        window.open("http://127.0.0.1:5000/vipDiscount","_blank")
    })
    /* 点击 修改信息 跳转页面 */
    $('#information').on('click', function () {
        window.open("http://127.0.0.1:5000/modifyBusinessInfo","_blank")
    })
})