
export const getpost = async (req,res) => {
    try {
        const users = await users.find();
        res.status(200).json(users)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}
//use export to use it in route

export const createuser = (req,res) => {

}