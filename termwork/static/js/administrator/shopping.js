$(function () {
    $('#searchButton').on('click', function () {
        send_data = {
            fun: $("[name='funType'] option:selected").text(),
            type: $("[name='pageType'] option:selected").text(),
        }
        /*
            fun == '管理' type == '商品' 时，需要全部已上架的商品信息+店铺名称
            fun == '管理' type == '店铺' 时，需要全部店铺信息+店铺状态+店铺昵称
            fun == '审核' type == '商品' 时，需要全部审核中的商品信息+店铺名称
        */
        $.post({
            url: "http://127.0.0.1:5000/adminWishData",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (response) {
                minNo = 0
                maxNo = 4
                var get_data = JSON.parse(response)
                data = []
                totalNo = 0
                keyword = $("#searchInfo").val()
                if (send_data.fun == '管理' && send_data.type == '商品') {
                    $('#shopList').empty()
                    $('#auditList').empty()
                    category = $("#itemType option:selected").text()
                    get_data.forEach(element => {
                        if (category == "所有" || element.category == category) {
                            if (keyword == "" || element.introduction.includes(keyword) || element.id.includes(keyword) || element.name.includes(keyword) || element.nickname.includes(keyword)) {
                                totalNo = data.push(element)
                            }
                        }
                    });
                    showPage()
                }
                else if (send_data.fun == '管理' && send_data.type == '店铺') {
                    $('#auditList').empty()
                    $('#itemList').empty()
                    get_data.forEach(element => {
                        if (keyword == "" || element.introduction.includes(keyword) || element.nickname.includes(keyword)) {
                            totalNo = data.push(element)
                        }
                    });
                    showPage()
                }
                else if (send_data.fun == '审核' && send_data.type == '商品') {
                    $('#shopList').empty()
                    $('#itemList').empty()
                    category = $("#itemType option:selected").text()
                    get_data.forEach(element => {
                        if (category == "所有" || element.category == category) {
                            if (keyword == "" || element.introduction.includes(keyword) || element.id.includes(keyword) || element.name.includes(keyword) || element.nickname.includes(keyword)) {
                                totalNo = data.push(element)
                            }
                        }
                    });
                    showPage()
                }
                else if (send_data.fun == '审核' && send_data.type == '店铺'){
                    alert("暂无此功能")
                }
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 管理商品时 点击 下架 */
    $('#itemList').on('click', '.underButton', function () {
        res = confirm("确认下架？")
        if (res == true) {
            var commodityId = $(this).closest('#item_1').find('.itemID').text()
            $.post({
                url: "http://127.0.0.1:5000/offTheShelf",
                contentType: "application/json",
                data: JSON.stringify({ id: commodityId }),
                success: function (response) {
                    $("#searchButton").click()
                },
                error: (req) => {
                    alert("Connection error")
                },
            })
        }
    })
    /* 管理店铺时 点击 切换 */
    $('#shopList').on('click', '.switchButton', function () {
        var businessId = $(this).closest('#shop_1').find('.shopID').text()
        var state = ""
        if ($(this).closest('#shop_1').find('.shopState').text() == "正常")
            state = "异常"
        else
            state = "正常"
        $.post({
            url: "http://127.0.0.1:5000/switchState",
            contentType: "application/json",
            data: JSON.stringify({ username: businessId, state: state }),
            success: function (response) {
                $("#searchButton").click()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 审核商品时 点击 审核通过 */
    $('#auditList').on('click', '.yesButton', function () {
        var commodityId = $(this).closest('#audit_1').find('.itemID').text()
        $.post({
            url: "http://127.0.0.1:5000/reviewResult",
            contentType: "application/json",
            data: JSON.stringify({ id: commodityId, state: '已上架' }),
            success: function (response) {
                $("#searchButton").click()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 审核商品时 点击 审核未通过 */
    $('#auditList').on('click', '.noButton', function () {
        var commodityId = $(this).closest('#audit_1').find('.itemID').text()
        $.post({
            url: "http://127.0.0.1:5000/reviewResult",
            contentType: "application/json",
            data: JSON.stringify({ id: commodityId, state: '审核未通过' }),
            success: function (response) {
                $("#searchButton").click()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    /* 点击 管理订单 跳转页面 */
    $('#indent').on('click', function () {
        window.open("http://127.0.0.1:5000/orderForAdmin", "_blank")
    })
    /* 点击 修改信息 */
    $('#information').on("click", function () {
        window.open("http://127.0.0.1:5000/modifyAdminInfo", "_blank")
    })
    /* 点击 下一页 */
    $('#nextButton').on('click', function () {
        goToTop()
        if (maxNo < totalNo - 1) {
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
        if (send_data.fun == '管理' && send_data.type == '商品') {
            $('#itemList').empty()
            for (i = minNo; i < totalNo && i <= maxNo; i++) {
                $("#itemList").append(' <li id="item_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;\
                        <span class="itemName">'+ data[i].name + '</span><!--在此填充商品名称-->\
                    </p>\
                    <p>&nbsp;$&nbsp;\
                        <span class="itemPrice">'+ data[i].price + '</span><!--在此填充商品价格-->\
                    </p>\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="itemShop">'+ data[i].nickname + '</span><!--在此填店铺名称-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="itemID">'+ data[i].id + '</span><!--在此填充商品ID-->\
                    </p>\
                </div>\
                <div class="itemDetial clearfix">\
                    <p>'+ data[i].introduction + '</p><!--在此填充商品简介-->\
                </div>\
                <form action="" class="clearfix">\
                    <button class="underButton" type="button">&times;</button>\
                </form>\
            </li>')
            }
        }
        else if (send_data.fun == '管理' && send_data.type == '店铺') {
            $('#shopList').empty()
            for (i = minNo; i < totalNo && i <= maxNo; i++) {
                $("#shopList").append('<li id="shop_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="shopName">'+ data[i].nickname + '</span><!--在此填充店铺名称-->\
                    </p>\
                    <p>&nbsp;O&nbsp;\
                        <span class="shopState">'+ data[i].state + '</span><!--在此填充店铺状态-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="shopID">'+ data[i].username + '</span><!--在此填充店铺ID-->\
                    </p>\
                </div>\
                <div class="shopDetial clearfix">\
                    <p>'+ data[i].introduction + '</p><!--在此填充店铺简介-->\
                </div>\
                <form action="" class="clearfix">\
                    <button class="switchButton" type="button">⇄</button>\
                </form>\
            </li>')
            }
        }
        else if (send_data.fun == '审核' && send_data.type == '商品') {
            $('#auditList').empty()
            for (i = minNo; i < totalNo && i <= maxNo; i++) {
                $("#auditList").append('<li id="audit_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;\
                        <span class="itemName">'+ data[i].name + '</span><!--在此填充商品名称-->\
                    </p>\
                    <p>&nbsp;$&nbsp;\
                        <span class="itemPrice">'+ data[i].price + '</span><!--在此填充商品价格-->\
                    </p>\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="itemShop">'+ data[i].nickname + '</span><!--在此填店铺名称-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="itemID">'+ data[i].id + '</span><!--在此填充商品ID-->\
                    </p>\
                </div>\
                <div class="itemDetial clearfix">\
                    <p>'+ data[i].introduction + '</p><!--在此填充商品简介-->\
                </div>\
                <form action="" class="clearfix">\
                    <button class="noButton" type="button">&times;</button>\
                    <button class="yesButton" type="button">v</button>\
                </form>\
            </li>')
            }
        }
    }
    $("[name='pageType']").bind("change", function () {
        switchType()
    })
    switchType()
    function switchType() {
        if ($("[name='pageType'] option:selected").text() == "商品") {
            $('#itemType').show()
        }
        else {
            $('#itemType').hide()
        }
    }
})