$(function () {
    $('button').on('click', function (event) {
        var username = $("[name='userName']").val()
        var password1 = $("[name='userPassword1']").val()
        var password2 = $("[name='userPassword2']").val()
        var element = $(event.target)
        var category = element.attr('id')
        /*两次输入的密码不同*/
        if (password1 != password2 || password1 == "") {
            alert("illegal password!")
            $("[name='userPassword1']").val("")
            $("[name='userPassword2']").val("")
        }
        else {
            data = {
                username: username,
                password: password1,
                category: category,
            }
            $.post({
                url: "http://127.0.0.1:5000/register",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    //需要信息判断成功或失败
                    if(response == "success"){
                        alert("注册成功!")
                        $("[name='userName']").val("")
                        $("[name='userPassword1']").val("")
                        $("[name='userPassword2']").val("")
                    }
                    else{
                        alert("注册失败!该用户名已被占用")
                        $("[name='userName']").val("")
                        $("[name='userPassword1']").val("")
                        $("[name='userPassword2']").val("")
                    }
                },
                error: (response) => {
                    alert("Connection error")
                },
            })
        }
    })
})