

/**
 * Functions:( Expense Logging)
 * SaveExpense -- sends expense to backend
 * ReturnItToUi(obj)-- response from backend for saved expenses to show on screen
 * Event Listener for  DOM Content loaded
 * getExpense(Pagination) -- dipslays previous results with pagination
 * sendToUi
 * showPagination
 * 
 * 
 * Functions:( Premium Purchase)
 * Async function with onclick attached to button
 * 
 * leaderboard Fucntion - fetches to top leaders in expenses
 * 
 * Functions:( Downloads Section )
 * download - latest data of user expenses
 * oldfiles - previous downloads list of users
 */

async function saveExpense(event) {
    event.preventDefault();

    const amount = document.getElementById("expenseamount").value;
    const description = document.getElementById("expdescp").value;
    const category = document.getElementById("category").value;

    const expObj = {
        amount,
        description,
        category
    }

    const token = localStorage.getItem('token')

    await axios.post('http://localhost:4000/expense/add-expense', expObj, { headers: { "Authorization": token } })
        .then((response) => {
            console.log(response)
             returnItToUi(response.data)
             }).catch(err => console.log(err))
    
    if (document.getElementById("listoftop").innerHTML != "") {
        leaderboard();
    }
    // document.getElementById("expenseamount").value = "";
    // document.getElementById("expdescp").value = "";
    // document.getElementById("category").value = "Select";
};

function returnItToUi(obj) {
    // console.log(obj)


    try {
        // getting the id of ul tag to create ne li tags under it
        const parentElement = document.getElementById("listofexpenses");
        // creatting a new li tag to store our data from obj
        const childElement = document.createElement("li");
        // using text content to display the data passed on from the obj
        childElement.textContent = obj.amount + ' - ' + obj.description + ' - ' + obj.category + ' - ';
   
        // giving attibutes to DELETE button
        const delbtn = document.createElement("input");
        delbtn.type = "button";
    
        delbtn.value = "Delete";
        delbtn.style = "margin-bottom: 5px;"

        // appending should be done the order we want them to be dispalyed 

        childElement.append('    -    ');
        childElement.append(delbtn);
        parentElement.appendChild(childElement);
        //  When clicked removes the data from local storage
        delbtn.onclick = async () => {


            try { //DELETES THE OBJ, WHERE ID IS GIVEN
                var id = `${obj.amount}`

                console.log(id);

                const token = localStorage.getItem('token')
                // console.log(id)
                // console.log(token)
                const user = await axios.delete(`http://localhost:4000/expense/delete-expense/${obj.id}`, { headers: { "Authorization": token } })
                    .then((response) => { parentElement.removeChild(childElement); document.getElementById("puser").innerHTML += response.data.message + "<br>" })
                    .catch(err => document.getElementById("puser").innerHTML += err.message + "<br>");
                document.getElementById("listoftop").innerHTML = "";

                await leaderboard();

            } catch (e) {
                console.log(e)
            }

        }

    } catch (e) {
        console.log(e);
    }

}


window.addEventListener("DOMContentLoaded", async () => {


    try {

        const premiumCheck = localStorage.getItem("ispremium")
        const token = localStorage.getItem('token')
        console.log(token)
        if(token != null){
      await axios.get('http://localhost:4000/premium/userverify', { headers: { "Authorization": token } })
                   .then((response) => { console.log(response.data) 

                    if(response.data.ispremium === 1){
                        document.getElementById("premium").remove();
                        document.getElementById("puser").innerHTML = "You are a premium user <br>"
                    }
                        
             })
                    .catch(err => console.log(err));
                // document.getElementById("listoftop").innerHTML = "";


            }
        // if (premiumCheck == "yes") {

        //     document.getElementById("premium").remove();
        //     document.getElementById("puser").innerHTML = "You are a premium user"

        // }

        const page = 1;
        getExpense(page);


    }
    catch (e) {
        console.log(e);
    }

})

async function getExpense(page) {


    const COUNT = localStorage.getItem("count")
  

    document.getElementById("listofexpenses").innerHTML = "";

    const token = localStorage.getItem('token')
    const dbData = await axios.get(`http://localhost:4000/expense/get-expense?page=${page}&count=${COUNT}`, { headers: { "Authorization": token } })
        .then(response => { sendToUi(response.data.rows); showPagination(response.data); console.log(response.data) })
        .catch(err => console.log(err))

    return dbData;
}

async function sendToUi(obj) {

    if (obj.length == 0) {
        document.getElementById("puser").innerHTML ="<br> No Transactions to show"
    }

    for (let i = 0; i < obj.length; i++) {
        returnItToUi(obj[i]);
        // console.log(dbData[i]);

    }

}



