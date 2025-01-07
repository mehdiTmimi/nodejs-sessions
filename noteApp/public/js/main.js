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
})