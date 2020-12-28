function load_checkbox(id)
{
	if(id == 'myonoffswitch'){
		var a = localStorage.getItem('btn');
		var check1 = document.getElementById(id);
		if(a == 'true'){check1.checked = true;}
		else{check1.checked = false;}
	}
	if(id == 'myonoffswitch2'){
		var a = localStorage.getItem('btn2');
		var check1 = document.getElementById(id);
		if(a == 'true'){check1.checked = true;}
		else{check1.checked = false;}
	}	
	if(id == 'myonoffswitch3'){
		var a = localStorage.getItem('btn3');
		var check1 = document.getElementById(id);
		if(a == 'true'){check1.checked = true;}
		else{check1.checked = false;}
	}
	else{}
}

function click_check(id)
{
	if(id == 'myonoffswitch'){
	var font = document.getElementById(id);
	font.addEventListener("click", function() {
		if (font.checked == true){
			localStorage.setItem('btn','true');
		}
		else{
			localStorage.setItem('btn','false');
		}
	});
	}
	if(id == 'myonoffswitch2'){
	var font = document.getElementById(id);
	font.addEventListener("click", function() {
		if (font.checked == true){
			localStorage.setItem('btn2','true');
		}
		else{
			localStorage.setItem('btn2','false');
		}
	});
	}
	if(id == 'myonoffswitch3'){
	var font = document.getElementById(id);
	font.addEventListener("click", function() {
		if (font.checked == true){
			localStorage.setItem('btn3','true');
		}
		else{
			localStorage.setItem('btn3','false');
		}
	});
	}
}

window.addEventListener('DOMContentLoaded', function(){
	load_checkbox("myonoffswitch");
	click_check("myonoffswitch");
	load_checkbox("myonoffswitch2");
	click_check("myonoffswitch2");
	load_checkbox("myonoffswitch3");
	click_check("myonoffswitch3");
});