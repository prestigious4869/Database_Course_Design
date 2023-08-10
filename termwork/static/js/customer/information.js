$(function(){
    /* 和管理员的应该一样 */
    $.post({
        url: "http://127.0.0.1:5000/modifyAdminInfo",
        contentType: "application/json",
        data: JSON.stringify(),
        /* 返回account中这个人的信息 */
        success: function (response) {
            var get_data = JSON.parse(response)
            $('#nickname').val(get_data[0].nickname)
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    $('#confirmButton').on('click', function () {
        var nickname = $('#nickname').val()
        var password1 = $('#password1').val()
        var password2 = $('#password2').val()
        if (password1 != password2 || password1 == "") {
            alert("illegal password!")
            $('#password1').val("")
            $('#password2').val("")
        }
        else {
            $.post({
                url: "http://127.0.0.1:5000/changeAdminInfo",
                contentType: "application/json",
                data: JSON.stringify({
                    nickname: nickname,
                    password: password1,
                }),
                success: function (response) {
                    alert("修改成功!")
                },
                error: (req) => {
                    alert("Connection error")
                },
            })
        }
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
})