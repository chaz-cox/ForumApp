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
            threads: {},
            thread: {},

            postInput: "",

            threadNameInput: "",
            threadDescriptionInput:"",
            threadCategoryInput:"",

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
        //GetThreadsInfo
        getThreadsInfo: async function(){
            let response = await fetch(`${URL}/thread`,{
            credentials: "include",
            });
            if (response.status == 200){
                let body = await response.json();
                this.threads = body;
                console.log(this.threads);
            }else{
                console.log("ERROR", response.status, response);
            }
        },
        gotoThreadPage: async function(id){
            this.page = 'Thread';
            console.log(id, " correct id");
            let response = await fetch(`${URL}/thread/${id}`,{
                credentials: "include",
            });
            if (response.status == 200){
                let body = await response.json();
                this.thread = body;
                console.log(this.thread);
            }else{
                console.log("ERROR", response.status, response);
            }
        },

        //submit a post
        submitPost: async function(id){
            console.log(id, " this is the id getting passed in");
            let postCredentials = {body: this.postInput, thread_id: id};
            let response = await fetch(`${URL}/post`,{
                method: "POST",
                body: JSON.stringify(postCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });
            
            let body = await response.json();
            console.log(body);
            if (response.status == 201){
                console.log("post success");
                this.postInput = "";
            }else{
                console.log("ERROR:", response.status, response);
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
                this.getThreadsInfo()
                this.page = 'Home';
                
            }else if(response.status == 401){
                console.log("Unsuccessful");
                this.message = "Unsuccessful";
                this.loginPasswordInput = "";

            }else{
                console.log("ERROR", response.status, response);
            }
        },
        postThread: async function(){
            let threadCredentials = { name: this.threadNameInput, description: this.threadDescriptionInput, category: this.threadCategoryInput};

            let response = await fetch(URL + "/thread",{
                method: "POST",
                body: JSON.stringify(threadCredentials),
                headers:{
                        "Content-Type": "application/json"
                },
                credentials: "include"
            });

            let body = response.json();
            console.log(body);

            if (response.status == 201){
                console.log("Success!");
                this.threadNameInput = "";
                this.threadDescriptionInput = "";
                this.threadCategoryInput = "";
                this.page = "Home";
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
