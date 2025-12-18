import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { AppDataSource } from './database';
import { User } from '../entities/User';

const UserRepo = AppDataSource.getRepository(User);

const options = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies.token
    ]), secretOrKey: process.env.JWT_SECRET!
}

passport.use( new JwtStrategy(options,async(payload,done) => {
    try{
        const user = await UserRepo.findOne({ where: {id:payload.userId}});

        if(!user){
            return done(null,false);
        }
        return done(null,user);
    }catch(error){
        return done(error,false)
    }
}))

export default passport;