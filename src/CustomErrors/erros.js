export class CustomErrors{
    static Errors(name,message,code){
        let error = new Error(message)

        error.name = name
        error.code = code
        return error
    }
}