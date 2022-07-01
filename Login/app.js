URL = "https://forum2022.codeschool.cloud"
/*vue.component('',{
    template: ``,
    data: function(){
        return{
        }
    },
    props: {},
    methods: {},
});
*/
var app = new Vue({
        el: "#app",
        data: {
            page : "Login",
            message : "",
            name: "person",

            loginEmailInput:"",
            loginPasswordInput:"",
            
            newEmailInput: "",
            newPasswordInput: "",
            newNameInput: "",
        },
    methods:{
        getSession: async function(){
            let response = await fetch(`${URL}/session`,{
                method: "GET",
                credentials: "include",
            });
            if (response.status == 200){
                console.log("logged in");
                let data = await response.json();
                console.log(data);

            }else if (response.status == 401){
                console.log("Not logged in");

            }else{
                console.log("ERROR", response.status, response);
            }
        },
        //POST
        postSession: async function(){
            let loginCredentials = {username: this.loginEmailInput, password: this.loginPasswordInput};

            let response = await fetch(URL + "/session", {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            let body = response.json();
            console.log(body);

            if (response.status ==201){
                console.log("Success");
                this.message = "Success";
                this.loginEmailInput = "";
                this.loginPasswordInput = "";
                this.page = 'Home';
                
            }else if(response.status == 401){
                console.log("Unsuccessful");
                this.message = "Unsuccessful";
                this.loginPasswordInput = "";

            }else{
                console.log("ERROR", response.status, response);
            }
        },
        postUser: async function(){
            let loginCredentials = {username: this.newEmailInput, fullname: this.newNameInput, password: this.newPasswordInput};
            
            let response = await fetch(URL + "/user",{
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            
            let body = response.json();
            console.log(body);

            if (response.status == 201){
                console.log("Success");
                this.message = "Success";
                this.newEmailInput = "";
                this.newPasswordInput = "";
                this.newNameInput = "";

            }else if (response.status == 401){
                console.log("Unsuccessful");
                this.message = "Unsuccessful";
                this.newEmailInput = "";
                this.newPasswordInput = "";

            }else{
                console.log("ERROR", response.status, response);
            }
        },
    },
    created: function (){
        this.getSession();
    },
})
