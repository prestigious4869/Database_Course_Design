$(function () {
    $.post({
        url: "http://127.0.0.1:5000/checkCart",
        contentType: "application/json",
        data: JSON.stringify(),
        /* 返回cart中用户的商品的全部信息
            +commodity中商品commodity_id对应的name,price,number,business_username
            +vip中用户id对应的,spend
            +account中business_username对应的nickname
            +vip_system中business_username对应的discount_ladder,cost_ladder
        */
        success: function (response) {
            var get_data = JSON.parse(response)
            get_data.forEach(element => {
                var commodity_name = element.name
                var commodity_price = element.price
                var business_nickname = element.nickname
                var commodity_id = element.commodity_id
                var discount_ladder = element.discount_ladder.split('-')
                var cost_ladder = element.cost_ladder.split('-')
                var spend = parseFloat(element.spend)
                var discount = 1
                for (i = 0; i < discount_ladder.length; i++) {
                    if (spend >= cost_ladder[i])
                        discount = parseFloat(discount_ladder[i])
                }
                $("#itemList").append('<li id="item_1">\
                <div class="itemImage clearfix">!</div>\
                <div class="itemInfo clearfix">\
                    <p>&nbsp;\
                        <span class="itemName">'+ commodity_name + '</span><!--在此填充商品名称-->\
                    </p>\
                    <p>&nbsp;$&nbsp;\
                        <span class="itemPrice">'+ commodity_price + '</span><!--在此填充商品价格-->\
                    </p>\
                    <p>&nbsp;%&nbsp;\
                        <span class="itemDiscount">'+ discount + '</span><!--在此填充订单商品折扣-->\
                    </p>\
                    <p>&nbsp;&copy;&nbsp;\
                        <span class="itemShop">'+ business_nickname + '</span><!--在此填店铺名称-->\
                    </p>\
                    <p>&nbsp;#&nbsp;\
                        <span class="itemID">'+ commodity_id + '</span><!--在此填充商品ID-->\
                    </p>\
                    <p>&nbsp;=&nbsp;\
                    <span class="itemNumber">'+ element.number + '</span><!--在此填充商品剩余-->\
                    </p>\
                </div>\
                <form action="" class="clearfix">\
                    <input value="1" onfocus="if (value ==\'1\'){value =\'\'}" onblur="if (value ==\'\'){value=\'1\'}" onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,\'\')}else{this.value=this.value.replace(/\\D/g,\'\')}" type="text" name="itemNum" id="" class="itemNum">\
                    <button class="deleteButton" type="button">&times;</button>\
                </form>\
            </li>')
            });
            calculatePrice()
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    $('body').on('click', '.deleteButton', function () {
        send_data = {
            commodity_id: $(this).closest('#item_1').find('.itemID').text()
        }
        $.post({
            url: "http://127.0.0.1:5000/deleteFromCart",
            contentType: "application/json",
            data: JSON.stringify(send_data),
            success: function (response) {
                alert("删除成功")
                window.location.reload()
            },
            error: (req) => {
                alert("Connection error")
            },
        })
    })
    $('#checkButton').on('click', function () {
        send_data = []
        $('#itemList li').each(function (i, n) {
            var num = parseInt($(this).closest('#item_1').find('.itemNumber').text())
            if (num <= 0) {
                alert("请删除库存不足的商品")
            }
            else {
                var totalPrice = parseInt($(n).find('.itemNum').val()) * parseFloat($(n).closest('#item_1').find('.itemPrice').text()) * parseFloat($(n).closest('#item_1').find('.itemDiscount').text())
                var data = {
                    commodity_id: $(n).find('.itemID').text(),
                    name: $(n).find('.itemName').text(),
                    price: $(n).find('.itemPrice').text(),
                    number: $(n).find('.itemNum').val(),
                    discount: $(n).find('.itemDiscount').text(),
                    totalPrice: totalPrice
                }
                send_data.push(data)
            }
        });
        /*
            需要手动添加business_username
            之后修改order,vip,commodity,cart
        */
        // for x in get_data:
        //     1.找business_username
        //     2.插入order(spend和totalPrice需要强制转换为float)
        //     3.修改commodity中的number和sale(number和sale和发的number需要强制转换为int)
        //     4.修改vip
        //     5.cart需要flag=0
        if (send_data.length != 0) {
            $.post({
                url: "http://127.0.0.1:5000/createOrder",
                contentType: "application/json",
                data: JSON.stringify(send_data),
                success: function (response) {
                    alert("提交成功")
                    window.location.reload()
                },
                error: (req) => {
                    alert("Connection error")
                },
            })
        }
    })
    $("body").on("input propertychange", ".itemNum", function () {
        var num = parseInt($(this).closest('#item_1').find('.itemNumber').text())
        if (parseInt($(this).val()) > num) {
            $(this).val('1')
            alert("数量超限")
        }
        calculatePrice()
    });
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
    function calculatePrice() {
        totalPrice = 0
        $('#itemList li').each(function (i, n) {
            var number = 1
            if ($(n).find('.itemNum').val() != '')
                number = parseInt($(n).find('.itemNum').val())
            var discount = parseFloat($(n).find('.itemDiscount').text())
            var price = parseFloat($(n).find('.itemPrice').text())
            totalPrice = totalPrice + number * discount * price
        });
        $('#totalPrice').text(totalPrice)
    }
})