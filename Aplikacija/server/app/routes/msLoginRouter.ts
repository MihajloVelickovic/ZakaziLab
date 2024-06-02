import msal, { ConfidentialClientApplication } from "@azure/msal-node";
import { Router } from "express";
import { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID , AZURE_REDIRECT_URI} from "../config";
import Student, { IStudent } from "../models/student";

const msLoginRouter = Router();

const config: any = {
    auth:{
        clientId: AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
        clientSecret: AZURE_CLIENT_SECRET    
    },
};

const confidentialApp = new ConfidentialClientApplication(config);

msLoginRouter.get("/",  (req, res)=>{
    const params: any = {
        scopes: ["email", "profile", "user.read"],
        redirectUri: AZURE_REDIRECT_URI,
        prompt: "login"
    };

     confidentialApp.getAuthCodeUrl(params)
                         .then(result => {
                            res.redirect(result);
                          })
                          .catch(err => {
                            console.log(JSON.stringify(err));
                          });
});

msLoginRouter.get("/auth/callback",  async (req, res) => {
    const tokenReq: any = {
        code: req.query.code,
        scopes: ["email", "profile", "user.read"],
        redirectUri: AZURE_REDIRECT_URI
    };

    const result = await confidentialApp.acquireTokenByCode(tokenReq);

    const stud = await Student.find({email: result.account?.username});
    
    stud != null ?
    res.status(200).send({stud}) :
    res.status(404).send({error: `Student with email ${result.account?.username} not found`}); 

});

// msLoginRouter.get("/auth/callback", async (req, res) => {
    
//     try {
//         console.log("before critical");
//         const tokenReq: any = {
//             code: req.query.code,
//             scopes: ["email", "profile", "user.read"],
//             redirectUri: AZURE_REDIRECT_URI
//         };    
//         console.log("before critical");
//         const result = await confidentialApp.acquireTokenByCode(tokenReq);
//         console.log("it got to here");
//         const found = await Student.find({email: result.account?.username});
//         if (found) {
//             res.status(200).send(found);
//         } else {
//             res.status(404).send({ message: "entry not found" });
//         }
//     } catch (err:any) {
//         res.status(500).send({ message: `Error retrieving entries: ${err.message}` });
//     }

// }); 

export default msLoginRouter;