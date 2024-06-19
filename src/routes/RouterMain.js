import { Router } from "express";

export default class RouterMain {
    constructor() {
        this.Router = Router();
        this.init();
    }

    getRouter() {
        return this.Router;
    }

    init() {
    }

    get(path, ...callbacks) {
        this.Router.get(path, ...this.applyCallbacks(callbacks), this.generateCustomResponse);
    }
    
    post(path, ...callbacks) {
        this.Router.post(path, ...this.applyCallbacks(callbacks), this.generateCustomResponse);
    }
    put(path, ...callbacks) {
        this.Router.put(path, ...this.applyCallbacks(callbacks), this.generateCustomResponse);
    }
    delete(path, ...callbacks) {
        this.Router.delete(path, ...this.applyCallbacks(callbacks), this.generateCustomResponse);
    }
    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback(...params);
            } catch (error) {
                console.log(error);
                params[1].status(500).send(error);
            }
        });
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (payload) => res.send({ status: "Success", payload });
        res.sendUserError = (error) =>  res.status(400).send({ status: "Error", error });
        next();
    }
}