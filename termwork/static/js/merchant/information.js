$(function () {
    $.post({
        url: "http://127.0.0.1:5000/modifyBusinessInfo",
        contentType: "application/json",
        data: JSON.stringify(),
        /* 接收 nickname introduction */
        success: function (response) {
            var get_data = JSON.parse(response)
            $('#nickname').val(get_data[0].nickname)
            $('#introduction').val(get_data[0].introduction)
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    $('#confirmButton').on('click', function () {
        var nickname = $('#nickname').val()
        var introduction = $('#introduction').val()
        var password1 = $('#password1').val()
        var password2 = $('#password2').val()
        if (password1 != password2 || password1 == "") {
            alert("illegal password!")
            $('#password1').val("")
            $('#password2').val("")
        }
        else {
            $.post({
                url: "http://127.0.0.1:5000/changeBusinessInfo",
                contentType: "application/json",
                data: JSON.stringify({
                    nickname: nickname,
                    introduction: introduction,
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