registerBtn.addEventListener("click",()=>{
    //alert("works")
    if(!loginInput.value || !pwdInput.value)
        return alert("please fill all the fields")
    fetch("http://localhost:3000/register",{
        method:"POST",
        headers :{
            "Content-Type":"application/json"
        }
        ,
        body:JSON.stringify({
            login:loginInput.value,
            pwd: pwdInput.value
        })
    })
    // then concerne toutes les reponses du serveur (200, 400, 500 ...)
    .then(async response=>{
        let body = await response.json()
        if(response.status >= 200 && response.status <300)
            window.location="http://localhost:3000/login.html"
        else{
            alert(body.msg)
        }
    })
    .catch(e=>{
        alert("problem")
        console.log(e)
    })
})