let usernameStatusMsg = "";
let passwordStatusMsg = "";
let userInfoStatusMsg = "";

function createColoredTitles() {
    // Color title (titles are still in HTML just in case js is disabled)
    var title = "cstBay";
    var colors = ["rgb(229,50,56)", "rgb(0,100,210)", "rgb(245,175,2)", "rgb(134,184,23)"];
    $(".site-title").empty();

    // First 3 letters should all be same color
    for (var i = 0; i < 3; ++i) {
        $(".site-title").append("<span style='color:" + colors[0] + ";'>" + title[i] + "</span>");
    }
    // The remaining 3 letters will be the last 3 colors
    for (var i = 3; i < title.length; ++i) {
        $(".site-title").append("<span style='color:" + colors[i - 2] + ";'>" + title[i] + "</span>");
    }
}

function validateSignUpForm() {
    let isUsernameValid = false;
    let isPasswordValid = false;
    let isInfoFilledIn = false;

    if ($("#username").val().length == 0) {
        usernameStatusMsg = "Please choose a username";
    } else {
        usernameStatusMsg = "Looks good";
        isUsernameValid = true;
    }
     
    if ($(".password-validate").val().length == 0) {
        passwordStatusMsg = "Please provide the password in both fields";
    } else if ($(".password-validate").val().length < 8) {
        passwordStatusMsg = "We recommend that your password is at least 8 characters";
    } else if ($("#password").val() != $("#passwordConfirm").val()) {
        passwordStatusMsg = "Hold on, those passwords don't match";
    } else {
        passwordStatusMsg = "Ready to go";
        isPasswordValid = true;
    }

    if ($(".user-signup-info").val().length == 0) {
        userInfoStatusMsg = "Please provide all the requested information"
    } else {
        userInfoStatusMsg = ""
        isInfoFilledIn = true;
    }

    if (isUsernameValid && isPasswordValid && isInfoFilledIn) {
        return true;
    }
    return false;
}

function validatePasswordChangeForm() {
    let isNewPasswordValid = false;

    if ($("#currentPassword").val().length == 0) {
        passwordStatusMsg = "Please provide your current password";
    } else if ($(".password-validate").val().length == 0) {
        passwordStatusMsg = "Please provide your new password in both fields";
    } else if ($(".password-validate").val().length < 8) {
        passwordStatusMsg = "We recommend that your password is at least 8 characters";
    } else if ($("#newPassword").val() != $("#newPasswordConfirm").val()) {
        passwordStatusMsg = "Hold on, those passwords don't match";
    } else {
        passwordStatusMsg = "Ready to go";
        isNewPasswordValid = true;
    }

    return isNewPasswordValid;
}

$(document).ready(function() {
    createColoredTitles();

    let isValid = false;
    $("#btnSignUp").prop("disabled", true);
    $("#btnChangePassword").prop("disabled", true);

    $("#signUp").on("keyup", "#username", function() {
        isValid = validateSignUpForm();
        $(".username-error").html(usernameStatusMsg);
        $("#btnSignUp").prop("disabled", !isValid);
    });

    $("#signUp").on("keyup", ".password-validate", function() {
        isValid = validateSignUpForm();
        $(".password-error").html(passwordStatusMsg);
        $("#btnSignUp").prop("disabled", !isValid);
    });

    $("#signUp").on("keyup", ".user-signup-info", function() {
        isValid = validateSignUpForm();
        $(".userInfo-error").html(userInfoStatusMsg);
        $("#btnSignUp").prop("disabled", !isValid);
    });

    $("#passwordChange").on("keyup", "#currentPassword, .password-validate", function() {
        isValid = validatePasswordChangeForm();
        $(".password-error").html(passwordStatusMsg);
        $("#btnChangePassword").prop("disabled", !isValid);
    });

    $("#resultsContainer").on("click", ".btn-cart-item-action", function() {
        // Get first word of button to identify action
        let cartAction = $(this).text().substr(0, $(this).text().indexOf(" ")).toLowerCase();

        $.ajax({
            method: "GET",
            url: "/api/updateCart",
            data: {
                    "keyword": "test",
                    "imageUrl": "test",
                    "price": "test",
                    "action": cartAction
                  }
        });
    });
});