async function showPagination({
    currentpage,
    nextpage,
    previouspage,
    hasnextpage,
    haspreviouspage,
    lastpage
}) {
    const pagination = document.getElementById("pagination")

    pagination.innerHTML = ""

    if (haspreviouspage) {

        const prevBtn = document.createElement('button');
       
        prevBtn.innerHTML = `<li class="page-item"><a class="page-link">Previous page</a></li>`
        prevBtn.addEventListener('click', async () => { await getExpense(previouspage) })
        pagination.appendChild(prevBtn)
        pagination.append(" ")
    }

    const currbtn = document.createElement('button');
  
   
    currbtn.innerHTML =  `<li class="page-item"><a class="page-link">${currentpage}</a></li>`
    currbtn.addEventListener('click', () => {
        if (currentpage == lastpage) {
            getExpense(1)
        }
    })
    pagination.appendChild(currbtn)
    pagination.append(" ")


    if (hasnextpage) {

        const nextBtn = document.createElement('button');
        
      
        nextBtn.innerHTML = `<li class="page-item"><a class="page-link">Next Page</a></li>`;
        nextBtn.addEventListener('click', async () => { await getExpense(nextpage) })
        pagination.appendChild(nextBtn)

    }

}




function getter() {
    localStorage.setItem("count", document.getElementById("NumberofRecords").value)
    location.reload();
}


// Functions for Premium User-->
document.getElementById("premium").onclick = async function (e) {
    // So inorder to know which user is creating we use token saved
    const token = localStorage.getItem('token')
    // console.log(token)
    const response = await axios.get('http://localhost:4000/purchase/premium', { headers: { "Authorization": token } })
    // console.log(response)

    var options = {

        "key": response.data.key_id,
        "order_id": response.data.orderid.id,
        "handler": async function (response) {
            // console.log(response.razorpay_payment_id)
            // console.log("before axios")
            await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
                status: "Success"
            }, { headers: { "Authorization": token } }).then(res => {
                if (res.status === 200) {
                    alert(res.data.message)
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("premium", "yes");
                    location.reload();

                }
            })

            document.getElementById("premium").remove();
            document.getElementById("puser").innerHTML = "You are a premium user now"




        }
    }
    const rzrpay = new Razorpay(options);
    rzrpay.open();
    e.preventDefault;

    rzrpay.on('payment.failed', async (response) => {
        const reason = response.error.reason

        const errobj = { reason }

        await axios.post('http://localhost:4000/purchase/updatetransactionstatus', { status: "Failed" }, { headers: { "Authorization": token } }).then(res => {
            if (res.status === 402) {

                alert(res.data.message)

                localStorage.setItem("ispremium", res.data.token)
                localStorage.setItem("premium", "No");

            }
        })
        alert("Something went wrong")
    })
}






async function leaderboard(event) {


    const token = localStorage.getItem('token')
    document.getElementById("listoftop").innerHTML = ""
    if (token != null) {
        
        

        const leaderArray = await axios.get('http://localhost:4000/premium/leaderboard', { headers: { "Authorization": token } })
            .then(response => { 
                
                return response.data.leaderArray; })
            .catch((err)=>{
                // console.log(err.response.data)
                document.getElementById("leaderboardresponse").textContent += `${err.response.data}`
            })
         

        if (leaderArray != null) {
            console.log("entering bro")
            
            document.getElementById("ldr").innerHTML = "<label style='font-weight: 800;'>Leader Board</label>";

            for (let i = 0; i < leaderArray.length; i++) {
                    console.log("entering loop")

                console.log(leaderArray.length)
                const parEle = document.getElementById("listoftop");


                const chilEle = document.createElement("li");

                chilEle.innerText = 'Name : ' + `${leaderArray[i].name}` + ' - ' + ' Total Expenses : ' + `${leaderArray[i].totalExp}`;

                parEle.appendChild(chilEle);
            }
        }
    } else {
        document.getElementById("leaderboardresponse").innerHTML = "You are not a pom user"

    }
}








//Downloads funtions---->>>>
async function download(event) {

    try {

        const token = localStorage.getItem('token')
        console.log("consolelog wala", token)
        const expense = await axios.get('http://localhost:4000/premium/download', { headers: { "Authorization": token } })
            .then(response => {
               
                if (response.status === 200) {
                    var a = document.createElement("a");
                    a.href = response.data.fileurl;
                    a.download = 'Myexpenses.csv'
                    a.click();

                } 
            }) .catch((err)=> document.getElementById("downloadResponse").textContent += `${err.response.data}`)



    } catch (err) {
        console.log(err)
    }

}


async function oldfiles(event) {

    try {
        const token = localStorage.getItem('token')
      

            //  console.log("consolelog wala",token)
            const expense = await axios.get('http://localhost:4000/premium/downloadlist', { headers: { "Authorization": token } })
                .then(response => {
                    console.log(response.data.list)
                   
                    return response.data.list
                }).catch((err)=> {console.log(); document.getElementById("olddownloadResponse").textContent = `${err.response.data}`}) 
            
                if(expense != undefined){ 
                    document.getElementById("url").innerHTML = "<label style='font-weight: 800;'>Previous Downloads</label>";
                    for (let i = 0; i < expense.length; i++) {
                    document.getElementById("listofurls").innerHTML += `<li>File-${i+1} - <a href=${expense[i].url}>    <button>Download</button></a></li><br>`
    
                }
            }
           
    } catch (e) {
        console.log(e)
    }
}



async function logout(){
    localStorage.removeItem("count")
    localStorage.removeItem("token")
  window.location.href="../signin/signin.html"
}