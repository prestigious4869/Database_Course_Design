$(function(){
    /* 点击 查询 */
    $('#searchButton').on("click", function(){
        type=$("#pageType option:selected").text()
        $.post({
            url:"http://127.0.0.1:5000/customer",
            contentType: "application/json",
            data: JSON.stringify({type:type}),
            success: function(response){
                /*返回商品信息+店铺名称，添加符合条件的商品信息*/
                minNo = 0
                maxNo = 4
                var get_data = JSON.parse(response)
                data = []
                totalNo = 0
                if(type=="商品"){
                    category=$("#itemType option:selected").text()
                    priceMin=$("[name='priceMin']").val()
                    priceMax=$("[name='priceMax']").val()
                    keyword=$("#searchInfo").val()
                    get_data.forEach(element => {
                        if (category == "所有" || element.category == category) {
                            if (priceMin == "" || parseFloat(element.price) >= parseFloat(priceMin)) {
                                if (priceMax == "" || parseFloat(element.price) <= parseFloat(priceMax)) {
                                    if (keyword == "" || element.introduction.includes(keyword) || element.id.includes(keyword) || element.name.includes(keyword) || element.nickname.includes(keyword)) {
                                        totalNo = data.push(element)
                                    }
                                }
                            }
                        }
                    });
                    showPage()
                }
                /*返回店铺信息 + 店铺简介，添加符合条件的店铺信息*/
                else if(type == "店铺"){
                    keyword=$("#searchInfo").val()
                    get_data.forEach(element => {
                        if (keyword == "" || element.introduction.includes(keyword) || element.username.includes(keyword) || element.nickname.includes(keyword)) {
                            totalNo = data.push(element)
                        }
                    });
                    showPage()
                }
            },
            error: (req)=>{
                alert("Connection error")
            },
        })
    })
    /* 点击 查看商铺 */
    $('body').on("click",'.visitButton', function(){
        send_data = {
            username: $(this).closest('#shop_1').find('.shopID').text()
        }
        window.open("http://127.0.0.1:5000/specifiedBusiness", "_blank")
    })
    /* 点击 添加购物车 */
    $('body').on("click", '.addButton',function(){
        id=$(this).closest("#item_1").find(".itemID").text()
        $.post({
            /* 如果有但flag=0 则置flag=1 */
            url: "http://127.0.0.1:5000/addToCart",
            contentType: "application/json",
            data: JSON.stringify({commodity_id: id}),
            success: function (response) {
                alert("添加成功")
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 点击 查看购物车 */
    $('#wish').on("click", function(){
        window.open("http://127.0.0.1:5000/checkCart", "_blank")
    })
    /* 点击 订单查询 */
    $('#indent').on("click", function(){
        window.open("http://127.0.0.1:5000/orderForCustomer", "_blank")
    })
    /* 点击 修改信息 */
    $('#information').on("click", function(){
        window.open("http://127.0.0.1:5000/modifyCustomerInfo", "_blank")
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
        if(type == "商品"){
            $('#itemList').empty()
            for (i = minNo; i < totalNo && i <= maxNo; i++){
                $("#itemList").append('<li id="item_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;\
                        <span class="itemName">'+data[i].name+'</span><!--在此填充商品名称-->\
                    </p>\
                    <p>&nbsp;$&nbsp;\
                        <span class="itemPrice">'+data[i].price+'</span><!--在此填充商品价格-->\
                    </p>\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="itemShop">'+data[i].nickname+'</span><!--在此填店铺名称-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="itemID">'+data[i].id+'</span><!--在此填充商品ID-->\
                    </p>\
                </div>\
                <div class="itemDetial clearfix">\
                    <p>'+data[i].introduction+'</p><!--在此填充商品简介-->\
                </div>\
                <form action="" class="clearfix">\
                    <button class="addButton" type="button">+</button>\
                </form>\
            </li>')
            }
        }
        else if(type == "店铺"){
            $('#shopList').empty()
            for (i = minNo; i < totalNo && i <= maxNo; i++){
                $('#shopList').append('<li id="shop_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="shopName">'+data[i].nickname+'</span><!--在此填充店铺名称-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="shopID">'+data[i].username+'</span><!--在此填充店铺ID-->\
                    </p>\
                </div>\
                <div class="shopDetial clearfix">\
                    <p>'+data[i].introduction+'</p><!--在此填充店铺简介-->\
                </div>\
                <form action="" class="clearfix">\
                    <button class="visitButton" type="button">></button>\
                </form>\
            </li>')
            }
        }
    }
    /*下为切换店铺和商品时显示特定标签*/
    switchType()
    $("#pageType").bind("change",function(){
        switchType()
    })
    function switchType(){
        if ($("#pageType option:selected").text() == "商品"){
            $("#itemType").show()
            $('[name="priceMin"]').show()
            $("#priceSymbol").show()
            $('[name="priceMax"]').show()
            $("#itemList").show()
            $("#shopList").hide()
            $('#itemList').empty()
        }
        else{
            $("#itemType").hide()
            $('[name="priceMin"]').hide()
            $("#priceSymbol").hide()
            $('[name="priceMax"]').hide()
            $("#itemList").hide()
            $("#shopList").show()
            $('#shopList').empty()
        }
    }
})