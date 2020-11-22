$(document).ready(function(){
	$('#form1').on('submit', function(e){
		e.preventDefault();
		var x = document.forms["SignUpForm"]["username"].value;
        var y = document.forms["SignUpForm"]["password"].value;
        var z = document.forms["SignUpForm"]["email"].value;

		var reg1 = new RegExp("^[A-Za-z0-9]+$");
		var reg2 = new RegExp ("^[A-Za-z0-9#!@]+$");

		var result1 = reg1.test(x);
        var result2 = reg2.test(y);

		if(x == "" || y =="" ||  z ==""|| x == null || y == null ||  z =="")
		{
			swal("Error","All fields must be filled in.","error");
			return false //return false if all inputs aren't filled in
		}

		if (result1 === false && result2 === false){
			swal("Error","Username must be alphanumerical only, and Password contains illegal characters","error");
			return false
		}

		if (result1 === false ){
			swal("Error","Username must be alphanumerical only","error");
			return false;
		}

		if (result2 === false ){
			swal("Error","Password contains illegal characters","error");
			return false;
        }

		else{
			this.submit();
		}
	});
});

$(document).ready(function(){
	$('#form2').on('submit', function(e){
		e.preventDefault();
		var x = document.forms["loginForm"]["email"].value;
        var y = document.forms["loginForm"]["password"].value;

		var reg1 = new RegExp("^[A-Za-z0-9@._]+$");
		var reg2 = new RegExp ("^[A-Za-z0-9#!@]+$");

		var result1 = reg1.test(x);
        var result2 = reg2.test(y);


		if(x == "" || y =="" || x == null || y == null )
		{
			swal("Error","All fields must be filled in.","error");
			return false //return false if all inputs aren't filled in
		}

		if (result2 === false ){
			alert("Error","Password contains illegal characters","error");
			return false;
        }
        
		else{
			this.submit();
		}
	});
});



