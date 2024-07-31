import * as chai from "chai"
import supertest from "supertest"

const expect = chai.expect

const requester = supertest("http://localhost:3030")


describe("Test para los productos", async function(){


        it("Mostrar todos los productos", async function(){
            const products = await requester.get("/api/products")

            expect(Array.isArray(products), true)
            expect(products.ok).to.be.true
            expect(products.statusCode).to.be.equal(200)
        })

        it("Mostrar id ingresado por parametro", async function(){

            const id = "66a5eb02638db459bafbac1b"
            const product = await requester.get(`/api/products/find/${id}`)

            expect(Array.isArray(product), true)
            expect(product.ok).to.be.true
            expect(product.statusCode).to.be.equal(200)
        })



})