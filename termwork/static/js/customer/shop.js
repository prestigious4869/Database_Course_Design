$(function () {
    send_data = window.opener.send_data
    $.post({
        url: "http://127.0.0.1:5000/specifiedBusiness",
        contentType: "application/json",
        data: JSON.stringify(send_data),
        success: function (response) {
            get_data = JSON.parse(response)
            $('#shopName').text(get_data[0].nickname)
            $('#shopID').text(get_data[0].username)
            $('#shopDetial').text(get_data[0].introduction)
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    $('body').on('click', '#searchButton', function () {
        $.post({
            url: "http://127.0.0.1:5000/specifiedBusinessCommodity",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (response) {
                /* 需要获得这家店铺的全部商品信息(已上架) */
                minNo = 0
                maxNo = 4
                var get_data = JSON.parse(response)
                data = []
                totalNo = 0
                category = $("#itemType option:selected").text()
                priceMin = $("[name='priceMin']").val()
                priceMax = $("[name='priceMax']").val()
                keyword = $("#searchInfo").val()
                get_data.forEach(element => {
                    if (category == "所有" || element.category == category) {
                        if (priceMin == "" || parseFloat(element.price) >= parseFloat(priceMin)) {
                            if (priceMax == "" || parseFloat(element.price) <= parseFloat(priceMax)) {
                                if (keyword == "" || element.introduction.includes(keyword) || element.id.includes(keyword) || element.name.includes(keyword)) {
                                    totalNo = data.push(element)
                                }
                            }
                        }
                    }
                });
                showPage()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 点击 添加购物车 */
    $('body').on("click", '.addButton',function(){
        id=$(this).closest("#item_1").find(".itemID").text()
        $.post({
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
    $('#wish').on("click", function () {
        window.open("http://127.0.0.1:5000/checkCart", "_blank")
    })
    /* 点击 订单查询 */
    $('#indent').on("click", function () {
        window.open("http://127.0.0.1:5000/orderForCustomer", "_blank")
    })
    /* 点击 修改信息 */
    $('#information').on("click", function () {
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
    function showPage() {
        $('#itemList').empty()
        for (i = minNo; i < totalNo && i <= maxNo; i++) {
            $("#itemList").append('<li id="item_1">\
            <div class="itemImage clearfix">!</div>\
            <div class="itemInfo clearfix">\
                <p>&nbsp;\
                    <span class="itemName">'+ data[i].name + '</span><!--在此填充商品名称-->\
                </p>\
                <p>&nbsp;$&nbsp;\
                    <span class="itemPrice">'+ data[i].price + '</span><!--在此填充商品价格-->\
                </p>\
                <p>&nbsp;#&nbsp;\
                    <span class="itemID">'+ data[i].id + '</span><!--在此填充商品ID-->\
                </p>\
            </div>\
            <div class="itemDetial clearfix">\
                <p>'+ data[i].introduction + '</p><!--在此填充商品简介-->\
            </div>\
            <form action="" class="clearfix">\
                <button class="addButton" type="button">+</button>\
            </form>\
        </li>')
        }
    }
})