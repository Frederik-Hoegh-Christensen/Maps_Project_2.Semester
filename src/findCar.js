export function findCarHTMLButtons(){
    window.addEventListener("load", event =>{
        console.log('page loaded');
        document.getElementById('loader').hidden = true;
    })
    
    document.getElementById('card-close-btn')
                        .addEventListener("click", e=>{
                            document.getElementById('car-card').hidden = true;
                        }
    )
    
    document.getElementById('card-btn-login')
    .addEventListener("click", e=>{
        console.log("this is where we do the logging in :D")
    })
}