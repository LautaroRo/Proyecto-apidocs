import passport from "passport";
import local from "passport-local"
import { createHas, isValidPassword } from "../utils.js";
import { users } from "../dao/factory.js";
import transport from "./mailing.js";
import { entorno } from "./variables.config.js";
const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {

                const { first_name, last_name, role, number, age, email } = req.body

                try {

                    const user = await users.getOne(username);

                    if (user) {
                        return done(null, false)
                    }


                    const newUser = {
                        first_name,
                        last_name,
                        role,
                        number,
                        age,
                        email,
                        password: createHas(password),
                    }

                    req.session.user = {
                        first_name: first_name,
                        last_name: last_name,
                        age: age,
                        email: email
                    };

            
                    const result = await users.createUser(newUser)


                    await transport.sendMail({
                        from:`Correo de prueba <${entorno.MAIL_USERNAME}/>`,
                        to: email,
                        subject: "Correo de prueba",
                        html: `
                            <div>
                                <h1>Registrado con exito </h1>

                                <h3>Saludos ${first_name} ${last_name}</h3>
                            </div>
                        `
                    })

                    return done(null, result)
                } catch (error) {
                    return done(error)
                }
            }
        )
    );

    passport.use(
        "login",
        new LocalStrategy({ usernameField: "email" },

            async (username, password, done) => {

                try {
                    const user = await users.getOne(username);
                    if (!user) return done(null, false);
                    const valid = isValidPassword(user, password);
                    if (!valid) return done(null, false);

                    const newDate = {
                        last_connection: Date.now()
                    }
                    
                    const lastConnectionDate = new Date(newDate.last_connection);
                    
                    const formattedDate = lastConnectionDate.toLocaleString('es-ES', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit', 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        second: '2-digit'
                    });

                    user.last_connection = formattedDate;
                    
                    await users.updateUser(user._id, user)

                    await transport.sendMail({
                        from:`Correo de prueba <${entorno.MAIL_USERNAME}/>`,
                        to: user.email,
                        subject: "Correo de prueba",
                        html: `
                            <div>
                                <h1>Logeado con exito</h1>

                                <h3>Saludos ${user.first_name} ${user.last_name}</h3>
                            </div>
                        `
                    })

                    return done(null, user);
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await users.getUserById(id)

            done(null, user)
        }

        catch (error) {

            done(error)
        }
    })
}

export default initializePassport