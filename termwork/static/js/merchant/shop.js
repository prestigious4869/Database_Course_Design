$(function () {
    /* 发送请求获取商家信息 */
    $.post({
        url: "http://127.0.0.1:5000/getBusinessInfo",
        contentType: "application/json",
        data: JSON.stringify(),
        success: function (response) {
            /* 获取店铺状态、店铺简介 */
            var shop = JSON.parse(response)
            $("#shopState").text(shop[0].state)
            $("#shopDetial").find("p").text(shop[0].introduction)
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    /* 点击 检索 发送请求获取商家的商品信息 */
    $('body').on('click', '#searchButton', function () {
        $.post({
            url: "http://127.0.0.1:5000/getBusinessCommodity",
            contentType: "application/json",
            data: JSON.stringify(),
            success: function (response) {
                /* 需要获得这家店铺的全部商品信息 */
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
                                if (keyword == "" || element.introduction.includes(keyword) || element.id.includes(keyword) || element.name.includes(keyword) || element.state.includes(keyword)) {
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
    /* 点击 添加 增加一个新的商品<li> */
    $('body').on('click', '#addButton', function () {
        var state = $('#shopState').text()
        if (state == "正常") {
            $("#itemList").append('<li id="item_1">\
            <div class="clearfix">\
                <div class="itemImage clearfix">!</div>\
                <form action="" class="itemKind clearfix">\
                    <select name="itemType" id="itemType">\
                        <option value="food">食物</option>\
                        <option value="electrical">电器</option>\
                        <option value="clothes">服装</option>\
                        <option value="medicine">医药</option>\
                        <option value="other" selected>其他</option>\
                    </select>\
                </form>\
            </div>\
            <div class="itemInfo clearfix">\
                <p>&nbsp;</p>\
                <p>&nbsp;$&nbsp;</p>\
                <p>&nbsp;O&nbsp;</p>\
                <p>&nbsp;N&nbsp;</p>\
                <p>&nbsp;#&nbsp;</p>\
            </div>\
            <form action="" class="itemContent clearfix">\
                <input type="text" class="itemName" placeholder=""><!--在placeholder填充商品名称-->\
                <input type="text" class="itemPrice" placeholder=""><!--在placeholder填充商品价格-->\
                <input type="text" class="itemState" placeholder="已下架" readonly><!--在placeholder填充商品状态-->\
                <input type="text" class="itemNum" placeholder=""><!--在placeholder填充商品数量-->\
                <input type="text" class="itemID" placeholder="" readonly><!--在placeholder填充商品ID-->\
            </form>\
            <form class="itemDetial clearfix">\
                <!-- <input type="text" placeholder=""> -->\
                <textarea name="" id="introduction" cols="30" rows="10" placeholder=""></textarea><!--在placeholder填充商品描述-->\
            </form>\
            <form action="" class="buttonBlock clearfix">\
                <button class="changeButton" type="button">&equiv;</button>\
                <button class="deleteButton" type="button">&times;</button>\
            </form>\
        </li>')
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
    })
    /* 点击 删除 将已上架的商品下架 将审核中/审核未通过/已下架的商品删除 将新商品删除 */
    $('body').on('click', '.deleteButton', function () {
        var state = $('#shopState').text()
        if (state == "正常") {
            var ifnew = $(this).closest('#item_1').find('.itemID').attr('placeholder')
            var message = confirm('确认删除？')
            if (message == true) {
                var state = $(this).closest('#item_1').find('.itemState').attr('placeholder')
                if (ifnew == "") {
                    $(this).closest('#item_1').remove()
                }
                else if (state == '已上架') {
                    var commodityId = $(this).closest('#item_1').find('.itemID').attr('placeholder')
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
                else {
                    var commodityId = $(this).closest('#item_1').find('.itemID').attr('placeholder')
                    $.post({
                        url: "http://127.0.0.1:5000/deleteCommodity",
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
            }
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
    })
    /* 点击 提交 将已上架/已下架/审核中/审核未通过的商品提交审核 将新商品提交审核 */
    $('body').on('click', '.changeButton', function () {
        var state = $('#shopState').text()
        if (state == "正常") {
            var ifnew = $(this).closest('#item_1').find('.itemID').attr('placeholder')
            var state = $(this).closest('#item_1').find('.itemState').attr('placeholder')
            var category = $(this).closest('#item_1').find("#itemType option:selected").text()
            if ($(this).closest('#item_1').find('.itemName').val() == "")
                $(this).closest('#item_1').find('.itemName').val($(this).closest('#item_1').find('.itemName').attr('placeholder'))
            if ($(this).closest('#item_1').find('.itemPrice').val() == "")
                $(this).closest('#item_1').find('.itemPrice').val($(this).closest('#item_1').find('.itemPrice').attr('placeholder'))
            if ($(this).closest('#item_1').find('.itemNum').val() == "")
                $(this).closest('#item_1').find('.itemNum').val($(this).closest('#item_1').find('.itemNum').attr('placeholder'))
            var name = $(this).closest('#item_1').find('.itemName').val()
            var price = parseFloat($(this).closest('#item_1').find('.itemPrice').val())
            var number = parseInt($(this).closest('#item_1').find('.itemNum').val())
            var id = $(this).closest('#item_1').find('.itemID').attr('placeholder')
            var introduction = $(this).closest('#item_1').find('#introduction').val()
            var send_data = {
                category: category,
                name: name,
                price: price,
                number: number,
                introduction: introduction,
            }
            /* 新商品 */
            if (ifnew == "") {
                var message1 = confirm('确认上架？')
                if (message1 == true) {
                    /* 发送请求 新商品加入commodity中 */
                    $.post({
                        url: "http://127.0.0.1:5000/newCommodityForReview",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (response) {
                        },
                        error: (req) => {
                            alert("Connection error")
                        },
                    })
                }
            }
            /* 旧商品 */
            else {
                var message2 = confirm('请确认信息无误，并点击确认')
                if (message2 == true) {
                    send_data.id = id
                    /* 发送请求 修改commodity中的值 */
                    $.post({
                        url: "http://127.0.0.1:5000/oldCommodityForReview",
                        contentType: "application/json",
                        data: JSON.stringify(send_data),
                        success: function (response) {
                            $("#searchButton").click()
                        },
                        error: (req) => {
                            alert("Connection error")
                        },
                    })
                }
            }
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
    })
    /* 点击 订单查询 跳转页面 */
    $('#indent').on('click', function () {
        var state = $('#shopState').text()
        if (state == "正常"){
            window.open("http://127.0.0.1:5000/orderForBusiness", "_blank")
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
    })
    /* 点击 会员折扣 跳转页面 */
    $('#discount').on('click', function () {
        var state = $('#shopState').text()
        if (state == "正常"){
            window.open("http://127.0.0.1:5000/vipDiscount", "_blank")
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
    })
    /* 点击 修改信息 跳转页面 */
    $('#information').on('click', function () {
        var state = $('#shopState').text()
        if (state == "正常"){
            window.open("http://127.0.0.1:5000/modifyBusinessInfo", "_blank")
        }
        else {
            alert('您的状态异常，无法使用此功能，请联系管理员解决')
        }
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
        $('#itemList').empty()
        for (i = minNo; i < totalNo && i <= maxNo; i++) {
            if (data[i].category == '食物')
                option = ' <option value="food" selected>食物</option><option value="electrical">电器</option>\<option value="clothes">服装</option>\<option value="medicine">医药</option>\<option value="other">其他</option>'
            else if (data[i].category == '电器')
                option = ' <option value="food">食物</option><option value="electrical" selected>电器</option>\<option value="clothes">服装</option>\<option value="medicine">医药</option>\<option value="other">其他</option>'
            else if (data[i].category == '服装')
                option = ' <option value="food">食物</option><option value="electrical">电器</option>\<option value="clothes" selected>服装</option>\<option value="medicine">医药</option>\<option value="other">其他</option>'
            else if (data[i].category == '医药')
                option = ' <option value="food">食物</option><option value="electrical">电器</option>\<option value="clothes">服装</option>\<option value="medicine" selected>医药</option>\<option value="other">其他</option>'
            else if (data[i].category == '其他')
                option = ' <option value="food">食物</option><option value="electrical">电器</option>\<option value="clothes">服装</option>\<option value="medicine">医药</option>\<option value="other" selected>其他</option>'
            $("#itemList").append('<li id="item_1">\
                <div class="clearfix">\
                    <div class="itemImage clearfix">!</div>\
                    <form action="" class="itemKind clearfix">\
                        <select name="itemType" id="itemType">\
                            '+ option + '\
                        </select>\
                    </form>\
                </div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;</p>\
                    <p>&nbsp;$&nbsp;</p>\
                    <p>&nbsp;O&nbsp;</p>\
                    <p>&nbsp;N&nbsp;</p>\
                    <p>&nbsp;#&nbsp;</p>\
                </div>\
                <form action="" class="itemContent clearfix">\
                    <input type="text" class="itemName" placeholder="'+ data[i].name + '"><!--在placeholder填充商品名称-->\
                    <input type="text" class="itemPrice" placeholder="'+ data[i].price + '"><!--在placeholder填充商品价格-->\
                    <input type="text" class="itemState" placeholder="'+ data[i].state + '" readonly><!--在placeholder填充商品状态-->\
                    <input type="text" class="itemNum" placeholder="'+ data[i].number + '"><!--在placeholder填充商品数量-->\
                    <input type="text" class="itemID" placeholder="'+ data[i].id + '" readonly><!--在placeholder填充商品ID-->\
                </form>\
                <form class="itemDetial clearfix">\
                    <!-- <input type="text" placeholder=""> -->\
                    <textarea name="" id="introduction" cols="30" rows="10" placeholder="">'+ data[i].introduction + '</textarea><!--在placeholder填充商品描述-->\
                </form>\
                <form action="" class="buttonBlock clearfix">\
                    <button class="changeButton" type="button">&equiv;</button>\
                    <button class="deleteButton" type="button">&times;</button>\
                </form>\
            </li>')
        }
    }
})