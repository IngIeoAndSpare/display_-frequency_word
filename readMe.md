# 트위터 정보를 가공해서 지역별 단어 빈도수를 가시화 하자

학과 연구 과제중 이런 모듈을 만들어 두면 나중에 쓸일이 있기도 하고 졸작도 해야되기에 만들어진 *비운*의 모듈  

모듈을 작동하기 위해선 다음과 같은 선행이 되어야 한다.

* twitterCollect 를 이용하여 twitter 정보를 가공하여 json 형태로 변환
* saveTweet 을 이용하여 json에 저장된 주소를 일정한 식으로 변환하여 db에 저장

여기서 twitter 정보를 가공함은 다음을 말한다.
1. 트윗 정보중 텍스트를 가져온다.
1. 트윗 키워드를 지정한다.
1. 주소 정보를 가져오기 위해 다음 2가지 경우 중 1가지를 택한다.
 * 사용자의 프로필 주소를 가져온다
 * 사용자 트윗에 태그된 주소를 가져온다
  
여기서 주소를 일정한 식으로 변환한다는 것은 다음을 이용하여 변환된다.  
```{.python}
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
```
각각 도 단위로 분류했다. 각 도별 중심좌표는 [도별 중심좌표](https://github.com/IngIeoAndSpare/display_-frequency_word/blob/master/place.csv)를 참고.
  
모듈은 웹 상에서 키워드를 입력하면 키워드의 빈도수를 DB에 탐색하게 되고 결과 값을 OpenLayers 의 vectorLayer 를 이용하여 가시화 하게 된다.  
사용된 웹 지도는 Vworld 로 [vworld_dev](http://dev.vworld.kr/dev/v4api.do)를 참고.  
사용된 vectorLayer는 [vectorLayer](https://openlayers.org/en/latest/apidoc/ol.layer.Vector.html)링크를 참고.  
사용된 twitter_collect 패키지는 [twitter-stream-channels](https://www.npmjs.com/package/twitter-stream-channels)링크를 참고.