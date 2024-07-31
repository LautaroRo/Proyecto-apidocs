import * as chai from "chai"
import supertest from "supertest"
import mongoose from "mongoose"

const connection = mongoose.connect(`mongodb+srv://Lautaro:Ors6E5ixvF0N1pVh@cluster0.beeo5kk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)

const expect = chai.expect

const requester = supertest("http://localhost:3030")

describe("Test carrito", function(){
    this.timeout(3000);
    after(async function() {
        process.exit(0);
    });

        it("Testpara crear un carrito", async function() {

            const uid = "6667fc7b85b26a06209f10d3"
    
            const {ok,statusCode} = await requester.post(`/api/cart/create/${uid}`)


            await requester.delete(`/api/cart/deleteCart/${uid}`)
            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
        })

        it("Mostrar todos los carrito", async function(){

            const {ok, statusCode, body} = await requester.get("/api/cart")

            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)
            expect(Array.isArray(body), true)

        })
})



