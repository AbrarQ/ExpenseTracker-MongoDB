async function loguser(event) {
    event.preventDefault();
    //using try and catch block to catch the errors
    try {
        // const userName = document.getElementById("uname").value;
        // // const pnumberdata1 = document.getElementById("pnumber").value;
        const emaildata = document.getElementById("eid").value;
        const passwrd = document.getElementById("pswrd").value;
        //Storing them into a object format
        const obj = {
            emaildata,
            passwrd
        }
        console.log(obj);

        // sending a post request and passing object to the server
await axios.post(`http://localhost:4000/signin/user`,obj)
            .then(res => {
                console.log(res);

                if (res.status === 200) {
                    console.log(res.data);
                  
                    alert(res.data.message)

                    localStorage.setItem('token', res.data.token)
                    
            
                        window.location.href = "../homePage/Homepage.html"
                } else {
                    if (res.status === 401) {
                        console.log(res.data);
                      
                        alert(res.data.message)
    
                    }
                }
                
        

            }).catch(error => {
                if (error.response.status === 401) {
                    console.log(error);
                    const para = document.getElementById("result");
                    para.innerHTML = ' <p style = "color:red">Error :- Wrong Password</p>'

                } else if (error.response.status === 404) {
                    console.log(error);
                    const para = document.getElementById("result");
                    para.innerHTML = ' <p style = "color:red">Error :- User not found</p>'

                }
            })



            

    } catch (e) {

        console.log(e);
    }
}

