import * as chai from "chai"
import supertest from "supertest"
import { entorno } from "../src/config/variables.config.js"
const expect = chai.expect

const requester = supertest("http://localhost:3030")


describe("Test sessions", async function(){
    this.timeout(10000);

    after(function() {
        process.exit(0);
    });
    this.afterEach( () => {
        this.timeout(7000);
    })

    it("Test login", async() => {


        const profile = {
            email: entorno.USERNAME_TEST,
            password: entorno.PASSWORD_TEST
        }

        const {ok , statusCode} = await requester.post("/api/sessions/login").send(profile)

        expect(ok).to.be.true
        expect(statusCode).to.be.equal(200)
    })

    it("Test register", async () => {
        const obj = {
            first_name: "Lionel",
            last_name: "Messi",
            email: "Messi@gmail.com",
            age: 37,
            number: 4235643765,
            role: "Premium",
            password: "Ronaldo"
        }

        const {ok, statusCode} = await requester.post("/api/sessions/register").send(obj)

        expect(ok).to.be.true
        expect(statusCode).to.be.equal(200)


        const elimanted = await requester.delete(`/api/sessions/deleteUser/${obj.email}`)


        expect(elimanted.ok).to.be.true
        expect(elimanted.statusCode).to.be.equal(200)
    })
})