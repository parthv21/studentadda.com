//For modal-tabs
$("#signupLoginModal").on('show.bs.modal', function (e) {
    var tab = e.relatedTarget.hash;
    // console.log(tab);
    $('.nav-tabs a[href="' + tab + '"]').tab('show');
    $(tab).addClass('active');
});

//Update Year in footer automatically
$('#copyrightYear').html(new Date().getFullYear());

//disabled button for signup
$("#signupLoginModal").on('shown.bs.modal', function () {
    function checkButton() {
        if ($('#inputPasswordForSignup').val() === $('#inputConfirmPasswordForSignup').val() &&
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test($('#inputEmailForSignup').val()) &&
            $('#inputFirstName').val().length > 2 && $('#inputLastName').val().length > 2 &&
            $('#terms_conditions').is(':checked')) {
            $('#buttonForSignup').prop('disabled', false);
        } else {
            $('#buttonForSignup').prop('disabled', true);
        }
    }

    checkButton();
    $('#inputConfirmPasswordForSignup').change(function () {
        var pwd = $('#inputPasswordForSignup').val();
        if ($(this).val() === pwd) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('The two passwords must match.');
        }
        checkButton();
    });
    $('#terms_conditions').click(function () {
        if ($('#terms_conditions').is(':checked')) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('Please read the Terms & Conditions');
        }
        checkButton();
    });
    $('#inputEmailForSignup').change(function () {
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi.test($(this).val())) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('Invalid Email');
        }
        checkButton();
    });
    $('#inputFirstName').change(function () {
        if (/[a-z]{3,}/gi.test($(this).val())) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('Name should be at least 3 letters long and should contain only alphabets');
        }
        checkButton();
    });
    $('#inputLastName').change(function () {
        if (/[a-z]{3,}/gi.test($(this).val())) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('Name should be at least 3 letters long and should contain only alphabets');
        }
        checkButton();
    });
    $('#inputPasswordForSignup').change(function () {
        if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}/.test($(this).val())) {
            $('#validityError').html('');
        } else {
            $('#validityError').html('Must contain at least one number and one uppercase and lowercase letter, and at least 5 or more characters');
        }
        checkButton();
    });
});

/*Ajax Calls here*/
$('#buttonForSignup').click(function () {
    if ($(this).is(':disabled')) {
        console.log('Should not work');
    } else {
        var signupData = {
            "firstName": $('#inputFirstName').val(),
            "lastName": $('#inputLastName').val(),
            "email": $('#inputEmailForSignup').val(),
            "password": $('#inputPasswordForSignup').val()
        };
        // console.log(signupData);
        var url = window.location.href + 'signup';
        // console.log(url);
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(signupData),
            success: function (data) {
                // console.log("Success");
                console.log(JSON.stringify(data));
                if (data.status === true) {
                    $('#validityError').html('Registration Successful!<br>Link for Verification has been sent to your Email Id');
                } else {
                    $('#validityError').html('Registration Unsuccessful! User Already Exists!');
                }
            },
            error: function (err) {
                // console.log(err);
                $('#validityError').html('Registration Unsuccessful! User Already Exists!');
            }
        });
    }
});

$('#buttonForLogin').click(function () {
    var loginData = {};
    loginData.username = $('#inputEmailForLogin').val();//It is the Email!
    loginData.password = $('#inputPasswordForLogin').val();
    loginData.rememberme = 0;
    if ($('#remember_me').is(':checked')) {
        loginData.rememberme = 1;
    }
    var url = window.location.href + 'login';
    if (loginData.username.length > 5 && loginData.password.length > 3) {
        $.ajax({
            url: url,
            method: "POST",
            data: loginData,
            success: function (data) {
                // console.log(data);
                if (data.success && data.verified) {
                    window.location.href = window.location.href + 'dashboard';
                } else if (data.success && !data.verified) {
                    $('#LoginError').html('Please Verify your Email Id and Try Again!');
                } else {
                    $('#LoginError').html('Invalid Login Credentials!');
                }
            },
            error: function (err) {
                $('#LoginError').html('Invalid Login Credentials!');
                // console.log(err);
            }
        });
    } else {
        $('#LoginError').html('Invalid Login Credentials!');
    }
});
