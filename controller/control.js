const { QueryTypes } = require("sequelize")
const databasenya = require("../database/connection")

const register = async (req,res) => {
    const body = req.body

    if (body.username != "" || body.password != "" || body.nama != "" || body.alamat != "" || body.nomorhp != "") {
        const result = await databasenya.query(
            "insert into user(username,password,nama,alamat,nomorhp) values (:username, :password, :nama, :alamat, :nomorhp)",
            {
                type:QueryTypes.INSERT,
                replacements: {
                    username: body.username,
                    password: body.password,
                    nama: body.nama,
                    alamat: body.alamat,
                    nomorhp: body.nomorhp
                }
            }  
        )
    
        if (result) {
            return res.status(200).json({msg: `sukses register`})
        }
    } else {
        return res.status(400).json({msg: `body salah`})
    }
}

const login = async(req,res) => {
    const body = req.body

    if (body.username == "" || body.password == "") {
        return res.status(400).json({msg: `body salah`})  
    }

    else { 
        const result = await databasenya.query(
            "select * from user where username= :username AND password= :password",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: body.username,
                    password: body.password
                }
            }
        )
        if (result.length > 0) {
            return res.status(200).json({msg: `berhasil login`})
        } 
        return res.status(200).json({msg: `gagal login`})
    }
}

const editprofile = async(req,res) => {
    const body = req.body

    if (body.username != "" || body.oldpassword != "" || body.nama != "" || body.alamat != "" || body.nomorhp != "" || body.newpassword != "") {
        const cariuser = await databasenya.query(
            "select * from user where username= :username AND password= :password",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: req.params.username,
                    password: body.oldpassword
                }
            }
        )

        if (cariuser) {
            const updateuser = await databasenya.query(
                "UPDATE user SET nama= :nama, alamat= :alamat, nomorhp= :nomorhp, password= :newpassword",
                {
                    type: QueryTypes.UPDATE,
                    replacements: {
                        nama: body.nama,
                        alamat: body.alamat,
                        nomorhp: body.nomorhp,
                        newpassword: body.newpassword
                    }
                }
                
            )
            return res.status(200).send(updateuser)
        } else {
            return res.status(400).send("gagal update")
        }
    } else {
        return res.status(400).send("gagal")
    }
}

const addfriend = async(req,res) =>{
    const body = req.body
    if (body.username != "" || body.password != "" || body.cariuser != "") {
        const cariusermain = await databasenya.query(
            "select * from user where username= :username AND password= :password",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: body.username,
                    password: body.password
                }
            }
        )

        const cariyangmwdiadd = await databasenya.query(
            "select * from user where username= :username",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: body.username
                }
            }
        )

        const addfriendye = await databasenya.query(
            "insert into friend(user_main, user_friend) values(:user_main,:user_friend)",
            {
                type: QueryTypes.INSERT,
                replacements: {
                    user_main: body.username,
                    user_friend: body.usercari
                }
            }
        )

        if (cariusermain && cariyangmwdiadd) {
            return res.status(200).send(addfriendye)
        }
    }
}

const viewfriend = async(req,res) => {
    const body = req.body

    if (body.password != "") {
        const carisaya = await databasenya.query(
            "select * from user where username= :username && password= :password",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: req.params.username,
                    password: body.password
                }
            }
        )

        const caritemannya = await databasenya.query(
            "Select u.username,u.nama,u.alamat,u.nomorhp from user u join friend f on f.user_friend = u.username where f.user_main = :username",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    username: req.params.username
                }
            }
        )

        if (body.password != "") {
            const hasil = []

            for (let i = 0; i < caritemannya.length; i++) {
                hasil.push({[caritemannya[i].username]: { //di kasi [] lagi agar tidak bingung kalau itu nama property
                    nama: caritemannya[i].nama,
                    alamat: caritemannya[i].alamat,
                    nomorhp: caritemannya[i].nomorhp
                }})
            }
            return res.status(200).send(hasil)
        }
    }
}

const deletefriend = async(req,res) => {
    const body = req.body

    if (body.username != "" || body.password != "" || body.cariuser != "") {
        const dlt = await databasenya.query(
            "delete from friend where user_main=:username and user_friend=:usercari",
            {
                type: QueryTypes.DELETE,
                replacements: {
                    username: body.username,
                    usercari: body.usercari
                }
            }
        )
        return res.status(200).send("berhasil delete")
    } else {
        return res.status(400).send("body salah")
    }
}

const sendmessage = async(req,res) => {
    const body = req.body

    if (body.username != "" || body.password != "" || body.usercari != "" || body.message != "") {
        const kirimpesan = await databasenya.query(
            "insert into message (user_sender, user_receiver, message) values (:user_sender,:user_receiver,:message)",
            {
                type: QueryTypes.INSERT,
                replacements: {
                    user_sender: body.username,
                    user_receiver: body.usercari,
                    message: body.message
                }
            }
        )
        return res.status(200).send("berhasil kirim pesan")
    } else {
        return res.send("body salah")
    }
    
}

const viewmessage = async(req,res)=>{
    let params = req.params
    let body = req.body

    if (!body.password){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUser = await databasenya.query(
        "select * from user where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: params.username,
                password: body.password
            }
        }
    )

    if (checkUser.length == 0){
        return res.status(400).json({
            message: "Username atau Password salah"
        })
    }

    const viewMessage = await databasenya.query(
        "select user_sender as 'from', user_receiver as 'to', message as 'message' from message where user_sender = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username : req.params.username,
            }
        }
    )
    if (viewMessage){
        return res.status(200).json({
            data: viewMessage
        })
    }else{
        return res.status(400).json({
            message: "Gagal menampilkan pesan",
        })
    }
}

module.exports = {
    register,
    login,
    editprofile,
    addfriend,
    viewfriend,
    deletefriend,
    sendmessage,
    viewmessage
}