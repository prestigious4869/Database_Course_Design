import ctypes
import json
import pyodbc
import datetime
from flask import Flask, session, render_template, request
from flask_cors import CORS

app = Flask(__name__)
app.config["SECRET_KEY"] = "zwl"
CORS(app, resources=r'/*')
conn = pyodbc.connect(
    '''DRIVER={PostgreSQL Unicode};
    SERVER=114.116.240.253;
    PORT=8000;
    DATABASE=bupt2019211278;
    UID=bupt2019211278;
    PWD=bupt2019211278@''')
conn.autocommit = True


# -----------------------------------------public---------------------------------------------
@app.route('/exit', methods=['POST'])
def exit():
    session.pop('username')
    return "success"


@app.route('/publicInfo', methods=['POST'])
def publicInfo():
    cursor = conn.cursor()
    results=[]
    results.append({"username": session.get("username")})
    cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(session.get("username")))
    row = cursor.fetchone()
    results[0]["nickname"] = row.nickname
    return json.dumps(results)


@app.route('/', methods=['GET'])
def init():
    return render_template('public/login.html')


@app.route('/getNewUser', methods=['GET'])
def getNewUser():
    return render_template('public/register.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    cursor = conn.cursor()
    get_data = request.get_json()
    cursor.execute("select username from test.account where username = '{}' and flag=1".format(get_data["username"]))
    row = cursor.fetchone()
    if not row:
        cursor.execute("insert into test.account values('{}','{}','{}','{}','{}',{})".format(get_data["username"],
                                                                                             get_data["password"], '',
                                                                                             get_data["category"], '正常',
                                                                                             1))
        if get_data["category"] == "merchant":
            cursor.execute(
                "insert into test.business values('{}','{}',{})".format(get_data["username"], "", 1))
            cursor.execute(
                "insert into test.vip_system values('{}','1-1-1','100-200-300',{})".format(get_data["username"], 1))
        return "success"
    else:
        return "error"


@app.route('/login', methods=['POST'])
def login():
    cursor = conn.cursor()
    if request.method == 'POST':
        get_data = request.get_json()
        session["username"] = get_data["username"]
        cursor.execute(
            "select password from test.account where username = '{}' and flag = 1".format(get_data["username"]))
        row = cursor.fetchone()
        if not row:
            return "error"
        elif get_data["password"] == row.password:
            cursor.execute(
                "select category from test.account where username = '{}' and flag = 1".format(get_data["username"]))
            row = cursor.fetchone()
            return row.category
        else:
            return "error"


# ---------------------------------------------customer-----------------------------------------------------------


@app.route('/customer', methods=['GET', 'POST'])
def customer():
    cursor = conn.cursor()
    if request.method == 'POST':
        get_data = request.get_json()
        results = []
        if get_data['type'] == '商品':
            cursor.execute("select * from test.commodity where flag = 1 and state = '已上架' and number > 0")
            columns = [column[0] for column in cursor.description]            
            for row in cursor:
                results.append(dict(zip(columns, row)))
            for x in results:
                Business_username = x['business_username']
                cursor.execute(
                    "select nickname,state from test.account where username = '{}' and flag = 1".format(Business_username))
                row = cursor.fetchone()
                x['nickname'] = row.nickname
                x['business_state'] = row.state
            send_data=[]
            for x in results:
                if x['business_state'] == '正常':
                    send_data.append(x)
            return json.dumps(send_data)
        else:
            # account中category=merchant state=正常的 所有account信息加introduction
            cursor.execute("select * from test.account where flag = 1 and category = 'merchant' and state='正常'")
            columns = [column[0] for column in cursor.description]            
            for row in cursor:
                results.append(dict(zip(columns, row)))
            for x in results:
                Business_username = x['username']
                cursor.execute("select introduction from test.business where username = '{}' and flag = 1".format(Business_username))
                row = cursor.fetchone()
                x['introduction'] = row.introduction            
            return json.dumps(results)
    else:
        return render_template("/customer/shopping.html")


@app.route('/getShopInfo', methods=['POST', 'GET'])
def getShopInfo():
    cursor = conn.cursor()
    if request.method == 'POST':
        cursor.execute("select username,name,introduction from test.business where flag = 1")
        columns = [column[0] for column in cursor.description]
        results = []
        for row in cursor:
            results.append(dict(zip(columns, row)))
        return json.dumps(results)
    else:
        return render_template("/customer/shopInfo.html")


@app.route('/addToCart', methods=['POST'])
def addToCart():
    cursor = conn.cursor()
    get_data = request.get_json()
    cursor.execute("select * from test.cart where account_username = '{}' and commodity_id = '{}'".format(session.get("username"), get_data["commodity_id"]))
    row = cursor.fetchone()
    if row:
        cursor.execute("update test.cart set flag = 1 where account_username = '{}' and commodity_id = '{}'".format(session.get("username"), get_data["commodity_id"]))
    else:
        cursor.execute("insert into test.cart values('{}','{}',{})".format(session.get("username"), get_data["commodity_id"],1))
    return "success"


@app.route('/specifiedBusiness', methods=['GET','POST'])
def specifiedBusiness():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/customer/shop.html")
    else:
        get_data = request.get_json()
        results=[]
        cursor.execute("select * from test.account where username = '{}'".format(get_data["username"]))
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute("select introduction from test.business where username = '{}'".format(get_data["username"]))
            row = cursor.fetchone()
            x['introduction'] = row.introduction   
        return json.dumps(results)


@app.route('/orderForCustomer', methods=['GET', 'POST'])
def orderForCustomer():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/customer/indent.html")
    else:
        results = []
        cursor.execute(
            "select * from test.order where account_username = '{}' and flag = 1".format(session.get("username")))
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute(
                "select nickname from test.account where username = '{}' and flag = 1".format(x["business_username"]))
            row = cursor.fetchone()
            x["businessNickname"] = row.nickname
        return json.dumps(results)


@app.route('/modifyCustomerInfo', methods=['GET'])
def modifyCustomerInfo():
    return render_template("/customer/information.html")


@app.route('/specifiedBusinessCommodity', methods=['POST'])
def specifiedBusinessCommodity():
    cursor = conn.cursor()
    get_data = request.get_json()
    results=[]
    cursor.execute("select * from test.commodity where business_username ='{}' and flag = 1 and number > 0 and state = '已上架'".format(get_data["username"]))
    columns = [column[0] for column in cursor.description]
    for row in cursor:
        results.append(dict(zip(columns, row)))
    return json.dumps(results)


@app.route('/checkCart', methods=['GET','POST'])
def checkCart():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/customer/wish.html")
    else:
        results=[]
        cursor.execute("select * from test.cart where account_username = '{}' and flag = 1".format(session.get("username")))
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute("select name,price,number,business_username from test.commodity where flag = 1 and id = '{}'".format(x["commodity_id"]))
            row = cursor.fetchone()
            x["name"],x["price"],x["number"],x['business_username']=row.name,row.price,row.number,row.business_username
            cursor.execute("select spend from test.vip where flag = 1 and account_username = '{}' and business_username = '{}'".format(x["account_username"],x['business_username']))
            row = cursor.fetchone()
            if row:
                x["spend"]=row.spend
            else:
                x["spend"]="0"
            cursor.execute("select nickname from test.account where flag = 1 and username = '{}'".format(x["business_username"]))
            row = cursor.fetchone()
            x["nickname"]=row.nickname
            cursor.execute("select discount_ladder,cost_ladder from test.vip_system where flag = 1 and business_username = '{}'".format(x["business_username"]))
            row = cursor.fetchone()
            x["discount_ladder"],x["cost_ladder"]=row.discount_ladder,row.cost_ladder
        return json.dumps(results)


@app.route('/deleteFromCart', methods=['POST'])
def deleteFromCart():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.cart set flag = 0 where account_username = '{}' and commodity_id = '{}'".format(session.get("username"), get_data["commodity_id"]))
    return "success"


@app.route('/createOrder', methods=['POST'])
def createOrder():
    cursor = conn.cursor()
    get_data=request.get_json()
    for x in get_data:
        commodity_id=x["commodity_id"]
        cursor.execute("select business_username from test.commodity where id = '{}' and flag = 1".format(commodity_id))
        row = cursor.fetchone()
        business_username = row.business_username
        Id = ctypes.c_size_t(hash(datetime.datetime.now())).value
        number = int(x["number"])
        price = x["totalPrice"]
        submit_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute("insert into test.order values ('{}','{}','{}','{}','{}','{}',{},'{}','{}',1)".format(Id, session.get("username"),business_username, commodity_id, x["name"], x["price"], number, x["discount"], submit_time))
        cursor.execute("select number,sale from test.commodity where id = '{}'".format(commodity_id))
        row = cursor.fetchone()
        old_number,old_sale = row.number,row.sale
        new_number = old_number-number
        new_sale = old_sale+number
        cursor.execute("update test.commodity set number = {}, sale = {} where id = '{}'".format(new_number, new_sale, commodity_id))
        cursor.execute("select * from test.vip where account_username ='{}' and business_username = '{}'".format(session.get("username"),business_username))
        row = cursor.fetchone()
        if not row:
            cursor.execute("insert into test.vip values ('{}','{}','{}',1)".format(session.get("username"),business_username,x["price"]))
        else:
            cursor.execute("select spend from test.vip where account_username ='{}' and business_username = '{}'".format(session.get("username"),business_username))
            row = cursor.fetchone()
            old_spend = float(row.spend)
            new_spend = old_spend + float(price)
            cursor.execute("update test.vip set spend = '{}' where account_username ='{}' and business_username = '{}'".format(new_spend, session.get("username"),business_username))
        cursor.execute("update test.cart set flag = 0 where account_username = '{}' and commodity_id = '{}'".format(session.get("username"), commodity_id))
    return "success"


# --------------------------------------------business------------------------------------------------------------


@app.route('/merchant', methods=['GET'])
def merchant():
    return render_template("/merchant/shop.html")


@app.route('/getBusinessInfo', methods=['POST'])
def getBusinessInfo():
    cursor = conn.cursor()
    results = []
    cursor.execute("select state from test.account where username = '{}' and flag = 1".format(session.get("username")))
    row = cursor.fetchone()
    results.append({"state": row.state})
    cursor.execute(
        "select introduction from test.business where username = '{}' and flag = 1".format(session.get("username")))
    row = cursor.fetchone()
    results[0]["introduction"] = row.introduction
    return json.dumps(results)


@app.route('/getBusinessCommodity', methods=['POST'])
def getBusinessCommodity():
    cursor = conn.cursor()
    cursor.execute(
        "select * from test.commodity where business_username = '{}' and flag = 1".format(session.get("username")))
    columns = [column[0] for column in cursor.description]
    results = []
    for row in cursor:
        results.append(dict(zip(columns, row)))
    return json.dumps(results)


@app.route('/offTheShelf', methods=['POST'])
def offTheShelf():
    cursor = conn.cursor()
    get_data = request.get_json()
    cursor.execute("update test.commodity set state = '已下架' where id = '{}' and flag = 1".format(get_data["id"]))
    cursor.execute("update test.cart set flag = 0 where commodity_id = '{}'".format(get_data["id"]))
    return "success"


@app.route('/deleteCommodity', methods=['POST'])
def deleteCommodity():
    cursor = conn.cursor()
    get_data = request.get_json()
    print(get_data)
    cursor.execute("update test.commodity set flag = 0 where id = '{}'".format(get_data["id"]))
    return "success"


@app.route('/newCommodityForReview', methods=['POST'])
def newCommodityForReview():
    cursor = conn.cursor()
    get_data = request.get_json()
    Id = ctypes.c_size_t(hash(datetime.datetime.now())).value
    cursor.execute("insert into test.commodity values('{}','{}','{}','{}','{}','{}','{}',{},'审核中','{}',{})"
                   .format(Id, session.get("username"), get_data["name"], get_data["price"], get_data["number"],
                           get_data["introduction"], get_data["category"],
                           0, "", 1))
    return "success"


@app.route('/oldCommodityForReview', methods=['POST'])
def oldCommodityForReview():
    cursor = conn.cursor()
    get_data = request.get_json()
    cursor.execute("update test.commodity set category = '{}' where id = '{}' and flag = 1".format(get_data["category"],
                                                                                                   get_data["id"]))
    cursor.execute(
        "update test.commodity set name = '{}' where id = '{}' and flag = 1".format(get_data["name"], get_data["id"]))
    cursor.execute(
        "update test.commodity set price = '{}' where id = '{}' and flag = 1".format(get_data["price"], get_data["id"]))
    cursor.execute("update test.commodity set number = {} where id = '{}' and flag = 1".format(get_data["number"],
                                                                                                 get_data["id"]))
    cursor.execute(
        "update test.commodity set introduction = '{}' where id = '{}' and flag = 1".format(get_data["introduction"],
                                                                                            get_data["id"]))
    cursor.execute("update test.commodity set state='审核中' where id = '{}' and flag = 1".format(get_data["id"]))
    return "success"


@app.route('/vipDiscount', methods=['GET', 'POST'])
def vipDiscount():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/merchant/discount.html")
    else:
        cursor.execute("select * from test.vip_system where business_username='{}' and flag = 1".format(session.get("username")))
        columns = [column[0] for column in cursor.description]
        results = []
        for row in cursor:
            results.append(dict(zip(columns, row)))
        return json.dumps(results)


@app.route('/orderForBusiness', methods=['POST', 'GET'])
def orderForBusiness():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/merchant/indent.html")
    else:
        results = []
        cursor.execute("select * from test.order where business_username = '{}' and flag = 1".format(session.get("username")))
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(x['account_username']))
            row = cursor.fetchone()
            x['nickname'] = row.nickname
        return json.dumps(results)


