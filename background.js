var re1 = /<script(\s|.|\n)*?<\/script>/gi
var re2 = /<div(\s|.|\n)*?>/gi
var re3 = /<input(\s|.|\n)*?>/gi
var re4 = /<a (\s|.|\n)*?>/gi
var re5 = /<meta(\s|.|\n)*?>/gi
var re6 = /<img(\s|.|\n)*?>/gi
var re7 = /<form(\s|.|\n)*?>/gi

//var p1 = /href\s*=\s*[\"\'](.*?)[\"\']/gi
var p2 = /src\s*=\s*[\"\'](.*?)[\"\']/gi
var p13 = /<script[^<]*>([^\/]*)<\/script>/mg

var size;
var result = 0;
var arr=[];

/*** 1. browser exploit ***/
var script = document.createElement('script');
script.src = './model/exploit_random.js'; 
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

/*** 2. phishing ***/
var script2 = document.createElement('script');
script2.src = './model/phishing_random.js';
script2.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script2);
/*** 2. phishing ***/

/*** 3. script ***/
var script1 = document.createElement('script');
script1.src = './model/script_random.js';
script1.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script1);

/*** white_list ***/
var script_white = document.createElement('script');
script_white.src = './white/whitelist.js';
script_white.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script_white);
/*** white_list ***/

/*** 1. browser exploit ***/
var exploit_feature = ['\\x','0x','$','+','*','%','[','_','|','~','toString','^','iframe','http://','eval(','onload','onunload','indexOf','charAt','ActiveXObject','WScript','Shell','Script','ADODB.Stream','gif','swf','exe','@','display','Sleep','/.','join(','push(','split(','escape(','function','var'];
var exploit_feature2 = ['max_line'];
var feature_1 = [];
function exploit(data, feature_1){
  for(j=0; j<exploit_feature.length; j++){
    var cnt = 0;
    var idx = -1;
    do{
      idx = data.indexOf(exploit_feature[j],idx+1);
      if(idx!= -1){
        cnt++;
      }
    }while(idx != -1);
    if(cnt > 0){
      var per = (cnt/data.length)*100;
      feature_1.push(per.toFixed(3));
    }
    else{
      feature_1.push(cnt);
    }
  }
}
function max_line(data, feature_1){
    var max_cnt = 0;
  var line = data.split("\n"); 
    for(i in line){
        var cnt = line[i].length;
        if(cnt > max_cnt) {
            max_cnt = cnt;
        }
    }
  feature_1.push((max_cnt*0.00001).toFixed(5));
}
/*** 1. browser exploit ***/

