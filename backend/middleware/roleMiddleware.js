const roleAccess = (req, res, next) => {
    try {
        if(req.body.role == 'admin'){
            return next();
        }else{
            res.send("You cannot access this route.")
        }
    }catch(error){
        console.log(error);
    }
}

const advisorRole = (req, res, next) => {
    try {
        if(req.body.role == 'advisor'){
            return next();
        }else{
            res.send("You cannot access this route.")
        }
    }catch(error){
        console.log(error);
    }
}

export { roleAccess, advisorRole };
