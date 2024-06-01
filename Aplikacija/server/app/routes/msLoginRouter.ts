import msal, { ConfidentialClientApplication } from "@azure/msal-node";
import { Router } from "express";
import { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID } from "../config";

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
    const params = {
        scopes: ["email", "profile", "user.read"],
        redirectUri: "http://localhost:1738/msLogin/auth/callback",
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

msLoginRouter.get("/auth/callback",  (req, res) => {
    const tokenReq: any = {
        code: req.query.code,
        scopes: ["email", "profile", "user.read"],
        redirectUri: "http://localhost:1738/msLogin/auth/callback"
    };

     confidentialApp.acquireTokenByCode(tokenReq)
                         .then(result => {
                            res.status(200).send({message: `Hello ${result.account?.name}`});
                         })
                         .catch(err => {
                            res.status(500).send({message: JSON.stringify(err)});
                         });
});

export default msLoginRouter;