/*** 2. phishing ***/
//1. 하이퍼링크 수가 0이면 악성
function link_count(decoded, feature_cnt) { 
    var p1 = /href\s*=\s*[\"\'](.*?)[\"\']/gi
    var a = p1.test(decoded); 
    var b = p2.test(decoded);
    if (a) {
        feature_cnt.push(0)
    }
    else if (b) {
        feature_cnt.push(0) 
    }
    else {
        feature_cnt.push(1)
    }
}
//2. 하이퍼링크에 외부도메인
function link_out(decoded, feature_cnt, host_name, hyperlink) {
    var p1 = /href\s*=\s*[\"\'](.*?)[\"\']/gi
    var a = decoded.match(p1);
    var b = decoded.match(p2);
    
    if (a == null && b == null) {
        feature_cnt.push(1)
    }
    else {
        // 하이퍼링크 값 추출
        if (b == null) {
            for (var i = 0; i < a.length; i++) {
                var start = a[i].indexOf('"');
                var end = a[i].indexOf('"', start+1);
                var list = a[i].substring(start+1, end);
                hyperlink.push(list)
            }
        }
        else if (a == null) {
            for (var i = 0; i < b.length; i++) {
                var start = b[i].indexOf('"');
                var end = b[i].indexOf('"', start+1);
                var list = b[i].substring(start+1, end);
                hyperlink.push(list)        
            }
        }
        else {
            for (var i = 0; i < a.length; i++) {
                var start = a[i].indexOf('"');
                var end = a[i].indexOf('"', start+1);
                var list = a[i].substring(start+1, end);
                hyperlink.push(list)
            }
            for (var i = 0; i < b.length; i++) {
                var start = b[i].indexOf('"');
                var end = b[i].indexOf('"', start+1);
                var list = b[i].substring(start+1, end);
                hyperlink.push(list)        
            }           
        }

        // 도메인 추출
        function getHost(hyperlink){
            var a = document.createElement('a');
            a.href = hyperlink;
            return a.hostname;
        }
        domain = [];
        for (var i = 0; i<hyperlink.length; i++) {
            domain.push(getHost(hyperlink[i]))
        }

        // 외부 도메인 검사
        var out_domain = 0;
        for (var i = 0; i<domain.length; i++){
            if (domain[i] == "" || domain[i] == host_name) {}
            else { out_domain++;}
        }
        if (out_domain / hyperlink.length > 0.5) {
            feature_cnt.push(1);
        }
        else {
            feature_cnt.push(0);
        }
    }
}
//3. action 필드 외부도메인
function feature_action(decoded, feature_cnt, host_name, action) {
    var p3 = /action\s*=\s*[\"\'](.*?)[\"\']/gi
    var a = decoded.match(p3);
    if (a == null) {
        feature_cnt.push(0)
    }
    else {
        // action 값 추출
        for (var i = 0; i < a.length; i++) {
            var start = a[i].indexOf('"');
            var end = a[i].indexOf('"', start+1);
            var list = a[i].substring(start+1, end);
            action.push(list)
        }
        // 도메인 추출
        function getHost(action){
            var a = document.createElement('a');
            a.href = action;
            return a.hostname;
        }
        domain = [];
        for (var i = 0; i<action.length; i++) {
            domain.push(getHost(action[i]))
        }
        // 외부 도메인 검사
        var out_domain = 0;
        for (var i = 0; i<domain.length; i++){
            if (domain[i] == "" || domain[i] == host_name) {}
            else { out_domain++;}
        }
        if (out_domain > 0) {
            feature_cnt.push(1)
        }
        else {
            feature_cnt.push(0)
        }
    }
}
//4. favicon 경로
function feature_favi(decoded, feature_cnt, host_name) {
    var p4 = /<link(.*?)rel\s*=\s*[\"\'](shortcut icon|icon)[\"\'](.*?)>/gi
    var a = decoded.match(p4);
    if (a == null) {
        feature_cnt.push(0)
    }
    else {
        var b = a.toString();
        var p5 = /href\s*=\s*[\"\'](.*?)[\"\']/g
        var c = b.match(p5);
        // favi href 값 추출
        favi = [];
        for (var j = 0; j < c.length; j++) {
            var start = c[j].indexOf('"');
            var end = c[j].indexOf('"', start+1);
            var list = c[j].substring(start+1, end);
            favi.push(list)
        }
        // 도메인 추출
        function getHost(favi){
            var a = document.createElement('a');
            a.href = favi;
            return a.hostname;
        }
        domain = [];
        for (var i = 0; i<favi.length; i++) {
            domain.push(getHost(favi[i]))
        }
        // 외부 도메인 검사
        var out_domain = 0;
        for (var i = 0; i<domain.length; i++){
            if (domain[i] == "" || domain[i] == host_name) {}
            else { out_domain++;}
        }
        if (out_domain > 0) {
            feature_cnt.push(1)
        }
        else {
            feature_cnt.push(0)
        }
    }
} 
//5. url 경로 내에 //를 사용한 리다이렉션
function double_slash(url, feature_cnt) {
    var p6 = new RegExp("//","g");
    var cnt = url.match(p6);
    if(cnt.length > 1) {feature_cnt.push(1)}
    else {feature_cnt.push(0)}
}
//6. 도메인에 https 존재
function https(host_name, feature_cnt){
    var p17 = new RegExp("https","g");
    var cnt = host_name.match(p17);
    if (cnt == null) {feature_cnt.push(0)}  
    else if(cnt.length > 1) {feature_cnt.push(1)}
    else {feature_cnt.push(0)}  
}
//7. url 단축서비스
function short_url(url, feature_cnt) {
    var p7 = /bit\.ly|kl\.am|cli\.gs|bc\.vc|po\.st|v\.gd|bkite\.com|shorl\.com|scrnch\.me|to\.ly|adf\.ly|x\.co|1url\.com|ad\.vu|migre\.me|su\.pr|smallurl\.co|cutt\.us|filoops\.info|shor7\.com|yfrog\.com|tinyurl\.com|u\.to|ow\.ly|ff\.im|rubyurl\.com|r2me\.com|post\.ly|twitthis\.com|buzurl\.com|cur\.lv|tr\.im|bl\.lnk|tiny\.cc|lnkd\.in|q\.gs|is\.gd|hurl\.ws|om\.ly|prettylinkpro\.com|qr\.net|qr\.ae|snipurl\.com|ity\.im|t\.co|db\.tt|link\.zip\.net|doiop\.com|url4\.eu|poprl\.com|tweez\.me|short\.ie|me2\.do|bit\.do|shorte\.st|go2l\.ink|yourls\.org|wp\.me|goo\.gl|j\.mp|twurl\.nl|snipr\.com|shortto\.com|vzturl\.com|u\.bb|shorturl\.at|han\.gl|wo\.gl|wa\.gl/
    var cnt = p7.test(url); 
    //console.log("cnt : ", cnt);
    if (cnt) {
        feature_cnt.push(1);
    } else {
        feature_cnt.push(0);
    }
}
//8. <script>태그 외부 링크
function script_external(decoded, feature_cnt, host_name) {
    var p8 = /<script(.*?)src\s*=\s*[\"\'](.*?)[\"\'](.*?)>/gi
    var a = decoded.match(p8); 
    if (a == null) {
        feature_cnt.push(0)
    }
    else {
        var b = a.toString();
        var p9 = /src\s*=\s*[\"\'](.*?)[\"\']/g
        var c = b.match(p9);
        // src 값 추출
        src = [];
        for (var j = 0; j < c.length; j++) {
            var start = c[j].indexOf('"');
            var end = c[j].indexOf('"', start+1);
            var list = c[j].substring(start+1, end);
            src.push(list)
        }

        // 도메인 추출
        function getHost(src){
            var a = document.createElement('a');
            a.href = src;
            return a.hostname;
        }
        domain = [];
        for (var i = 0; i<src.length; i++) {
            domain.push(getHost(src[i]))
        }

        // 외부 도메인 검사
        var out_domain = 0;
        for (var i = 0; i<domain.length; i++){
            if (domain[i] == "" || domain[i] == host_name) {}
            else { out_domain++;}
        }
        if (out_domain == src.length) {
            feature_cnt.push(1)
        }
        else {
            feature_cnt.push(0)
        }
    }
}
//9. 호스팅 서비스
function webhost(host_name, feature_cnt){
    if (host_name.match("000webhostapp.com")) {
        feature_cnt.push(1)
    }
    else { feature_cnt.push(0) }
}
//11. url안에 dots 개수
function url_dot(host_name, feature_cnt){
    var a = host_name;
    var cnt = a.match(/\./g);
    if (cnt == null ) {feature_cnt.push(0)} 
    else if (cnt.length >= 4) {feature_cnt.push(1)}
    else {feature_cnt.push(0)}  
}
//12. url 안에 특수문자
function url_special(url, feature_cnt){
    var a = url;
    var cnt = a.match(/@/g);
    if (cnt == null ) {feature_cnt.push(0)} 
    else {feature_cnt.push(1)}  
}
//13. url 안에 http 개수
function url_http(url, feature_cnt){
    var a = url;
    var cnt = a.match(/http/g);
    if (cnt == null ) {feature_cnt.push(0)} 
    else if (cnt.length > 1 ){feature_cnt.push(1)}
    else {feature_cnt.push(0)}
}
//14. 도메인에 top level domain
function domain_top_level(host_name, feature_cnt){
    var top_level_domain = ['\\.edu', '\\.gov', '\\.mil', '\\.biz', '\\.com', '\\.org', '\\.int', '\\.net', '\\.kr','\\.jp', '\\.cn', '\\.in', '\\.us', '\\.ca', '\\.uk', '\\.fr', '\\.de', '\\.it', '\\.br', '\\.co', '\\.nz','\\.aero', '\\.arpa', '\\.asia', '\\.cat', '\\.coop', '\\.jobs', '\\.mobi', '\\.museum', '\\.name','\\.pro', '\\.tel', '\\.travel', '\\.xxx'];
    var a = host_name;
    var cnt = 0;
    for (var i=0; i < top_level_domain.length; i++) {
        if (a.match(top_level_domain[i])){ cnt++;}
        else {}
    }
    if (cnt > 1) {feature_cnt.push(1)}  
    else {feature_cnt.push(0)}
}
//aciton필드 안에 공백
function action_empty(feature_cnt, action){
    feature1 = ['#', 'javascript:void(0)', 'JavaScript::void(0)', 'abount:blank', ' '];
    //console.log(action); 
    if (action == null) { feature_cnt.push(0); }
    else {
        var cnt = 0;
        for (var i=0; i<action.length; i++) {
            for (var j=0; j < feature1.length; j++) {
                if (action[i] == feature1[j]){ cnt++; break;}
                else {}
            }
        }
        if (cnt > 0) {feature_cnt.push(1);}  
        else {feature_cnt.push(0);}
    }
}
//하이퍼링크 안에 공백
function link_empty(feature_cnt, hyperlink){
    feature1 = [' ', '#', 'javascript:void(0))', 'JavaScript::void(0)'];
    if (hyperlink == null) { feature_cnt.push(1); }
    else {
        var cnt = 0;
        for (var i=0; i<hyperlink.length; i++) {
            for (var j=0; j < feature1.length; j++) {
                if (hyperlink[i] == feature1[j]){ cnt++; break;}
                else {}
            }
        }
        if (cnt > 0) {feature_cnt.push(1);}  
        else {feature_cnt.push(0);}
    }   
}
//하이퍼링크 안에 리다이렉션
function link_redirect(feature_cnt, hyperlink){
    if (hyperlink == null) { feature_cnt.push(1); }
    else {
        var p10 = new RegExp("//","g");
        for (var i=0; i<hyperlink.length;i++){
            var cnt = hyperlink[i].match(p10);
        }
        if (cnt == null) {feature_cnt.push(0);}
        else if(cnt.length > 1) {feature_cnt.push(1);}
        else {feature_cnt.push(0);}  
    }
}
//<meta>,<script>,<link> 태그
function tag_percent(decoded,feature_cnt){
    var p11 = /<script|<meta|<link/gi;
    var p12 = /<html|<form|<head|<script|<title|<meta|<link|<body|<div|<a |<header|<img|<ul|<li|<ol|<button|<span|<nav|<noscript|<p|<h|<label|<input|<fieldset|<select|<option|<br|<style|<head|<table|<tr|<td/gi;
    var a = decoded.match(p11);
    //console.log("a", a);
    var b = decoded.match(p12);
    //console.log("b", b);
    if (a == null) {feature_cnt.push(0);}
    else if (b == null) {feature_cnt.push(0);}
    else {
        var per = (a.length/b.length) * 100;
        if ( per < 17 ) {feature_cnt.push(0);}
        else if ( per >= 17 && per <= 81) {feature_cnt.push(0.7);}
        else  {feature_cnt.push(1);}     
    }
}
//escape
function func_escape(decoded,feature_cnt){
    var a = decoded.match(p13);
    if (a == null) {
        feature_cnt.push(0);
    }
    else{
        var b = a.toString();
        var p14 = /escape\(/gim;
        var c = b.match(p14);
        if (c == null){feature_cnt.push(0);}
        else {
            var d = (c.length/decoded.length)*100;
            feature_cnt.push(d.toFixed(3));
        }
    }   
}
//eval
function func_eval(decoded,feature_cnt){
    var a = decoded.match(p13);
    if (a == null) {
        feature_cnt.push(0);
    }
    else{
        var b = a.toString();
        var p14 = /eval\(/gim;
        var c = b.match(p14);
        if (c == null){feature_cnt.push(0);}
        else {
            var d = (c.length/decoded.length)*100;
            feature_cnt.push(d.toFixed(3));
        }
    }   
}
//split
function func_split(decoded,feature_cnt){
    var a = decoded.match(p13);
    if (a == null) {
        feature_cnt.push(0);
    }
    else{
        var b = a.toString();
        var p14 = /split\(/gim;
        var c = b.match(p14);
        if (c == null){feature_cnt.push(0);}
        else {
            var d = (c.length/decoded.length)*100;
            feature_cnt.push(d.toFixed(3));
        }
    }   
}
//fromCharCode
function func_fromCharCode(decoded,feature_cnt){
    var a = decoded.match(p13);
    if (a == null) {
        feature_cnt.push(0);
    }
    else{
        var b = a.toString();
        var p14 = /fromCharCode\(/gim;
        var c = b.match(p14);
        if (c == null){feature_cnt.push(0);}
        else {
            var d = (c.length/decoded.length)*100;
            feature_cnt.push(d.toFixed(3));
        }
    }   
}
//iframe
function func_iframe(decoded,feature_cnt){
    var p14 = /<iframe/mg;
    var a = p14.test(decoded);
    if (a) {
        feature_cnt.push(1);
    }
    else {
        feature_cnt.push(0);
    }   
}
//aciton_php
function action_php(feature_cnt, action){
    if (action == null) { feature_cnt.push(0) }
    else {
        var cnt = 0;        
        for( var i=0; i<action.length; i++ ) {
            var a = action[i].match(/\.php/g);
        }
        if(a == null ) {feature_cnt.push(0);}
        else if( a.length > 0) {feature_cnt.push(1);}
        else {feature_cnt.push(0);}
    }
}
//url_php
function url_php(url,feature_cnt){
    var a = url;
    var cnt = a.match(/\.php/g);
    if (cnt == null) {feature_cnt.push(0);}  
    else if (cnt.length > 0) {feature_cnt.push(1);}
    else {feature_cnt.push(0);}  
}
//url_16
function url_16(url,feature_cnt){
    var a = url;
    var cnt = a.match(/%/g);
    //console.log("length", cnt.length); 
    if (cnt == null) {feature_cnt.push(0);}
    else if (cnt.length > 0) {
        var per = (cnt.length/a.length)*100;
        feature_cnt.push(per.toFixed(3));
    } else {feature_cnt.push(0);}  
}
//entropy
function entropy(url,feature_cnt){
    var size = url.length;
    var result = 0;
    arr = [];
    for (var i=33; i<91; i++){
        if (i==36 || i==40 || i==41 || i==42 || i==43 || i==46 || i==63) {arr.push(0);}
        else {
            var a = String.fromCharCode(i);
            var b = 0;
            var flag = 'gi';
            var reg = new RegExp(`${a}`, flag);
            b = (url.match(reg)||[]).length;
            arr.push(b);
        }
    }//for
    for (var j=0; j<arr.length; j++) {
        if (arr[j] != 0) {
            result += (arr[j]/size) * Math.log(arr[j]/size,2);
        }
    }
    result = result * (-1.0);
    //console.log(result);
    if(result > 4.0){feature_cnt.push(1)}
    else {feature_cnt.push(0)}
}
//소스코드 내에 도메인
function domain_in_source(decoded,feature_cnt,host_name){
    var a = host_name;
    var b = new RegExp(`${a}`,'g');
    var c = b.test(decoded);
    if (c) {feature_cnt.push(0)}
    else {feature_cnt.push(1)}
}
//<head><body>
function duplicated(decoded,feature_cnt){
    var p15 = /<head/g;
    var p16 = /<body/g;
    var a = decoded.match(p15);
    var b = decoded.match(p16);
    if (a == null && b == null) {feature_cnt.push(0)}
    else if (a == null && b.length >1) {feature_cnt.push(1)}
    else if (a.length >1 && b == null) {feature_cnt.push(1)}    
    else if (a.length >1 && b.length > 1) {feature_cnt.push(1)}     
    else {feature_cnt.push(0)}
}
/*** 2. phishing ***/

/*** 3. script ***/
var script_feature = ['&','domain','alert','prompt', '\\x', '*', '[', ']', 'eval', 'confirm'];
var feature_2 = [];
var pic = ['png','jpg','jpeg','gif','tiff','psd','raw','PNG', 'GIF', 'JPG', 'JPEG', 'TIFF', 'PSD', 'RAW'];
var http = 0;

tag = [];
on = [];
p1 = new RegExp(String.raw`\t`) //tab
p3 = new RegExp(String.raw`[^\w]on[a-zA-Z]+[^<>!]*?[^\w]alert\(`) //on*alert
p4 = new RegExp(String.raw`[^\w]on[a-zA-Z]+[^<>!]*?[^\w]prompt\(`) //on*prompt
p5 = new RegExp(String.raw`[^\w]on[a-zA-Z]+=+[^<>!]*?document.cookie`) //on*document.cookie
p6 = new RegExp(String.raw`[^\w]on[a-zA-Z]+[^<>!]*?location`) //on*location
p7 = new RegExp('<[a-zA-Z]+ ') //<scRipt
p8 = new RegExp('on[a-zA-Z]+=|ON[a-zA-Z]+=|On[a-zA-Z]+=|oN[a-zA-Z]+=') //onErRor
p9 = new RegExp(String.raw`<img[^<>!]*?alert\([^<>!]*?>`) //<img + alert
p10 = new RegExp(String.raw`<img[^<>!]*?[^\w]javascript[^<>!]*?>`) //<img + javascript
p11 = new RegExp(String.raw`<img[^<>!]*?\son[a-zA-Z]+[^<>!]*?&#`) //<img+on*+&#
p12 = new RegExp(String.raw`<input[^<>!]*?\son[a-zA-Z]+[^<>!]*?href`) //<input+on*+href
p13 = new RegExp(String.raw`src[^<>!]*?alert\([^<>!]*?`) //src+alert(소문자)
p14 = new RegExp(String.raw`<img[^<>!]*?prompt\([^<>!]*?`) //<img+prompt
p15 = new RegExp(String.raw`<img+[^<>!]*?document.cookie`)  //<img+document.cookie
p16 = new RegExp(String.raw`[^\w]%[a-zA-Z]+[^<>!]*?[^\w]alert\(`) //%_alert
p20 = new RegExp(String.raw`[^\w]xss[^\w]`) // xss
p23 = new RegExp(String.raw`[^\w]javascript[^<>!]*?[^\w]alert\(`) //javascript*alert

p17 = new RegExp("<svg/on")
p18 = new RegExp("<iframe/on")
p19 = new RegExp("string.fromcharcode")

function feature_RegExp(data, feature_2) {
    var script_data = data.toLowerCase();
    var m1 = p1.test(data);//1. tab
    var m3 = p3.test(script_data);//3. on* + alert
    var m4 = p4.test(script_data);//4. on* + prompt
    var m5 = p5.test(script_data);//5. on* + document.cookie
    var m6 = p6.test(script_data);//6. on* + location
    var m7 = p10.test(script_data);//7. <img + javascript
    var m8 = p11.test(script_data);//8. <img+on*+&#
    var m9 = p17.test(script_data);//10. <svg/onload
    var m10 = p18.test(script_data);//11. <iframe/on
    var m11 = p19.test(script_data);//12. string.fromCharCode()
    var m12 = p12.test(script_data);//18. <input + on* + href
    var m13 = p9.test(script_data);//19. <img+alert
    var m14 = p13.test(script_data);//20. src+alert
    var m15 = p14.test(script_data);//21. <img+prompt
    var m16 = p15.test(script_data);//22. <img+document.cookie
    var m17 = p16.test(script_data);//24. %_alert
    var m18 = p20.test(script_data);//25.xss
    var m21 = p23.test(script_data);//javascript*alert
    if (m1) {feature_2.push(0.7);} 
    else {feature_2.push(0);}
    if (m3) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m4) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m5) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m6) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m7) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m8) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m9) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m10) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m11) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m12) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m13) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m14) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m15) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m16) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m17) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m18) {feature_2.push(1);} 
    else {feature_2.push(0);}
    if (m21) {feature_2.push(1);}   //javascript*alert
    else {feature_2.push(0);}
}

