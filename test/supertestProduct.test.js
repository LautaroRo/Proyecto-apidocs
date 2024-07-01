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

            const id = "6671280f6b624f9cbf904259"
            const product = await requester.get(`/api/products/find/${id}`)

            expect(Array.isArray(product), true)
            expect(product.ok).to.be.true
            expect(product.statusCode).to.be.equal(200)
        })

        it("Agregar un producto", async function() {

            const obj = {
                title: "Producto Vip 2",
                description: "Este es otro producto premium con características avanzadas",
                code: "PREM2",
                category: "Electrónica",
                stock: 5,
                thumbnails: [],
                "status": true,
                "price": 299.99,
            }

            const {ok, statusCode} = await requester.post("/api/products/addProduct").send(obj)

            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)

        })

        it("Eliminar un producto", async function(){

            const code = "PREM2"
            const {ok,statusCode} = await requester.delete(`/api/products/deleteProduct/${code}`)

            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)
        })

        it("Modificar un producto", async function(){

            const id = "6671280f6b624f9cbf904259"
        
            const FirstObj = {
                stock: 200
            }
            const {ok,statusCode} = await requester.put(`/api/products/updateProduct/${id}`).send(FirstObj)

            expect(ok).to.be.true
            expect(statusCode).to.be.equal(200)
        })

})