import { Request, Response } from "express";
import catchAsync from "../../utils/asyncHandler";
import sendResponse from "../../utils/AppResponse";
import { sendSingleNotification, handleSendNotifications } from "./Notification.service";
import httpStatus from 'http-status'


const sendNotification = catchAsync(async (req: Request, res: Response) => {
  const notification = await sendSingleNotification(req);

 res.status(httpStatus.CREATED).json(new sendResponse(httpStatus.CREATED,notification,`Notification sent successfully`))
});

const sendNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await handleSendNotifications(req);

  res.status(httpStatus.CREATED).json(new sendResponse(httpStatus.CREATED,notifications,"Notification sent to all user successfully"))
});

// const getNotifications = catchAsync(async (req: Request, res: Response) => {
//   const notifications = await notificationServices.getNotificationsFromDB(req);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "Notifications retrieved successfully",
//     data: notifications,
//   });
// });

// const getSingleNotificationById = catchAsync(async (req: Request, res: Response) => {
//   const notificationId = req.params.notificationId;
//   const notification = await notificationServices.getSingleNotificationFromDB(
//     req,
//     notificationId
//   );

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Notification retrieved successfully",
//     data: notification,
//   });
// });


// const readNotification = catchAsync(async (req:Request, res:Response)=>{
//   const notificationId = req.params.notificationId
//   const userId = req.user.id
//   const result = await notificationServices.readNotification(userId!,notificationId)

//   sendResponse(res, {
//     success: true,
//     statusCode: 200,
//     message: "Notification read successfully",
//     data: result,
//   });
// })

export const notificationController = {
  sendNotification,
  sendNotifications,
};