@app.route('/changeVipDiscount',methods=['POST'])
def changeVipDiscount():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.vip_system set cost_ladder = '{}' where business_username = '{}' and flag = 1".format(get_data["cost_ladder"], session.get("username")))
    cursor.execute("update test.vip_system set discount_ladder = '{}' where business_username = '{}' and flag = 1".format(get_data["discount_ladder"], session.get("username")))
    return "success"


@app.route('/modifyBusinessInfo', methods=['GET','POST'])
def modifyBusinessInfo():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/merchant/information.html")
    else:
        results=[]
        cursor.execute("select introduction from test.business where username ='{}' and flag = 1".format(session.get("username")))
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(session.get("username")))
            row = cursor.fetchone()
            x['nickname'] = row.nickname
        return json.dumps(results)


@app.route('/changeBusinessInfo', methods=['POST'])
def changeBusinessInfo():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.business set introduction = '{}' where username = '{}' and flag = 1".format(get_data["introduction"], session.get("username")))
    cursor.execute("update test.account set nickname = '{}' where username = '{}' and flag = 1".format(get_data["nickname"], session.get("username")))
    cursor.execute("update test.account set password = '{}' where username = '{}' and flag = 1".format(get_data["password"], session.get("username")))
    return "success"

    
# ------------------------------------------------admin-------------------------------------------
@app.route('/admin', methods=['GET'])
def admin():
    return render_template("/administrator/shopping.html")


