import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"


const _filname = fileURLToPath(import.meta.url)
const _dirname = dirname(_filname)

export const createHas = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export default _dirname