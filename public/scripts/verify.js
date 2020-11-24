$(document).ready(function(){
	$('#form1').on('submit', function(e){
		e.preventDefault();
		var x = document.forms["SignUpForm"]["username"].value;
        var y = document.forms["SignUpForm"]["password"].value;
        var z = document.forms["SignUpForm"]["email"].value;

		var reg1 = new RegExp("^[A-Za-z0-9]+$");
		var reg2 = new RegExp ("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$");

		var result1 = reg1.test(x);
        var result2 = reg2.test(y);

		if(x == "" || y =="" ||  z ==""|| x == null || y == null ||  z =="")
		{
			swal("Error","All fields must be filled in.","error");
			return false //return false if all inputs aren't filled in
		}

		if (result1 === false && result2 === false){
			swal("Error","Username must be alphanumerical only, and Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character from: #?!@$%^&*-","error");
			return false
		}

		if (result1 === false ){
			swal("Error","Username must be alphanumerical only","error");
			return false;
		}

		if (result2 === false ){
			swal("Error","Password must be minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character from: #?!@$%^&*-","error");
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
		var reg2 = new RegExp ("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$");

		var result1 = reg1.test(x);
        var result2 = reg2.test(y);


		if(x == "" || y =="" || x == null || y == null )
		{
			swal("Error","All fields must be filled in.","error");
			return false //return false if all inputs aren't filled in
		}

		if (result2 === false ){
			alert("Error","Password error","error");
			return false;
        }
        
		else{
			this.submit();
		}
	});
});



