const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const mail = req.body.mail;

    var data = {
        members: [
            {
                email_address: mail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://usX.api.mailchimp.com/3.0/lists/3f64aab8da"; //update the X as of last letter of your api id 
    const options = {
        method: "POST",
        auth: "randomword:<enter your api id here>"
    }
    const request = https.request(url, options, function(response){

        if (response.statusCode == 200){
            res.sendFile(__dirname + "/success.html")
        } else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
    console.log(firstname, lastname, mail);
});

app.post("/failure", function(req,res){
    res.redirect("/");
})
app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
