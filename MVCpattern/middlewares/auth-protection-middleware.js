function guardRoute(req,res,next){
    if(!res.locals.isAuth){
        return res.status(401).redirect('/401');
    }

    next();
}

module.exports = guardRoute;