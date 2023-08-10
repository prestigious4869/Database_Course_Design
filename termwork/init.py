import pyodbc

openguass = pyodbc.connect('DRIVER={PostgreSQL Unicode};SERVER=114.116.240.253;PORT=8000;DATABASE=bupt2019211278;UID=bupt2019211278;PWD=bupt2019211278@')
openguass.autocommit=True
cursor = openguass.cursor()
account='''
        create table test.account
            (
                username varchar(256),
                password varchar(256),
                nickname varchar(256),
                category varchar(256),
                state varchar(256),
                flag int2,
                primary key(username)
            );
        '''
business='''
            create table test.business
                (
                    username varchar(256),
                    introduction varchar(256),
                    flag int2,
                    primary key(username)
                );
        '''
vip='''
        create table test.vip
            (
                account_username varchar(256),
                business_username varchar(256),
                spend varchar(256),
                flag int2,
                primary key(account_username, business_username)
            );
    '''
order='''
        create table test.order
            (
                id varchar(512),
                account_username varchar(256),
                business_username varchar(256),
                commodity_id varchar(512),
                name varchar(256),
                price varchar(256),
                number int8,
                discount varchar(256),
                commit_time varchar(128),
                flag int2,
                primary key(id)
            );
        '''
vip_system='''
                create table test.vip_system
                (
                    business_username varchar(256),
                    discount_ladder varchar(128),
                    cost_ladder varchar(128),
                    flag int2,
                    primary key(business_username)
                );
            '''
commodity='''
                create table test.commodity
                (
                    id varchar(512),
                    business_username varchar(256),
                    name varchar(256),
                    price varchar(256),
                    number int8,
                    introduction varchar(256),
                    category varchar(256),
                    sale int8,
                    state varchar(128),
                    online_time varchar(128),
                    flag int2,
                    primary key(id)
                );
            '''
cart='''
        create table test.cart
        (
            account_username varchar(256),
            commodity_id varchar(512),
            flag int2,
            primary key(account_username, commodity_id)
        );
    '''
cursor.execute("drop table test.account"), cursor.execute(account)
cursor.execute("drop table test.business"), cursor.execute(business)
cursor.execute("drop table test.vip"), cursor.execute(vip)
cursor.execute("drop table test.order"), cursor.execute(order)
cursor.execute("drop table test.vip_system"), cursor.execute(vip_system)
cursor.execute("drop table test.commodity"), cursor.execute(commodity)
cursor.execute("drop table test.cart"), cursor.execute(cart)

cursor.execute("insert into test.account values('customer1','customer1','','customer','正常',1)")
cursor.execute("insert into test.account values('customer2','customer2','','customer','正常',1)")
cursor.execute("insert into test.account values('admin1','admin1','','administrator','正常',1)")
cursor.execute("insert into test.account values('admin2','admin2','','administrator','正常',1)")
cursor.execute("insert into test.account values('merchant1','merchant1','商家1','merchant','正常',1)")
cursor.execute("insert into test.account values('merchant2','merchant2','商家2','merchant','正常',1)")

cursor.execute("insert into test.business values('merchant1','这是商家1的简介',1)")
cursor.execute("insert into test.business values('merchant2','这里是商家2的简介',1)")

cursor.execute("insert into test.vip_system values('merchant1','0.9-0.8-0.7','100-200-300',1)")
cursor.execute("insert into test.vip_system values('merchant2','0.5-0.4-0.3','50-80-120',1)")

cursor.execute("insert into test.commodity values('9792211128948414778','merchant1','跳绳','26',10,'这里是merchant1跳绳的简介','其他',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('1048602130262936348','merchant1','乐事','5',60,'这里是merchant1乐事的简介','食物',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('15846812865083900582','merchant1','耳机','200',2,'这里是merchant1耳机的简介','电器',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('7935603079330766711','merchant1','外套','120',10,'这里是merchant1外套的简介','服装',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('8942641720538590619','merchant1','温度计','23',60,'这里是merchant1温度计的简介','医药',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('10103932706337893348','merchant1','牛奶','55',30,'这里是merchant1牛奶的简介','食物',0,'审核中','',1)")

cursor.execute("insert into test.commodity values('6239040396588087752','merchant2','康乃馨','5',100,'这里是merchant2康乃馨的简介','其他',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('14397466556204027269','merchant2','麦丽素','10',60,'这里是merchant2麦丽素的简介','食物',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('1434917770578809733','merchant2','剃须刀','99',12,'这里是merchant2剃须刀的简介','电器',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('6506523102878495806','merchant2','衬衫','20',20,'这里是merchant2衬衫的简介','服装',0,'审核中','',1)")
cursor.execute("insert into test.commodity values('4623674028785862219','merchant2','消炎片','25',30,'这里是merchant2消炎片的简介','医药',0,'审核中','',1)")

