# coding: utf-8
from __future__ import unicode_literals
import json
import pymysql
import itertools
import sys


# 변수 선언

# json파일을 읽고 그 데이터를 twitter_info에 저장하는 데 필요한 변수
arrayText = []
arrayPlace = []
arrayKeyword = []

# twitter_info에서 꺼내온 데이터를 twitter_keyword에 저장하는 데 필요한 변수
arrayKeyword2 = []
arrayPlace2 = []
arrayCount = []


conn = pymysql.connect(host='Your_host', user='Your_userName', password='Your_password',
                       db='Your_db', charset='utf8mb4')
cur = conn.cursor()

# json파일을 디코딩한다.(json형태 → python 배열 변수에 저장) records를 출력하면 각각의 인덱스에 json형식들이 저장되어있다.
with open("twiiterJson4.json") as f:
    records = [json.loads(line[:-2].decode('utf-8')) for line in f]

# key값에 따라 value값을 배열변수에 저장
place_map = {
    ('강원', '원주', '삼척', '강릉', '춘천'): 'place_gw',
    ('경기', '서울', '수원', '오산', '성남', '안양', '고양', '용인', '화성', '군포', '시흥', '안성', '인천', '서대문', '강서', '서초', '마포', '종로', '중구'): 'place_gg',
    ('경남', '경상남도', '창원', '통영', '진주', '사천', '김해', '밀양', '거제', '고성', '경남', '울산','부산'): 'place_gn',
    ('경북', '경상북도', '포항', '구미', '상주', '영주', '영천', '영양', '울릉', '문경', '대구'): 'place_gb',
    ('전북', '전라북도', '전주', '군산', '익산', '정읍', '남원', '김제'): 'place_jb',
    ('전남', '전라남도', '목포', '순천', '나주', '보성', '장흥', '전남'): 'place_jn',
    ('충북', '충청북도', '청주', '제천', '충북', '음성', '옥천'): 'place_cb',
    ('충남', '충청남도', '천안', '공주', '서산', '아산', '서천', '대전'): 'place_cn',
}

for key, value in itertools.groupby(records):
    for i in value:
        place = i.get("twitterPlace")
        if not place:
            continue
        for place_lst, place_val in place_map.items():
            if any(pcode in place for pcode in place_lst):
                place = place_val
                break
        else:
            place = None
        
        arrayText.append(i.get("twiiterText"))
        arrayPlace.append(place)
        arrayKeyword.append(i.get("twitterKeyword"))



# twitter_info 테이블에 insert시킴
for i in range(0, len(arrayText)):
    try:
        sql = "INSERT INTO twitter_info (twiiterText, twitterPlace, twitterKeyword) VALUES (%(twiiterText)s, %(twitterPlace)s, %(twitterKeyword)s);"
        data_sql = {
            'twiiterText': arrayText[i],
            'twitterPlace': arrayPlace[i],
            'twitterKeyword': arrayKeyword[i]
        }
        if not data_sql.get('twitterPlace'):
            continue
        cur.execute(sql, data_sql)
        conn.commit()
    except pymysql.Error as e:
        sys.stderr.write("[ERROR] %d: %s\n" % (e.args[0], e.args[1]))


# twiiter_info에 있는 keyword, place, place개수를 받아옴
sql = "select twitterKeyword, twitterPlace, count(twitterPlace) " \
      "from twitter_info group by twitterKeyword, twitterPlace order by twitterKeyword, twitterPlace;"
cur.execute(sql)
row = cur.fetchall()

# 받아온 데이터들을 각각 배열 변수에 저장
for x, y, z in row:
    arrayKeyword2.append(x)
    arrayPlace2.append(y)
    arrayCount.append(z)

# 저장된 배열 변수를 twitter_keyword에 insert함
for i in range(0, int(len(arrayKeyword2))):
    sql = "insert into twitter_keyword(keyword, local_id, count) " \
          "values (%(keyword)s, %(local_id)s, %(count)s);"
    data_sql = {
        'keyword': arrayKeyword2[i],
        'local_id': arrayPlace2[i],
        'count': arrayCount[i],
        
    }
    cur.execute(sql, data_sql)
    conn.commit()


