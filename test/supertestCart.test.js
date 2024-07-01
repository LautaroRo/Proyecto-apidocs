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

        it("Añadir y eliminar un producto del carrito un producto en el carrito", async function(){

            const obj = {
                cid:"6672886d450c5d04428c56d3",
                pid:"6671280f6b624f9cbf904259",
                cantidad: 1
            }

            const {ok, statusCode, body} = await requester.post("/api/cart/addProduct").send(obj)

            const obj2 = {
                cid: obj.cid,
                pid: obj.pid
            }
            await requester.delete("/api/cart/deleteAllProduct").send(obj2)
            await requester.put(`/api/products/updateProduct/${obj.pid}`).send({stock:200})
            expect(ok).to.be.equal(true)
            expect(statusCode).to.be.equal(200)

        })
})



