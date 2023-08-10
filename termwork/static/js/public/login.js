$(function () {
    $('#loginButton').on('click', function () {
        data = {
            username: $("[name='userAccount']").val(),
            password: $("[name='userPassword']").val()
        }
        $.post({
            url:"http://127.0.0.1:5000/login",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response){
                //失败需要错误信息，成功需要新网页
                if(response == "error"){
                    alert("用户名或密码错误!")
                    $("[name='userAccount']").val("")
                    $("[name='userPassword']").val("")
                }
                else{
                    if(response == "customer")
                        window.open("http://127.0.0.1:5000/customer","_self")
                    else if(response == "merchant")
                        window.open("http://127.0.0.1:5000/merchant","_self")
                    else
                        window.open("http://127.0.0.1:5000/admin","_self")
                }
            },
            error: (response)=>{
                alert("Connection error")
            },
        })
    })
    $('#registerButton').on('click', function(){
        window.open("http://127.0.0.1:5000/getNewUser","_self")
    })
})