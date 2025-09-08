import Auth from "../Auth/auth.model"
import { AuthService } from "../Auth/auth.service"

let months = [
    null,
    "January",
    "February" ,
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

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

export const getMonthlyUserCreation = async (year:string | number)=> {
    if (typeof year === 'string') {
    year = parseInt(year, 10);
  }
  const result = await Auth.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
        }
      }
    },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        count: 1
      }
    },
    { $sort: { month: 1 } }
  ]);

  // Fill missing months with 0
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const found = result.find(r => r.month === i + 1);
    return { month: months[i+1], count: found ? found.count : 0 };
  });



  return monthlyData;
}
