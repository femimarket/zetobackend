import express, { Request, Response } from 'express';
import {object, string} from "yup";
import {ethers} from "ethers";
import {expect} from "@jest/globals";
// import {newUser} from "./util.ts";

const app = express()
app.use(express.json());

const PORT = 3000;


const blindPaymentSchema = object({
  sender: string().required(),
  receiver:string().required(),
});

export interface BlindPayment {
  sender: string;
  receiver: string;
}

app.get("/", async (request: Request, response: Response) => {

  const blindPaymentDto = await blindPaymentSchema.validate(request.body);

  const {
    sender,
    receiver
  } = blindPaymentDto;





  response.status(200).send("Hello World");
});


app.listen(PORT, () => {
  console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
})