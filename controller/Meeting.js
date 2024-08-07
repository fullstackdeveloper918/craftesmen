const Meeting = {};
const { admin, bucket } = require("../firebase/firebase_auth");
const helper = require("../helper/helper");
const moment = require("moment-timezone");

Meeting.add = async (req, res) => {
  try {
    const {
      meeting_name,
      meeting_type,
      start_time,
      end_time,
      year,
      location,
      hotel,
      airport,
      host_company,
      host,
      cell,
      weather,
      comments,
      notes,
      phone,
      start_meeting_date,
      end_meeting_date,
      meeting_time_zone,
    } = req.body;

    const mettingObj = {
      meeting_name: meeting_name ? meeting_name : null,
      meeting_type: meeting_type ? meeting_type : null,
      start_time: start_time ? start_time : null,
      end_time: end_time ? end_time : null,
      year: year ? year : null,
      location: location ? location : null,
      hotel: hotel ? hotel : null,
      airport: airport ? airport : null,
      host_company: host_company ? host_company : null,
      host: host ? host : null,
      cell: cell ? cell : null,
      weather: weather ? weather : null,
      comments: comments ? comments : null,
      notes: notes ? notes : null,
      phone: phone ? phone : phone,
      is_archive: false,
      created: admin.firestore.Timestamp.now(),
      start_meeting_date: start_meeting_date ? start_meeting_date : null,
      end_meeting_date: end_meeting_date ? end_meeting_date : null,
      meeting_time_zone: meeting_time_zone ? meeting_time_zone : null,
    };

    const docRef = await admin.firestore().collection("meeting").doc();

    await docRef.set(mettingObj);

    const docId = docRef.id;

    if (docId) {
      let metObj = {
        start_meeting_date: start_meeting_date,
        meeting_time_zone: meeting_time_zone,
        meeting_id: docId,
      };
      await Meeting.addUserInMeeting(metObj);
      res.status(200).json({
        status: 200,
        message: "Meeting Created",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

Meeting.addUserInMeeting = async (obj) => {
  const { meeting_time_zone, start_meeting_date, meeting_id } = obj;

  const startMeetingDate = moment
    .tz(start_meeting_date, meeting_time_zone)
    .toDate();
  const startTime = moment.tz(startMeetingDate, meeting_time_zone).toDate();
  const record = moment(startTime).subtract(5, "days").startOf("day").toDate();

  console.log(record, "record ");
  const userSnapshot = await admin
    .firestore()
    .collection("users")
    .where("created", "<", record)
    .get();

  const users = new Map();
  userSnapshot.forEach((doc) => {
    // Add unique users to Map based on user ID
    if (!users.has(doc.id)) {
      users.set(doc.id, { id: doc.id, ...doc.data() });
    }
  });

  const uniqueUsers = Array.from(users.values());

  const joinMeetingPromises = uniqueUsers
    .filter((user) => !user.is_admin && user.is_completed)
    .map(async (user) => {
      console.log(user, "users");
      const joinMeetingObj = {
        meeting_id: meeting_id,
        user_id: user.id,
        created: admin.firestore.Timestamp.now(),
      };
      console.log(joinMeetingObj, "join meeting obj");
      await admin
        .firestore()
        .collection("user_joined_meeting")
        .doc()
        .set(joinMeetingObj);
    });

  return await Promise.all(joinMeetingPromises);
};

Meeting.detail = async (req, res) => {
  try {
    const { meeting_id } = req.body;
    const detail = await admin
      .firestore()
      .collection("meeting")
      .doc(meeting_id)
      .get();

    if (!detail.exists) {
      console.log("No document");
    } else {
      let meetingDetail = detail.data();
      meetingDetail.id = meeting_id;

      console.log(meetingDetail, "meetingDetail");

      res.json({
        status: 200,
        data: meetingDetail,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

Meeting.list = async (req, res) => {
  // const userId = req.decodedToken.uid;
  // // const detail = await helper.getUserById(userId);

  // // console.log(detail, "detail in here");
  // // if (detail.is_admin == true) {

  const meetingList = await admin
    .firestore()
    .collection("meeting")
    .orderBy("start_meeting_date");

  try {
    meetingList.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data.length < 1) {
        return res.json({
          status: 500,
          data: [],
        });
      } else {
        let newData = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].is_archive == false) {
            newData.push(data[i]);
          }
        }
        return res.status(201).json(newData);
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.delete = async (req, res) => {
  try {
    const { meeting_id } = req.body;
    const isDeleted = await admin
      .firestore()
      .collection("meeting")
      .doc(meeting_id)
      .update({
        is_archive: true,
      });

    console.log(isDeleted, "is deleted");
    if (isDeleted) {
      res.json({
        status: 200,
        message: "Meeting Deleted",
      });
    } else {
      res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error.message, "message");
  }
};

Meeting.update = async (req, res) => {
  try {
    const {
      meeting_name,
      meeting_type,
      start_time,
      end_time,
      year,
      location,
      hotel,
      airport,
      host_company,
      host,
      cell,
      weather,
      comments,
      notes,
      club_member,
      phone,
      meeting_id,
      start_meeting_date,
      end_meeting_date,
      meeting_time_zone,
    } = req.body;

    const updatedMeetingObj = {
      meeting_name: meeting_name ? meeting_name : null,
      meeting_type: meeting_type ? meeting_type : null,
      start_time: start_time ? start_time : null,
      end_time: end_time ? end_time : null,
      year: year ? year : null,
      location: location ? location : null,
      hotel: hotel ? hotel : null,
      airport: airport ? airport : null,
      host_company: host_company ? host_company : null,
      host: host ? host : null,
      cell: cell ? cell : null,
      weather: weather ? weather : null,
      comments: comments ? comments : null,
      notes: notes ? notes : null,
      club_member: club_member ? club_member : null,
      phone: phone ? phone : phone,
      start_meeting_date: start_meeting_date ? start_meeting_date : null,
      end_meeting_date: end_meeting_date ? end_meeting_date : null,
      meeting_time_zone: meeting_time_zone ? meeting_time_zone : null,
    };

    console.log(updatedMeetingObj, "updatemetting obj");
    const isDeleted = await admin
      .firestore()
      .collection("meeting")
      .doc(meeting_id)
      .update(updatedMeetingObj);

    console.log(isDeleted, "is deleted");
    if (isDeleted) {
      res.json({
        status: 200,
        message: "Meeting Updated",
      });
    } else {
      res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

Meeting.archive = async (req, res) => {
  try {
    const archivelist = await admin
      .firestore()
      .collection("meeting")
      .where("is_archive", "==", true)
      .get();

    let result = [];
    archivelist.forEach((doc) => {
      result.push(doc.data());
    });

    if (result != undefined) {
      res.json({
        status: 200,
        data: result,
      });
    } else {
      res.json({
        status: 500,
        message: "No Data is Avaiable",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

Meeting.userUpcomingMeeting = async (req, res) => {
  try {
    // const { user_id } = req.decodedToken;

    const upcomingMeetingList = await admin
      .firestore()
      .collection("meeting")
      .where("is_archive", "==", false)
      // .orderBy("created", "DESC")
      .get();

    let data = [];
    upcomingMeetingList.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    let upComingMeeting = [];
    for (let i = 0; i < data.length; i++) {
      const timezone = data[i].meeting_time_zone;
      const currentDate = moment.tz(timezone).toDate();
      console.log(currentDate, "curent date");
      const start_meeting_date = moment
        .tz(data[i].start_meeting_date, timezone)
        .toDate();
      // const end_meeting_date = moment
      //   .tz(data[i].end_meeting_date, timezone)
      //   .toDate();

      if (start_meeting_date > currentDate) {
        upComingMeeting.push(data[i]);
      }
    }

    if (upComingMeeting.length > 0) {
      res.status(200).json({
        status: 200,
        result: upComingMeeting,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "No Data is Available",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.remainsUserForComingMeeting = async (req, res) => {
  try {
    const remainingUser = await helper.getRemainsUser();
    let arr = [];
    arr.push(remainingUser);

    if (arr.length > 0) {
      res.json({
        status: 200,
        data: arr.length,
      });
    } else {
      res.json({
        status: 200,
        data: [],
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.nextTwoMeeting = async (req, res) => {
  try {
    const { user_id } = req.decodedToken;
    const upcomingMeetingList = await admin
      .firestore()
      .collection("meeting")
      .where("host", "array-contains", user_id)
      .get();

    let data = [];
    upcomingMeetingList.forEach((doc) => {
      data.push(doc.data());
    });

    const currentDate = new Date();
    let nextMeetings = [];

    for (let i = 0; i < data.length; i++) {
      const end_time = new Date(data[i].end_time);

      if (end_time > currentDate) {
        nextMeetings.push(data[i]);
      }
    }

    if (nextMeetings.length > 0) {
      res.json({
        status: 200,
        resutl: nextMeetings,
      });
    } else {
      res.json({
        status: 500,
        message: "No Data is Avaiable",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

Meeting.completeUncompleteForm = async (req, res) => {
  try {
    const upcomingMeetingList = await admin
      .firestore()
      .collection("meeting")
      .orderBy("created", "DESC")
      .get();

    let data = [];
    upcomingMeetingList.forEach((doc) => {
      data.push(doc.data());
    });

    let users = new Map(); // Use Map to track unique users

    for (let i = 0; i < data.length; i++) {
      const timezone = data[i].meeting_time_zone;
      const is_archive = data[i].is_archive;
      const currentDate = moment.tz(timezone).toDate();
      const startMeetingDate = moment
        .tz(data[i].start_meeting_date, timezone)
        .toDate();

      if (is_archive == false && startMeetingDate > currentDate) {
        const startTime = moment.tz(startMeetingDate, timezone).toDate();
        const record = moment(startTime)
          .subtract(5, "days")
          .startOf("day")
          .toDate();

        const userLastCreatedRecord = await admin
          .firestore()
          .collection("users")
          .where("created", "<", record)
          .get();

        userLastCreatedRecord.forEach((doc) => {
          // Add unique users to Map based on user ID
          if (!users.has(doc.id)) {
            users.set(doc.id, { id: doc.id, ...doc.data() });
          }
        });
      }
    }

    // Convert Map to array and log the unique users
    const uniqueUsers = Array.from(users.values());
    let TotalUser = 0;
    let totalCompleted = 0;
    let totalUncompleted = 0;

    // Count based on criteria
    uniqueUsers.forEach((user) => {
      if (user.is_admin === false) {
        TotalUser++;
      }
      if (user.is_completed === true) {
        totalCompleted++;
      }
      if (user.is_completed === false) {
        totalUncompleted++;
      }
    });

    // Log the results
    res.status(200).json({
      status: 200,
      data: {
        TotalUser,
        totalCompleted,
        totalUncompleted,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.springFallMeetingCount = async (req, res) => {
  try {
    const springFallMeeting = await admin
      .firestore()
      .collection("meeting")
      .where("is_archive", "==", false)
      // .orderBy("created", "DESC")
      .get();

    let meetingData = [];
    springFallMeeting.forEach((doc) => {
      meetingData.push(doc.data());
    });

    // Get the current date and time
    const currentDate = new Date();

    // Initialize counters for spring and fall meetings
    let spring = 0;
    let fall = 0;

    for (let i = 0; i < meetingData.length; i++) {
      const timezone = meetingData[i].meeting_time_zone;
      const startMeetingDate = moment
        .tz(meetingData[i].start_meeting_date, timezone)
        .toDate();

      // Extract year from startMeetingDate
      const year = startMeetingDate.getFullYear();

      // Count meetings if they are after the current date
      if (startMeetingDate > currentDate) {
        if (year == 2024) {
          // if (meetingData[i].meeting_type === "spring") {
          //   spring++;
          // } else if (meetingData[i].meeting_type === "fall") {
          //   fall++;
          // }
          if (meetingData[i].meeting_type === "fall") {
            fall++;
          }
        } else if (year == 2025) {
          if (meetingData[i].meeting_type === "spring") {
            spring++;
          }
          // } else if (meetingData[i].meeting_type === "fall") {
          //   fall++;
          // }
        }
        // if (year > 2023) {
        //   if (meetingData[i].meeting_type === "spring") {
        //     spring++;
        //   } else if (meetingData[i].meeting_type === "fall") {
        //     fall++;
        //   }
        // }
      }
    }

    res.status(200).json({
      status: 200,
      data: {
        spring,
        fall,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.pastMeetings = async (req, res) => {
  try {
    const pastingMeetingList = await admin
      .firestore()
      .collection("meeting")
      .where("is_archive", "==", false)
      // .orderBy("created", "DESC")
      .get();

    let data = [];
    pastingMeetingList.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    let pastMeetingData = [];
    for (let i = 0; i < data.length; i++) {
      const timezone = data[i].meeting_time_zone;
      const currentDate = moment.tz(timezone).toDate();

      const start_meeting_date = moment
        .tz(data[i].start_meeting_date, timezone)
        .toDate();

      if (start_meeting_date < currentDate) {
        pastMeetingData.push(data[i]);
      }
    }

    console.log(pastMeetingData, "pastMeetingDatapastMeetingData");
    if (pastMeetingData.length > 0) {
      res.status(200).json({
        status: 200,
        result: pastMeetingData,
      });
    } else {
      res.status(404).json({
        status: 204,
        message: "No Data is Available",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.fiveDayMeetingCountDown = async (req, res) => {
  try {
    const countDownFiveDaysList = await admin
      .firestore()
      .collection("meeting")
      .orderBy("start_meeting_date")
      .get();

    let data = [];
    countDownFiveDaysList.forEach((doc) => {
      data.push(doc.data());
    });
    let startTime = [];
    for (let i = 0; i < data.length; i++) {
      const timezone = data[i].meeting_time_zone;
      const is_archive = data[i].is_archive;
      const currentDate = moment.tz(timezone).toDate();
      const startMeetingDate = moment
        .tz(data[i].start_meeting_date, timezone)
        .toDate();

      if (is_archive == false && startMeetingDate > currentDate) {
        // const startTime = moment.tz(startMeetingDate, timezone).toDate();

        // const days = Math.abs(startTime.getTime() - currentDate.getTime());

        // const milliseconds = 1000 * 60 * 60 * 24;
        // const completed = Math.floor(days / milliseconds);

        // fullData = {
        //   days: completed,
        //   startTime: startTime,
        // };
        const data = moment.tz(startMeetingDate, timezone).toDate();

        startTime.push(data);
      }
    }

    res.json({
      status: 200,
      startTime,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Meeting.pastMeetingsUsers = async (req, res) => {
  try {
    const { meeting_id } = req.body;

    // Query the "user_joined_meeting" collection to find documents with the specified meeting_id
    const joinedMeetingSnapshot = await admin
      .firestore()
      .collection("user_joined_meeting")
      .where("meeting_id", "==", meeting_id)
      .get();

    if (joinedMeetingSnapshot.empty) {
      return res.status(400).json({
        status: 400,
        message: "No Result Found",
      });
    }

    // Extract the user_ids from the query results
    const userIds = joinedMeetingSnapshot.docs.map((doc) => doc.data().user_id);

    // Retrieve user data for each user_id and include the user_id in the result
    const newResult = await Promise.all(
      userIds.map(async (userId) => {
        const userData = await helper.getUserById(userId);
        return { user_id: userId, ...userData };
      })
    );

    // Send the response with the retrieved user data
    console.log(newResult, "result ");
    res.status(200).json({
      status: 200,
      newResult,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = Meeting;
