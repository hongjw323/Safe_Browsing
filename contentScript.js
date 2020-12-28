var a = localStorage.getItem('key1');
var aa = localStorage.getItem('btn');
if(aa =='false'){
	document.getElementById("browser").innerHTML = "<p style = 'color:#8C8C8C';>OFF</p>";
}
else{
if( a > 0 ){
document.getElementById("browser").innerHTML = "<p style = 'color:red';>"+a+"%</p>";
document.getElementById("result").innerHTML = '<p style = "color:red";>Safe Browsing 검사 결과<br>악성페이지로 판단되었습니다.</p>';
}
else{
	document.getElementById("browser").innerHTML = "<p style = 'color:blue';>정상</p>";
}
}
var b = localStorage.getItem('key2');
var bb = localStorage.getItem('btn2');
if(bb =='false'){
	document.getElementById("phishing").innerHTML = "<p style = 'color:#8C8C8C';>OFF</p>";
}
else{
if( b > 0 ){
document.getElementById("phishing").innerHTML = "<p style = 'color:red';>"+b+"%</p>";
document.getElementById("result").innerHTML = '<p style = "color:red";>Safe Browsing 검사 결과<br>악성페이지로 판단되었습니다.</p>';
}
else{
	document.getElementById("phishing").innerHTML = "<p style = 'color:blue';>정상</p>";
}
}
var c = localStorage.getItem('key3');
var cc = localStorage.getItem('btn3');
if(cc =='false'){
	document.getElementById("script").innerHTML = "<p style = 'color:#8C8C8C';>OFF</p>";
}
else{
if( c > 0 ){
document.getElementById("script").innerHTML = "<p style = 'color:red';>"+c+"%</p>";
document.getElementById("result").innerHTML = '<p style = "color:red";>Safe Browsing 검사 결과<br>악성페이지로 판단되었습니다.</p>';
}
else{
	document.getElementById("script").innerHTML = "<p style = 'color:blue';>정상</p>";
}
}

if(aa=='false' && bb=='false' && cc=='false'){
document.getElementById("result").innerHTML = '<p style = "color:black";>Safe Browsing 검사 결과<br>없음</p>';
}
else{
}
