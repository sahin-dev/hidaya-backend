import ApiError from "../../utils/AppError";
import Auth from "../Auth/auth.model";
import admin from "./firebaseAdmin";
import httpStatus from "http-status";
import { Request } from "express";
import Notification from "./notification.model";

// Send notification to a single user
export const sendSingleNotification = async (req: Request) => {
  try {
    const { userId } = req.params;
  
    const { title, body } = req.body;
    const myId = req.user.id

    if (!title || !body) {
      throw new ApiError(400, "Title and body are required");
    }

    const user = await Auth.findById(userId);

    if (!user || !user.token) {
      throw new ApiError(httpStatus.NOT_FOUND, "User firebase client token is invalid") 
    }

    const message = {
      notification: {
        title,
        body,
      },
      token: user.token,
    };


    await Notification.create({title,body,receiver:userId,sender:myId})

    const response = await admin.messaging().send(message);
    return response;
  } catch (error: any) {
    console.error("Error sending notification:", error);
    if (error.code === "messaging/invalid-registration-token") {
      throw new ApiError(400, "Invalid FCM registration token");
    } else if (error.code === "messaging/registration-token-not-registered") {
      throw new ApiError(404, "FCM token is no longer registered");
    } else {
      throw new ApiError(500, error.message || "Failed to send notification");
    }
  }
};

// Send notifications to all users with valid FCM tokens
export const handleSendNotifications = async (req: any) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      throw new ApiError(400, "Title and body are required");
    }

    const users = await Auth.find({
      where: {
        fcmToken: {
          not: null,
        },
      },
      select: {
        id: true,
        fcmToken: true,
      },
    });

    if (!users || users.length === 0) {
      return
    }

    const fcmTokens = users.map((user) => user.token);

    const message = {
      notification: {
        title,
        body,
      },
      tokens: fcmTokens,
    };

    const response = await admin
      .messaging()
      .sendEachForMulticast(message as any);

    const successIndices = response.responses
      .map((res: any, idx: number) => (res.success ? idx : null))
      .filter((_:any, idx: number) => idx !== null) as number[];

    const successfulUsers = successIndices.map((idx) => users[idx]);

    const notificationData = successfulUsers.map((user) => ({
      receiverId: user.id,
      senderId: req.user.id,
      title,
      body,
    }));

    notificationData.forEach(async data => {
      await Notification.create({title:data.title, body:data.body, receiver:data.receiverId, sender:data.senderId})
    })


    const failedTokens = response.responses
      .map((res: any, idx: number) => (!res.success ? fcmTokens[idx] : null))
      .filter((token:any): token is string => token !== null);

    return {
      successCount: response.successCount,
      failureCount: response.failureCount,
      failedTokens,
    };
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to send notifications");
  }
};

// // Fetch notifications for the current user
// // Fetch notifications for the current user
// const getNotificationsFromDB = async (req: any) => {
//   try {
//     const userId = req.user.id;

//     // Validate user ID
//     if (!userId) {
//       throw new ApiError(400, "User ID is required");
//     }

//     // Fetch notifications for the current user
//     const notifications = await prisma.notification.findMany({
//       where: {
//         receiverId: userId,
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             email: true,
//             name: true,
//             photos: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     // Check if notifications exist

//     // Return formatted notifications
//     return notifications.map((notification) => ({
//       id: notification.id,
//       title: notification.title,
//       body: notification.body,
//       isRead: notification.isRead,
//       createdAt: notification.createdAt,
//       sender: {
//         id: notification.sender.id,
//         email: notification.sender.email,
//         name: notification.sender.name,
//         images: notification.sender.photos || null,
//       },
//     }));
//   } catch (error: any) {
//     throw new ApiError(500, error.message || "Failed to fetch notifications");
//   }
// };

// // Fetch a single notification and mark it as read
// const getSingleNotificationFromDB = async (
//   req: any,
//   notificationId: string
// ) => {
//   try {
//     const userId = req.user.id;

//     // Validate user and notification ID
//     if (!userId) {
//       throw new ApiError(400, "User ID is required");
//     }

//     if (!notificationId) {
//       throw new ApiError(400, "Notification ID is required");
//     }

//     // Fetch the notification
//     const notification = await prisma.notification.findFirst({
//       where: {
//         id: notificationId,
//         receiverId: userId,
//       },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             email: true,
//             name: true,
//             photos: true,
//           },
//         },
//       },
//     });

//     if( !notification){
//       throw new ApiError (httpStatus.NOT_FOUND, "Notification not found!")
//     }

//     // Mark the notification as read
//     const updatedNotification = await prisma.notification.update({
//       where: { id: notificationId },
//       data: { isRead: true },
//       include: {
//         sender: {
//           select: {
//             id: true,
//             email: true,
//             name: true,
//             photos: true,
           
//           },
//         },
//       },
//     });

//     // Return the updated notification
//     return {
//       id: updatedNotification.id,
//       title: updatedNotification.title,
//       body: updatedNotification.body,
//       isRead: updatedNotification.isRead,
//       createdAt: updatedNotification.createdAt,
//       sender: {
//         id: updatedNotification.sender.id,
//         email: updatedNotification.sender.email,
//         name: updatedNotification.sender.name,
//         images: updatedNotification.sender.photos || null,
//       },
//     };
//   } catch (error: any) {
//     throw new ApiError(500, error.message || "Failed to fetch notification");
//   }
// };

// const readNotification  = async (userId:string,notificationId:string)=>{
//   const notification = await prisma.notification.findUnique({where:{id:notificationId}})

//   if (!notification){
//     throw new ApiError(404, "Notification not found")
//   }

//   if (notification.receiverId !== userId){
//     throw new ApiError(httpStatus.BAD_REQUEST, "You are not allowed to read other's notificatino!")
//   }
//   await prisma.notification.update({where:{id:notificationId}, data:{isRead:true}})

//   return notification
// }

// export const notificationServices = {
//   sendSingleNotification,
//   sendNotifications,
//   getNotificationsFromDB,
//   getSingleNotificationFromDB,
//   readNotification
// };
