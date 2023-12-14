
function checkRole(role: any) {
    return function (req: any, res: any, next: any) {
        console.log(req.user)

        if (req.user && req.user.role.name === role) {
            next();
        } else {
            res.status(401).send('Your role does not match to requirements.');
        }
    };
}

export { checkRole }
