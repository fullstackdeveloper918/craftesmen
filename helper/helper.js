const HELPER = {};
const fs = require("fs");
const ejs = require("ejs");
const nodemailer = require("nodemailer");
const { admin, bucket } = require("../firebase/firebase_auth");

HELPER.sendEmail = async (Obj) => {
  try {
    const { to, link, template, email_subject, attachmentObj } = Obj;

    const userrecord = await HELPER.getUserByEmail(to);

    const { EMAIL_APP_PASSWORD, EMAIL_APP_EMAIL } = process.env;

    if (userrecord == false) {
      return false;
    }
    const usrname = userrecord?.displayName;
    const subject = email_subject;
    let transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_APP_EMAIL,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    let attachmentsData = [];
    const { attachmentLink, attachmentType } = attachmentObj;
    // Check if attachment exists
    if (attachmentLink && attachmentType) {
      attachmentsData.push({
        filename: attachmentType,
        path: attachmentLink,
      });
    }

    console.log(attachmentsData, "attack");

    const isMailSend = await transporter.sendMail({
      from: EMAIL_APP_EMAIL,
      to: to,
      subject: subject,
      html: ejs.render(
        fs.readFileSync(__dirname + `/../views/${template}`).toString(),
        { usrname, link }
      ),
      attachments: attachmentsData,
    });

    console.log(isMailSend, "isMailSend no");

    if (isMailSend) {
      return true;
    }
  } catch (error) {
    console.log(error.message, "message");
  }
};

HELPER.getUserByEmail = async (email) => {
  return new Promise(function (resolve, reject) {
    admin
      .auth()
      .getUserByEmail(email)
      .then(function (userRecord) {
        resolve(userRecord);
      })
      .catch(function (error) {
        reject(false);
      });
  });
};

HELPER.getPaginate = async (collectionName, lastVisibleDocId = null) => {
  let query = await admin
    .firestore()
    .collection(collectionName)
    .orderBy("created")
    .get();

  const result = [];
  let lastVisible = null;

  query.forEach((doc) => {
    result.push({ id: doc.id, ...doc.data() });
  });
  if (result.length < 1) {
    return res.json({
      status: 500,
      data: [],
    });
  } else {
    let data = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].is_admin == false && result[i].is_archive == false) {
        data.push(result[i]);
      }
    }
    return {
      data,
    };
  }
};

HELPER.getUserById = async (userid) => {
  return new Promise(async function (resolve, reject) {
    const userRef = await admin.firestore().collection("users").doc(userid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      reject(false);
    } else {
      resolve(userDoc.data());
    }
  });
};

HELPER.getRemainsUser = async () => {
  const currentDate = new Date();
  const meeting = await HELPER.meetingDetails();

  let user_uuid = "";

  if (meeting?.data?.length) {
    for (let i = 0; i < meeting.data.length; i++) {
      const endTime = new Date(meeting.data[i].end_time);

      if (currentDate > endTime) {
        const userId = meeting.data[i].host;

        if (Array.isArray(userId)) {
          user_uuid += userId.join(", ") + ", ";
        } else {
          user_uuid += userId + ", ";
        }
      }
    }
  }

  user_uuid = user_uuid.slice(0, -2);

  const totalUser = await HELPER.getExpirMeetingUser(user_uuid);

  return totalUser;
};

HELPER.getExpirMeetingUser = async (userUuid) => {
  return new Promise(async (resolve, reject) => {
    const uniqu = userUuid.split(",");

    const uniqueArray = [...new Set(uniqu)];

    for (let j = 0; j < uniqueArray.length; j++) {
      const uid = uniqueArray[j].trim();

      const userData = await HELPER.getUserById(uid);

      if (userData) {
        resolve(userData);
      } else {
        reject(false);
      }
    }
  });
};

HELPER.meetingDetails = async () => {
  const meetingList = await admin
    .firestore()
    .collection("meeting")
    .where("is_archive", "==", false);

  return new Promise((resolve, reject) => {
    meetingList.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (data.length > 1) {
        let dataObj = {
          data,
        };
        resolve(dataObj);
      } else {
        reject(false);
      }
    });
  });
};

HELPER.deleteImages = async (imgName) => {
  const fileName = imgName.split("/").pop().split("?")[0];

  // Delete the file from Firebase Storage
  const file = bucket.file(fileName);
  return await file.delete();
};

module.exports = HELPER;
