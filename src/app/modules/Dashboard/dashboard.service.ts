import { AuthService } from "../Auth/auth.service"

enum Months{
    "January"
}

export const getCurrentYearUserGrowth = async (currentDate:Date)=>{
    let userMatrics = new Map<number, number>()

    const currentYear = new Date(currentDate).getFullYear()

    const users = await AuthService.getAllUsers()
    console.log(users)

    users.forEach(user => {
        let creationDate = new Date(user.createdAt)
        let creatinoYear = creationDate.getFullYear()
        let creationMonth = creationDate.getMonth()

        if (userMatrics.has(creationMonth)){
            let count = userMatrics.get(creationMonth)
            if(count){
                userMatrics.set(creationMonth, count+1)
            }
            
        }
    })

    return userMatrics
    
}