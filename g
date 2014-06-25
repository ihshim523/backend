curl -XGET 'http://hotissue.imapp.kr/get.dat' > ./HotIssue/get.dat
curl -XGET 'http://hotissue.imapp.kr/get2.dat' > ./HotIssue/get2.dat

git add .
git commit -am '.'
git push

