curl -XGET 'http://hotissue.imapp.kr/get.dat' > ./HotIssue/get.dat
curl -XGET 'http://hotissue.imapp.kr/get2.dat' > ./HotIssue/get2.dat
curl -XGET 'http://test-music.imapp.kr/get.dat' > ./Music/get.dat
curl -XGET 'http://music.imapp.kr/get.dat' > ./Music/get.dat

git add .
git commit -am '.'
git push

