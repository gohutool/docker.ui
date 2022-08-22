function isTokenOK(){
    let token = $.app.localStorage.getToken();
    console.log("Token: " + token)

    if ($.extends.isEmpty(token)){
        return false;
    }else{
        return true;
    }
}