@app.route('/adminWishData', methods=['POST'])
def adminWishData():
    cursor = conn.cursor()
    get_data=request.get_json()
    results=[]
    if get_data["fun"] == '管理' and get_data["type"] == '商品':
        cursor.execute("select * from test.commodity where state = '已上架' and flag = 1")
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row))) 
        for x in results:
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(x["business_username"]))
            row = cursor.fetchone()
            x["nickname"]=row.nickname
        return json.dumps(results)       
    elif get_data["fun"] == '管理' and get_data["type"] == '店铺':
        cursor.execute("select * from test.business where flag = 1")
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))
        for x in results:
            cursor.execute("select nickname,state from test.account where username = '{}' and flag = 1".format(x["username"]))
            row = cursor.fetchone()
            x["nickname"],x["state"]=row.nickname,row.state
        return json.dumps(results)
    elif get_data["fun"] == '审核' and get_data["type"] == '商品':
        cursor.execute("select * from test.commodity where state = '审核中' and flag = 1")
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row))) 
        for x in results:
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(x["business_username"]))
            row = cursor.fetchone()
            x["nickname"]=row.nickname
        return json.dumps(results)
    else:
        return json.dumps(results)


@app.route('/switchState', methods=['POST'])
def switchState():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.account set state = '{}' where username = '{}' and flag = 1".format(get_data["state"], get_data["username"]))
    return "success"