//9. `
function feature_back(data, feature_2) {
    if (/`/.test(data)) {feature_2.push(1);} 
    else {feature_2.push(0);}
}

//13. <ScRipt
function ScRipt(data, feature_2) {
    var tag = [];
    while(p7.test(data) == true)
    {
    tmparr = p7.exec(data);
    tag.push(tmparr.toString());
    var split1 = data.substring(0,tmparr.index);
    var split2 = data.substring(tmparr.index, tmparr.toString().length);
    var split3 = data.substring(tmparr.index + tmparr.toString().length, tmparr.input.length);
    data = split1 + split3;
    }
    //console.log("tag", tag);
    //console.log("tag_length", tag.length);
    if (tag.length != 0) {
        for (var i = 0; i < tag.length; i++) {
            var upper = 0;
            var lower = 0;
            var result = 0;

            if (tag[i] == tag[i].toUpperCase()) {
                upper = 1;      //모두 대문지
            } else if (tag[i] == tag[i].toLowerCase()) {
                lower = 1;      //모두 소문자
            } else {
                upper = 0;
                lower = 0;
            }
            
            if(upper == 1 || lower == 1){
                result = 0;
                continue;
            } else {
                result = 2;
                feature_2.push(result);
                break;
            }
        }//for
        if (result == 0) {
            feature_2.push(0);
        }
    } else {
        feature_2.push(0);
    }
}
 
 //14. <onErrOr
 function onErrOr(data, feature_2) {
    var on = [];
    while(p8.test(data) == true)
    {
    tmparr = p8.exec(data);
    on.push(tmparr.toString());
    var split1 = data.substring(0,tmparr.index);
    var split2 = data.substring(tmparr.index, tmparr.toString().length);
    var split3 = data.substring(tmparr.index + tmparr.toString().length, tmparr.input.length);
    data = split1 + split3;
    }
    //console.log(on);
    if (on.length != 0) {
        for (var i = 0; i < on.length; i++) {
            var upper = 0;
            var lower = 0;
            var result = 0;

            if (on[i] == on[i].toUpperCase()) {
                upper = 1;      //모두 대문지
            } else if (on[i] == on[i].toLowerCase()) {
                lower = 1;      //모두 소문자
            } else {
                upper = 0;
                lower = 0;
            }
            
            if(upper == 1 || lower == 1){
                result = 0;
                continue;
            } else {
                result = 1;
                feature_2.push(result);
                break;
            }
        }//for
        if (result == 0) {
            feature_2.push(0);
        }
    } else {
        feature_2.push(0);
    }
}

function odd(data, feature_2){
    //15. ''_odd
    var cnt1 = 0;
    var idx1 = -1;
    do{
        idx1 = data.indexOf('\'',idx1+1);
        if(idx1 != -1){
            cnt1++;
        }
    }while(idx1 != -1);
    //console.log("cnt",cnt1);
    if ((cnt1 % 2) == 1) {feature_2.push(1);}
    else {feature_2.push(0);}

    //16. ""_odd
    var cnt2 = 0;
    var idx2 = -1;
    do{
        idx2 = data.indexOf('\"',idx2+1);
        if(idx2 != -1){
            cnt2++;
        }
    }while(idx2 != -1);
    if ((cnt2 % 2) == 1) {feature_2.push(1);}
    else {feature_2.push(0);}
}

function char_feature(data, feature_2){
    var script_data = data.toLowerCase();
    for(j=0; j<script_feature.length; j++){
        var cnt = 0;
        var idx = -1;
        do{
        idx = script_data.indexOf(script_feature[j],idx+1);
        if(idx!= -1){
            cnt++;
        }
        }while(idx != -1);
        if(cnt > 0){
        var per = (cnt/script_data.length)*100;
        feature_2.push(per.toFixed(3));
        }
        else{
        feature_2.push(cnt);
        }
    }
}

function chk_script(data, feature_2) {
    feature_RegExp(data, feature_2);
    feature_back(data, feature_2);
    ScRipt(data, feature_2);
    onErrOr(data, feature_2);
    odd(data, feature_2);
    char_feature(data, feature_2);
    console.log(feature_2);
    var script_prediction = new script_RandomForestClassifier().predict(feature_2);
    console.log("스크립트 기반 웹 공격 ",script_prediction);
    //console.log(data);
    return script_prediction;
}
/*** 3. script ***/

var tmp_url='';
var confirm_alert = 0;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(tmp_url != tab.url) {
        //console.log("updated!!!!!!!!!!!!!!!!!!!!!!!!! : ", tab.url);
        if(confirm_alert == 0){
            var abc = -1;
            localStorage.setItem('key1',abc);
            localStorage.setItem('key2',abc);
            localStorage.setItem('key3',abc);
        }
    }
    tmp_url = tab.url;
});

/*** chrome extension ***/
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var btn1 = localStorage.getItem('btn');
        var btn2 = localStorage.getItem('btn2');
        var btn3 = localStorage.getItem('btn3');
        if(btn1 =='false' && btn2 == 'false' && btn3 == 'false'){ return {} }
        else if ((details.url).toLowerCase().indexOf('.ttf') == -1){
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", details.url, false); // true for asynchronous x, false - 동기 
            xmlHttp.send();
        
            var check = new WhiteLIST().white_chk(details.url);
            var urls = details.url;

            var white = localStorage.getItem('url_listWords');
            if( white !== null){
                var whites = white.replace('\n','|');
                var myurl = urls.match(new RegExp('^(' + whites + ')$'));
            }

            if (xmlHttp.status == 200 && check !== 1 && myurl == null && (details.url).toLowerCase().indexOf('chrome-extension://') == -1){ //xmlHttp.status == 200
                var data = xmlHttp.responseText;
                console.log("url : ", details.url);
                if(data.length < 100000) {  //responsetext 100000으로 제한
                        
                    var b = localStorage.getItem('btn2');
                    if(b == 'true'){var bb = myonoffswitch2()}
                    else{var bb = [0];}
                    //console.log("var bb : ", bb[0]);

                    /*** 2. phishing ***/
                    function myonoffswitch2(){
                        if ((details.url).toLowerCase().indexOf('.js') == -1 && (details.url).toLowerCase().indexOf('.css') == -1 && 
                            (details.url).toLowerCase().indexOf('.png') == -1 && (details.url).toLowerCase().indexOf('.jpg') == -1 && 
                            (details.url).toLowerCase().indexOf('.jpeg') == -1 && (details.url).toLowerCase().indexOf('.gif') == -1 && 
                            (details.url).toLowerCase().indexOf('.ico') == -1 && (details.url).toLowerCase().indexOf('.lcs') == -1) {

                            var decoded = xmlHttp.responseText;
                            var feature_cnt = [];   //2. phishing 
                            var action = [];
                            var hyperlink = [];
                            var scts = [];

                            if (decoded.indexOf('<html') !== -1) {
                                var url = details.url;  //url 변수
                                //도메인 추출
                                var aa = document.createElement('a');
                                aa.href = details.url;
                                var host_name =  aa.hostname;

                                link_count(decoded, feature_cnt); //1
                                link_out(decoded, feature_cnt, host_name, hyperlink) //2
                                feature_action(decoded, feature_cnt, host_name, action); //3
                                feature_favi(decoded, feature_cnt, host_name); //4
                                double_slash(url, feature_cnt); //5
                                https(host_name, feature_cnt); //6
                                short_url(url, feature_cnt); //7
                                script_external(decoded, feature_cnt, host_name); //8
                                webhost(host_name, feature_cnt); //9
                                url_dot(host_name, feature_cnt); //11
                                url_special(url, feature_cnt); //12
                                url_http(url, feature_cnt); //13
                                domain_top_level(host_name, feature_cnt); //14
                                action_empty(feature_cnt, action); //17
                                link_empty(feature_cnt, hyperlink); //18
                                link_redirect(feature_cnt, hyperlink); //19
                                tag_percent(decoded,feature_cnt); //20
                                func_escape(decoded,feature_cnt); //21
                                func_eval(decoded,feature_cnt); //22
                                func_split(decoded,feature_cnt); //23
                                func_fromCharCode(decoded,feature_cnt); //24
                                func_iframe(decoded,feature_cnt); //25  
                                action_php(feature_cnt, action); //26
                                url_php(url,feature_cnt); //27
                                url_16(url,feature_cnt); //28
                                entropy(url,feature_cnt); //29
                                domain_in_source(decoded,feature_cnt,host_name); //31
                                duplicated(decoded,feature_cnt); //32

                                var pre_phishing = new RandomForestClassifier().predict(feature_cnt);
                                console.log(feature_cnt);
                                console.log("피싱 ",pre_phishing);
                            }// <html
                        }
                        return [pre_phishing];
                        } //myonoffswitch2()
                        /*** 2. phishing ***/

                        var a = localStorage.getItem('btn');
                        var c = localStorage.getItem('btn3');
                        if(a == 'true'){var aa = myonoffswitch()}
                        else{var aa = [0,0];}
                        //console.log("var aa : ", aa[0]);
                        if(c == 'true'){var cc = myonoffswitch3()}
                        else{var cc = [0,0,0,0,0,0,0,0];   }
                        //console.log("var cc : ", cc[0]);
                        
                        /*** 1. browser exploit ***/
                        function myonoffswitch(){
                            if (((details.url).toLowerCase().indexOf('.png') == -1) && ((details.url).toLowerCase().indexOf('.jpg') == -1)) {   //png,jpg 필터링
                                if((details.url).indexOf('.js') !== -1){    //js검사
                                    var feature_1=[];
                                    var data = xmlHttp.responseText;
                                    exploit(data, feature_1);
                                    max_line(data, feature_1);

                                    var pre_exploit_js = new exploit_RandomForestClassifier().predict(feature_1);
                                    console.log(feature_1);
                                    console.log("브라우저 자체 취약점",pre_exploit_js);
                                }
                                else if((xmlHttp.responseText).match(re1) !== null){    //script태그 검사
                                    var feature_1=[];
                                    var data = ((xmlHttp.responseText).match(re1)).join('\n');
                                    exploit(data, feature_1);
                                    max_line(data, feature_1);
                                    var pre_exploit_sc = new exploit_RandomForestClassifier().predict(feature_1);
                                    console.log(feature_1);
                                    console.log("브라우저 자체 취약점",pre_exploit_sc);
                                }
                            }//필터링
                            return [pre_exploit_js, pre_exploit_sc];
                        }//myonoffswitch()
                        /*** 1. browser exploit ***/

                        /*** 3. script ***/
                        function myonoffswitch3(){
                            if (((details.url).toLowerCase().indexOf('.png') == -1) && ((details.url).toLowerCase().indexOf('.jpg') == -1)) {   //png,jpg 필터링
                                if ((details.url).indexOf('.js') !== -1){ //js검사
                                    var data = xmlHttp.responseText; 
                                    var feature_2 = [];
                                    var pre_script_js = chk_script(data, feature_2);
                                }
                                else if((xmlHttp.responseText).match(re1) != null){ //script태그 검사
                                    var data1 = ((xmlHttp.responseText).match(re1)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data1.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_sc = 0;

                                    for(i in data){
                                        var feature_2 = [];
                                        var prediction = chk_script(data[i], feature_2); //현재
                                        //console.log("script");
                                        if (prediction > pre_script_sc) {
                                            pre_script_sc = prediction;
                                        } else {
                                            continue;
                                        }
                                    }//for
                                    //console.log("최대 ",pre_script_sc);
                                }
                                //js, script태그 검사

                                if((xmlHttp.responseText).match(re2)!=null){    //div태그
                                    var data2 = ((xmlHttp.responseText).match(re2)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data2.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_div = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("div");
                                            if (prediction > pre_script_div) {
                                                pre_script_div = prediction;
                                            } else {
                                                continue;
                                            }
                                        }else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_div);
                                }
                                if((xmlHttp.responseText).match(re3)!=null){    //input태그
                                    var data3 = ((xmlHttp.responseText).match(re3)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data3.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_input = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("input");
                                            if (prediction > pre_script_input) {
                                                pre_script_input = prediction;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_input);
                                }
                                if((xmlHttp.responseText).match(re4)!=null){    //a태그
                                    var data4 = ((xmlHttp.responseText).match(re4)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data4.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_a = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("a");
                                            if (prediction > pre_script_a) {
                                                pre_script_a = prediction;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_a);
                                }
                                if((xmlHttp.responseText).match(re5)!=null){    //meta태그
                                    var data5 = ((xmlHttp.responseText).match(re5)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data5.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_meta = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("meta");
                                            if (prediction > pre_script_meta) {
                                                pre_script_meta = prediction;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_meta);
                                }
                                if((xmlHttp.responseText).match(re6)!=null){    //img태그
                                    var data6 = ((xmlHttp.responseText).match(re6)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data6.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_img = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("img");
                                            if (prediction > pre_script_img) {
                                                pre_script_img = prediction;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_img); 
                                }
                                if((xmlHttp.responseText).match(re7)!=null){    //form태그
                                    var data7 = ((xmlHttp.responseText).match(re7)).join('@#~sdaklfj34532465W$@#$6@\n');
                                    var data = data7.split("@#~sdaklfj34532465W$@#$6@");
                                    var pre_script_form = 0;

                                    for(i in data){
                                        if (data[i].length > 100) {
                                            var feature_2 = [];
                                            var prediction = chk_script(data[i], feature_2);
                                            //console.log("forms");
                                            if (prediction > pre_script_form) {
                                                pre_script_form = prediction;
                                            } else {
                                                continue;
                                            }
                                        } else {
                                            continue;
                                        }
                                    }
                                    //console.log("최대 ",pre_script_form);
                                }

                            }//필터링
                            return [pre_script_js, pre_script_sc, pre_script_div, pre_script_input, pre_script_a, pre_script_meta, pre_script_img, pre_script_form];
                        }//myonoffswitch3()
                        /*** 3. script ***/

                        /*** 경고창 알림 ***/
                        var prediction = [bb[0], aa[0], aa[1], cc[0], cc[1], cc[2], cc[3], cc[4], cc[5], cc[6], cc[7]];
                        
                        for (var i = prediction.length - 1; i >= 0; i--) {
                            if (prediction[i] == null) {
                                prediction[i] = 0;
                            }else {
                                continue;
                            }
                        }
                        //console.log("prediction : ",prediction);

                        if(prediction[0] >= 99 ||
                            prediction[1] > 95 || prediction[2] > 95 ||
                            prediction[3] > 97 || prediction[4] > 97 || prediction[5] > 97 || prediction[6] > 97 || prediction[7] > 97 ||
                            prediction[8] > 97 || prediction[9] > 97 || prediction[10] > 97){

                            if(prediction[0] >= 99){
                                var predict1 = prediction[0].toFixed(2);
                                localStorage.setItem('key2',predict1);
                            }
                            if(prediction[1] > 95 || prediction[2] > 95){
                                var pre = [];
                                pre.push(prediction[1]);
                                pre.push(prediction[2]);
                                var max = Math.max.apply(null, pre);
                                var max2 = max.toFixed(2);
                                localStorage.setItem('key1',max2);
                            }
                            if(prediction[3] > 97 || prediction[4] > 97 || prediction[5] > 97 || prediction[6] > 97 || prediction[7] > 97 ||
                                prediction[8] > 97 || prediction[9] > 97 || prediction[10] > 97){
                                var pre = [];
                                pre.push(prediction[3]);
                                pre.push(prediction[4]);
                                pre.push(prediction[5]);
                                pre.push(prediction[6]);
                                pre.push(prediction[7]);
                                pre.push(prediction[8]);
                                pre.push(prediction[9]);
                                pre.push(prediction[10]);
                                var max = Math.max.apply(null, pre);
                                var max3 = max.toFixed(2);
                                localStorage.setItem('key3',max3);
                            }
                            var pre_max = Math.max.apply(null, prediction);
                            pre_max = pre_max.toFixed(2);
                            var result = confirm("[A!]경고!! 악성확률 "+pre_max+"%입니다. 차단하시겠습니까?");
                            if(result){
                                confirm_alert = 1;
                                chrome.browserAction.setIcon({path:"icon/mal 48.png"});
                                return {cancel:true}; //차단페이지
                            } else{
                                chrome.browserAction.setIcon({path:"icon/mal 48.png"});
                                confirm_alert = 1;
                                return {};
                            }                 
                        }
                        else {
                            chrome.browserAction.setIcon({path:"icon/safe 48.png"});
                            confirm_alert = 0;
                        }
                        /*** 경고창 알림 ***/

                }//responsetext 100000으로 제한
                else{
                    chrome.browserAction.setIcon({path:"icon/safe 48.png"});
                    confirm_alert = 0;
                }
            }//xmlHttp.status == 200
        }
    },//callback
    {
    urls : ["<all_urls>"]
    },//filter
    ['blocking'] //콜백 함수가 반환될 때까지 요청 차단
);