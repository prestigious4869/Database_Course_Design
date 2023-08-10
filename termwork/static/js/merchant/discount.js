$(function () {
    $.post({
        url: "http://127.0.0.1:5000/vipDiscount",
        contentType: "application/json",
        data: JSON.stringify(),
        /* 获取 cost_ladder discount_ladder */
        success: function (response) {
            var get_data = JSON.parse(response)
            var money = get_data[0].cost_ladder.split('-')
            var discount = get_data[0].discount_ladder.split('-')
            for(i=0;i<money.length;i++){
                $('#money'+i).attr('placeholder', money[i])
                $('#discount'+i).attr('placeholder', discount[i])
            }
        },
        error: (req) => {
            alert("Connection error")
        },
    })
    $('#confirmButton').on('click',function(){
        var money=[]
        var discount=[]
        var len = 0
        for(i=0;i<3;i++){
            if($('#money'+i).val() == ""){
                $('#money'+i).val($('#money'+i).attr('placeholder'))
            }
            if($('#discount'+i).val() == ""){
                $('#discount'+i).val($('#discount'+i).attr('placeholder'))
            }
            len = money.push($('#money'+i).val())
            discount.push($('#discount'+i).val())
        }
        var cost_ladder = ""
        var discount_ladder = ""
        for(i=0;i<len;i++){
            cost_ladder = cost_ladder + money[i]
            discount_ladder = discount_ladder + discount[i]
            if(i != len-1){
                cost_ladder = cost_ladder + '-'
                discount_ladder = discount_ladder + '-'
            }
        }
        $.post({
            url: "http://127.0.0.1:5000/changeVipDiscount",
            contentType: "application/json",
            data: JSON.stringify({
                cost_ladder: cost_ladder,
                discount_ladder: discount_ladder,
            }),
            success: function (response) {
                alert("修改成功")
            },
            error: (req) => {
                alert("Connection error")
            },
        })
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