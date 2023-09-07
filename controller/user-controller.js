//create a func wich will just access the db from model and then 
//it will just get all of the users from db 
//to get all users func. which has the asynchronous req, res at the next 
//NEXT: use this mechanism to impose pre-conditions on a route
const getAllUsers = async (req, res, next) => {
    //find all of users from db
    let users;
    try{
        users = User.find()
    } catch (err){
        return next(err)
    }
    if (!users) {
        return res.status(500).json({ message: "internal server error" });
    }
    return res.status(200).json({ users });
}

exports.getAllUsers = getAllUsers;