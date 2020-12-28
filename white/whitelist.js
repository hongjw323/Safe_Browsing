
var WhiteLIST = function() {
	this.whiteDomains = [
	/\/white\//g,
	/\.google\.com/g,
    /\.naver\.com/g,
	/\.youtube\.com/g,
    /\.daum\.net/g,
    /\.tistory\.com/g,
    /\.tmall\.com/g,
    /\.amazon\.com/g,
    /\.kakao\.com/g,
    /\.google\.co\.kr/g,
    /\.sohu\.com/g,
    /\.wikipedia\.org/g,
    /\.facebook\.com/g,
    /\.qq\.com/g,
    /\.taobao\.com/g,
    /\.360\.cn/g,
	/\.netflix\.com/g,
    /\.jd\.com/g,
    /\.baidu\.com/g,
    /\.coupang\.com/g,
    /\.apple\.com/g,
    /\.dcinside\.com/g,
    /\.yahoo\.com/g,
    /\.microsoft\.com/g,
    /\.twitch\.tv/g,
    /\.adobe\.com/g,
    /\.amazon\.co\.uk/g,
    /\.zoom\.us/g,
    /\.aliexpress\.com/g,
    /\.instagram\.com/g,
    /\.stack(overflow|exchange)\.com/g,
    /\.sina\.com\.cn/g,
    /\.gmarket\.co\.kr/g,
    /\.ebay\.com/g,
    /\.donga\.com/g,
    /\.11st\.co\.kr/g,
    /\.bing\.com/g,
    /\.weibo\.com/g,
    /\.afreecatv\.com/g,
    /\.office\.com/g,
    /\.yna\.co\.kr/g,
    /\.git(lab|hub)\.com/g,
    /\.auction\.co\.kr/g,
    /\.chosun\.com/g,
    /\.nate\.com/g,
    /\.ppomppu\.co\.kr/g,
    /\.amazon\.co\.jp/g,
    /\.danawa\.com/g,
    /\.(drop)?box\.com/g,
    /\.ruliweb\.com/g
  ];

  this.white_chk = function(url) {
    var chk = 0;
    
    for (var i=0; i<this.whiteDomains.length; i++) {
      if ((url).match(this.whiteDomains[i]) !== null) {  //whitelist o
        chk = 1;
        break; 
      } else {  //whitelist x
        chk -= 1;
      }
    }
    return chk;
  }//white_chk

}//whiteLIST

var check = new WhiteLIST();

//사용자 화이트리스트 저장
function save_list(url) {
    var list = url;
    console.log(list);

    check.whiteDomains.push(list);
    console.log(check.whiteDomains);

    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    var save = document.getElementById('save');
    save.addEventListener('click', function() {
        save_list(document.getElementById('url_list').value);
    });
});