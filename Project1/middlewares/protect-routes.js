function protectRoutes(req,res,next) {
    if(!res.locals.isAuth){
        return res.redirect('/401');
    }

    //관리자페이지 접근제한
    if(req.path.startsWith('/admin') && !res.locals.isAdmin){
        return res.redirect('/403');
    }

    next();
}

module.exports = protectRoutes;