@app.route('/reviewResult', methods=['POST'])
def reviewResult():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.commodity set state = '{}' where id = '{}' and flag = 1".format(get_data["state"], get_data["id"]))
    online_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    cursor.execute("update test.commodity set online_time = '{}' where id = '{}' and flag = 1".format(online_time, get_data["id"]))
    #online_time设置为当前时间
    return "success"


@app.route('/orderForAdmin', methods=['GET', 'POST'])
def orderForAdmin():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/administrator/indent.html")
    else:
        cursor.execute("select * from test.order where flag = 1")
        results=[]
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row))) 
        for x in results:
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(x['account_username']))
            row=cursor.fetchone()
            x['customerNickname']=row.nickname 
            cursor.execute("select nickname from test.account where username = '{}' and flag = 1".format(x['business_username']))
            row=cursor.fetchone()
            x['businessNickname']=row.nickname  
        return json.dumps(results)

                          
@app.route('/modifyAdminInfo', methods=['GET', 'POST'])
def modifyAdminInfo():
    cursor = conn.cursor()
    if request.method == 'GET':
        return render_template("/administrator/information.html")
    else:
        cursor.execute("select * from test.account where username = '{}' and flag = 1".format(session.get("username")))
        results=[]
        columns = [column[0] for column in cursor.description]
        for row in cursor:
            results.append(dict(zip(columns, row)))     
        return json.dumps(results)  


@app.route('/changeAdminInfo', methods=['POST'])
def changeAdminInfo():
    cursor = conn.cursor()
    get_data=request.get_json()
    cursor.execute("update test.account set password = '{}' where username = '{}' and flag = 1".format(get_data["password"], session.get("username")))
    cursor.execute("update test.account set nickname = '{}' where username = '{}' and flag = 1".format(get_data["nickname"], session.get("username")))
    return "success"


# ------------------------------------------------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(port=5000)
