const USER = {};
const { admin, bucket } = require("../firebase/firebase_auth");
const saltedMd5 = require("salted-md5");
const path = require("path");
const helper = require("../helper/helper");
const { v4: uuidv4 } = require("uuid");

USER.register = async (req, res) => {
  try {
    // hello
    if (req.body?.first_step) {
      admin
        .auth()
        .createUser({
          displayName: req?.body?.first_step?.firstname + req?.body?.lastname,
          email: req?.body?.first_step?.email,
          password: req?.body?.first_step?.password,
        })
        .then(async (userRecord) => {
          admin
            .firestore()
            .collection("users")
            .doc(userRecord.uid)
            .set({
              firstname: req?.body?.first_step?.firstname
                ? req?.body?.first_step?.firstname
                : "",
              lastname: req?.body?.first_step?.lastname
                ? req?.body?.first_step?.lastname
                : "",
              email: req?.body?.first_step?.email
                ? req?.body?.first_step?.email
                : "",
              password: req?.body?.first_step?.password
                ? req?.body?.first_step?.password
                : "",
              phone_number: req?.body?.first_step?.mobile
                ? req?.body?.first_step?.mobile
                : "",
              company_name: req?.body?.first_step?.company_name
                ? req?.body?.first_step?.company_name
                : "",
              position: req?.body?.first_step?.position
                ? req?.body?.first_step?.position
                : "",
              home_city: req?.body?.first_step?.home_city
                ? req?.body?.first_step?.home_city
                : "",
              created: admin.firestore.Timestamp.now()
                ? admin.firestore.Timestamp.now()
                : "",

              is_admin: false,
              totalUsersInMeetingWithCurrent: 0,
              totalCompletedForm: 0,
              totalUncompletedForm: 0,
              is_completed: false,
              is_activate: false,
              is_archive: false,
            });

          let obj = {
            to: req?.body?.first_step?.email,
            template: "member_register.ejs",
            email_subject: "You have added as a member",
            attachmentObj: false,
            link: false,
          };
          const sendEmail = await helper.sendEmail(obj);

          // console.log(sendEmail, "sendEmail");

          res.status(200).json({
            user_id: userRecord.uid,
            message: "User registration successful",
          });
        })
        .catch((error) => {
          if (
            (error.message =
              "The email address is already in use by another account.")
          ) {
            res.status(409).json({ error: error.message });
          } else {
            res.status(500).json({ error: error.message });
          }
        });
    } else if (req?.body?.bussiness_update) {
      const businessUpdate = {
        financial_position: req?.body?.bussiness_update?.financial_position
          ? req?.body?.bussiness_update?.financial_position
          : "",
        sales_position: req?.body?.bussiness_update?.sales_position
          ? req?.body?.bussiness_update?.sales_position
          : "",
        accomplishments: req?.body?.bussiness_update?.accomplishments
          ? req?.body?.bussiness_update?.accomplishments
          : "",
        hr_position: req?.body?.bussiness_update?.hr_position
          ? req?.body?.bussiness_update?.hr_position
          : "",
        current_challenges: req?.body?.bussiness_update?.current_challenges
          ? req?.body?.bussiness_update?.current_challenges
          : "",
        craftsmen_support: req?.body?.bussiness_update?.craftsmen_support
          ? req?.body?.bussiness_update?.craftsmen_support
          : "",
        is_completed: false,
      };

      console.log(businessUpdate, "business update");
      console.log(req?.body?.bussiness_update?.userId, "userId");
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.bussiness_update?.userId)
        .update(businessUpdate);

      res.status(200).json({
        user_id: req?.body?.bussiness_update?.userId,
        message: "User sdf",
      });
    } else if (req?.body?.goals) {
      const goals = {
        goal_last_meeting: req?.body?.goals?.goal_last_meeting
          ? req?.body?.goals?.goal_last_meeting
          : "",
        goal_next_meeting: req?.body?.goals?.goal_next_meeting
          ? req?.body?.goals?.goal_next_meeting
          : "",
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.goals?.userId)
        .update(goals);
      res.status(200).json({
        userId: req?.body?.goals?.userId,
        message: "Goals Updated",
      });
    } else if (req?.body?.craftsmen_toolbox) {
      const craftsmenToalBox = {
        technology: req?.body?.craftsmen_toolbox?.technology
          ? req?.body?.craftsmen_toolbox?.technology
          : "",
        products: req?.body?.craftsmen_toolbox?.products
          ? req?.body?.craftsmen_toolbox?.products
          : "",
        project: req?.body?.craftsmen_toolbox?.project
          ? req?.body?.craftsmen_toolbox?.project
          : "",
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.craftsmen_toolbox?.userId)
        .update(craftsmenToalBox);
      res.status(200).json({
        userId: req?.body?.craftsmen_toolbox?.userId,
        message: "Update Crafsmen",
      });
    } else if (req?.body?.craftsmen_checkup) {
      const crafstMenCheckup = {
        commitment: req?.body?.craftsmen_checkup?.commitment
          ? req?.body?.craftsmen_checkup?.commitment
          : "",
        contribute: req?.body?.craftsmen_checkup?.contribute
          ? req?.body?.craftsmen_checkup?.contribute
          : "",
        wellbeing: req?.body?.craftsmen_checkup?.wellbeing
          ? req?.body?.craftsmen_checkup?.wellbeing
          : "",
        contact_info: req?.body?.craftsmen_checkup?.contact_info
          ? req?.body?.craftsmen_checkup?.contact_info
          : "",
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.craftsmen_checkup?.userId)
        .update(crafstMenCheckup);
      res.status(200).json({
        userId: req?.body?.craftsmen_checkup?.userId,
        message: "Update craftsmen checkup",
      });
    } else if (req?.body?.fall_meeting_review) {
      const metingReview = {
        fall_meeting: req?.body?.fall_meeting_review?.fall_meeting
          ? req?.body?.fall_meeting_review?.fall_meeting
          : "",
        personal_finances: req?.body?.fall_meeting_review?.personal_finances
          ? req?.body?.fall_meeting_review?.personal_finances
          : "",
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.fall_meeting_review?.userId)
        .update(metingReview);
      res.status(200).json({
        userId: req?.body?.fall_meeting_review?.userId,
        message: "Update fall meeting review",
      });
    } else if (req?.body?.spring_meeting) {
      const springMeting = {
        estimating: req?.body?.spring_meeting?.estimating
          ? req?.body?.spring_meeting?.estimating
          : "",
        accountability: req?.body?.spring_meeting?.accountability
          ? req?.body?.spring_meeting?.accountability
          : "",
        productivity: req?.body?.spring_meeting?.productivity
          ? req?.body?.spring_meeting?.productivity
          : "",
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.spring_meeting.userId)
        .update(springMeting);
      res.status(200).json({
        userId: req?.body?.spring_meeting.userId,
        message: "Update metingReview",
      });
    } else if (req?.body?.photo_section) {
      const photoSection = {
        photo_comment: req?.body?.photo_section?.photo_comment
          ? req?.body?.photo_section?.photo_comment
          : "",
        is_completed: true,
        is_draft:
          req?.body?.photo_section.is_action == "completed"
            ? "completed"
            : "Draft",
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.photo_section?.userId)
        .update(photoSection);
      res.status(200).json({
        userId: req?.body?.photo_section?.userId,
        message: "Update Photo Section",
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error, "errro");
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

USER.uploadFile = async (req, res) => {
  const files = req.files;
  const body = req.body;

  console.log(files, "filess is here");
  console.log(body, "body is here");

  if (!files || files.length === 0 || !body) {
    return res.status(400).json({ message: "No files or data provided" });
  }

  // Create a map to store files grouped by comments
  const filesByComment = {};

  // Separate files based on comment keys
  files.forEach((file) => {
    // Extract comment key from field name
    const commentKey = file.fieldname.split("_file")[0];

    if (!filesByComment[commentKey]) {
      filesByComment[commentKey] = [];
    }
    filesByComment[commentKey].push(file);
  });

  // Upload files to Firebase Storage and store URLs
  const fileUrls = {};

  for (const [commentKey, files] of Object.entries(filesByComment)) {
    fileUrls[commentKey] = {
      comment: body[commentKey] || "", // Include the comment text
      images: [], // Initialize an array to hold image URLs
    };

    for (const file of files) {
      const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
      const fileUpload = bucket.file(fileName);

      // Create a write stream to upload the file
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        res.status(500).send(err);
      });

      blobStream.on("finish", async () => {
        try {
          await fileUpload.makePublic();
          const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          fileUrls[commentKey].images.push(fileUrl);

          // Send response only after all files are uploaded
          if (
            Object.keys(fileUrls).every(
              (key) =>
                fileUrls[key].images.length === filesByComment[key].length
            )
          ) {
            // Store metadata in Firestore
            const userId = req.body?.id;
            const is_completed = true;

            await admin.firestore().collection("comments").doc().set({
              userId,
              is_completed,
              fileUrls,
              created: admin.firestore.Timestamp.now(),
            });

            await admin.firestore().collection("users").doc(userId).update({
              is_completed: true,
              updatedAt: admin.firestore.Timestamp.now(),
            });
            const pdfReponseData = await USER.detailWithPhotoSectionById(
              userId
            );

            console.log(pdfReponseData, "response");
            res.status(201).json({
              status: 201,
              message: "Files uploaded successfully",
              fileUrls,
              pdfReponseData,
            });
          }
        } catch (err) {
          console.error("Error getting signed URL:", err);
          res.status(500).send(err);
        }
      });

      blobStream.end(file.buffer);
    }
  }
};

USER.detailWithPhotoSectionById = (userId) => {
  return new Promise(async (resolve, reject) => {
    const userRef = admin.firestore().collection("users").doc(userId);

    const userDoc = await userRef.get();
    const section = await USER.photoSectionById(userId);

    let detail = userDoc.data();

    detail.uid = userId;
    if (section != false) {
      detail.photo_section = section;
    }

    if (!userDoc.exists) {
      reject(false);
    } else {
      resolve(detail);
    }
  });
};

USER.sendCompleteFormEmailMailtoSuperAdmin = async (req, res) => {
  try {
    const name = saltedMd5(req.file?.originalname, "SUPER-S@LT!");
    const { user_id } = req.body;
    const fileName = name + path.extname(req.file?.originalname);
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file?.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: "Something went wrong",
      });
    });

    stream.on("finish", async () => {
      try {
        // Make the file public if needed
        await fileUpload.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log(fileUrl, "fileUrl");

        const pdfData = await admin
          .firestore()
          .collection("completefor-pdf")
          .doc();

        await pdfData.set({
          user_id: user_id,
          pdf: fileUrl,
          created: admin.firestore.Timestamp.now(),
        });

        const obj = {
          template: "superadmin_complete_form_email.ejs",
          email_subject: "User Form Completion",
          to: "craftsmen@groups.io",
          attachmentObj: {
            attachmentLink: fileUrl,
            attachmentType: ".pdf",
          },
        };

        const sendEmail = await helper.sendEmail(obj);

        console.log(sendEmail, "send email");

        res.json({
          status: 200,
          message: "File Uploaded Successfully",
          fileUrl: fileUrl,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
          message: error.message,
        });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

USER.updatePhotoSection = async (req, res) => {
  const body = req.body;
  const files = req.files;
  const commentId = body?.id;
  const userId = body?.user_id;

  if (!commentId || !userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required parameters" });
  }

  console.log(body, "body");

  // Prepare Firestore reference for the comment document
  const commentRef = admin.firestore().collection("comments").doc(commentId);

  try {
    // Fetch the comment document from Firestore
    const commentDoc = await commentRef.get();

    // Check if the comment exists
    if (!commentDoc.exists) {
      return res
        .status(404)
        .json({ status: 404, message: "Comment not found" });
    }

    // Extract existing data from the comment document
    const existingData = commentDoc.data() || {};
    let fileUrls = existingData.fileUrls || {};

    // Update comments in fileUrls based on received data
    Object.keys(body).forEach((key) => {
      if (key.startsWith("comment_")) {
        const commentKey = key.replace("comment_", "");
        const commentText = body[key];

        if (fileUrls[`comment_${commentKey}`]) {
          fileUrls[`comment_${commentKey}`].comment = commentText;
        } else {
          fileUrls[`comment_${commentKey}`] = {
            comment: commentText,
            images: [],
          };
        }
      }
    });

    // If no files or data provided, respond early
    if (!files || Object.keys(files).length === 0) {
      // Prepare update object for Firestore
      const updateObject = { fileUrls };

      // Update Firestore document
      await commentRef.update(updateObject);

      return res
        .status(200)
        .json({ status: 200, message: "Comments updated successfully" });
    }

    // Create a map to store files grouped by comments
    const filesByComment = {};

    // Separate files based on comment keys
    Object.keys(files).forEach((field) => {
      const [commentKey] = field.split("_file");

      if (!filesByComment[`comment_${commentKey}`]) {
        filesByComment[`comment_${commentKey}`] = [];
      }

      // Ensure files[field] is always an array
      if (Array.isArray(files[field])) {
        files[field].forEach((file) => {
          filesByComment[`comment_${commentKey}`].push(file);
        });
      } else {
        filesByComment[`comment_${commentKey}`].push(files[field]);
      }
    });

    // Upload files to Firebase Storage and store URLs
    const fileUploadPromises = [];

    for (const [commentKey, fileArray] of Object.entries(filesByComment)) {
      if (!fileUrls[commentKey]) {
        fileUrls[commentKey] = { comment: body[commentKey] || "", images: [] };
      }

      // Upload each file in fileArray
      fileArray.forEach((file) => {
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        const fileUpload = bucket.file(fileName);

        fileUploadPromises.push(
          new Promise((resolve, reject) => {
            const stream = fileUpload.createWriteStream({
              metadata: {
                contentType: file.mimetype,
              },
            });

            stream.on("error", (error) => {
              console.error(
                `Error uploading file ${file.originalname}:`,
                error
              );
              reject(error);
            });

            stream.on("finish", async () => {
              try {
                await fileUpload.makePublic();
                const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                fileUrls[commentKey].images.push(fileUrl);
                resolve();
              } catch (error) {
                console.error(`Error making file ${fileName} public:`, error);
                reject(error);
              }
            });

            stream.end(file.buffer);
          })
        );
      });
    }

    // Wait for all file uploads to complete
    await Promise.all(fileUploadPromises);

    // Prepare update object for Firestore
    const updateObject = { fileUrls };

    // Update Firestore document with updated fileUrls
    await commentRef.update(updateObject);

    await admin.firestore().collection("users").doc(userId).update({
      is_completed: true,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    // Optionally, fetch additional data after update
    const pdfReponseData = await USER.detailWithPhotoSectionById(userId);

    // Respond with success message and additional data
    return res.status(200).json({
      status: 200,
      message: "Files uploaded and data updated successfully",
      pdfReponseData,
    });
  } catch (error) {
    console.error("Error updating Firestore:", error);
    return res.status(500).json({ message: "Error updating Firestore", error });
  }
};

USER.invitationLink = async (email) => {
  await admin.auth().generateEmailVerificationLink(email);
};

USER.photoSection = async (req, res) => {
  try {
    const { user_id } = req.body;
    const photoSection = await admin
      .firestore()
      .collection("comments")
      .where("userId", "==", user_id)
      .get();

    let result = [];
    photoSection.forEach((doc) => {
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
  } catch (error) {}
};

USER.singleUserList = async (req, res) => {
  try {
    console.log(req.decodedToken, "decodedToken");

    const { uid } = req.decodedToken;

    if (uid) {
      const userRef = await admin.firestore().collection("users").doc(uid);

      const userDoc = await userRef.get();
      const userDetail = userDoc.data();

      if (!userDoc.exists) {
        res.status(500).json({
          status: 500,
          message: "No Record Exist",
        });
        return null;
      } else {
        userDetail.user_id = uid;
        userDetail.password = false;
        res.status(200).json({
          status: 200,
          data: userDetail,
        });
      }
    } else {
      res.status(403).json({
        status: 403,
        message: "Token has expired",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
    console.log(error.message);
  }
};

USER.userLists = async (req, res) => {
  try {
    const { data } = await helper.getPaginate("users");
    res.json({ data });
  } catch (error) {
    res.status(500).send(error.message);
  }
  // try {

  // const { pageSize, startAfter } = req.query;
  // const pageSizeInt = parseInt(pageSize, 10);
  // const field = "is_admin";
  // const value = false;
  // const wherekey = "is_archive";
  // const whereValue = false;
  // const { data, lastVisible } = await helper.getPaginate(
  //   "users",
  //   pageSizeInt,
  //   startAfter,
  //   field,
  //   value,
  //   wherekey,
  //   whereValue
  // );

  // console.log(data, "data");
  // console.log(lastVisible, "lastvisiblle");
  // res.json({
  //   data,
  //   length: data.length,
  //   lastVisible: lastVisible ? lastVisible.id : null,
  // });
  // } catch (error) {
  //   console.error("Error searching and paginating:", error.message);
  // }
};

USER.forgotPassword = async (req, res) => {
  try {
    req.body.template = "forgot_template.ejs";
    req.body.email_subject = "Forgot Password";
    req.body.attachmentObj = false;
    const sendEmail = await helper.sendEmail(req.body);
    console.log(sendEmail, "sendEmail");
    if (sendEmail) {
      res.json({
        status: 200,
        message: "Email Sent Successfully",
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

USER.updatePassword = async (req, res) => {
  const { password, email } = req.body;

  const recorduser = await helper.getUserByEmail(email);
  if (recorduser == false) {
    res.json({
      status: 500,
      message: "Something went wrong",
      userRecord,
    });
  }

  firebase_admin
    .auth()
    .updateUser(recorduser?.uid, {
      password: password,
    })
    .then((userRecord) => {
      res.json({
        status: 200,
        message: "Password Updated Successfully",
        userRecord,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

USER.singleUserDetail = async (req, res) => {
  try {
    const { user_id } = req.body;

    const userRef = admin.firestore().collection("users").doc(user_id);

    const userDoc = await userRef.get();
    const section = await USER.photoSectionById(user_id);

    let detail = userDoc.data();

    console.log(section, "section");
    detail.uid = user_id;
    detail.password = false;
    if (section != false) {
      detail.photo_section = section;
    }

    console.log(detail, "detail");
    if (!userDoc.exists) {
      res.json({
        status: 500,
        message: "No Record Exist",
      });
      return null;
    } else {
      res.json({
        status: 200,
        data: detail,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

USER.photoSectionById = async (userId) => {
  return new Promise(async function (resolve, reject) {
    const photoSection = await admin
      .firestore()
      .collection("comments")
      .where("userId", "==", userId)
      .get();

    let result = {};
    const fileUrls = [];
    let comment_id = {};

    photoSection.forEach((doc) => {
      const data = doc.data();

      comment_id = doc.id;

      if (data.fileUrls) {
        fileUrls.push(data.fileUrls);
      }
    });

    result.fileUrls = fileUrls;
    result.commentId = comment_id;

    if (Object.keys(result).length > 0) {
      resolve(result);
    } else {
      reject(false);
    }
  });
};

USER.activateDetactivateArchive = async (req, res) => {
  try {
    const { user_id } = req.body;

    let updateObj = {};

    if (req.body?.activatedeactivate != undefined) {
      updateObj = {
        is_activate: req.body?.activatedeactivate,
      };
    } else if (req.body?.archive == false || req.body?.archive == true) {
      updateObj = {
        is_archive: req.body?.archive,
      };
    }

    const data = await admin
      .firestore()
      .collection("users")
      .doc(user_id)
      .update(updateObj);

    if (data) {
      const detail = await helper.getUserById(user_id);
      const email = detail.email;

      if (updateObj.is_activate == true) {
        let activateObj = {
          template: "activate_template.ejs",
          email_subject: "Activate",
          to: email,
          attachmentObj: false,
        };
        const activateEmail = await helper.sendEmail(activateObj);
        console.log(activateEmail, "activateEmail");
      } else if (updateObj.is_activate == false) {
        let deactivateObj = {
          template: "deactivate.ejs",
          email_subject: "Deactivate",
          to: email,
          attachmentObj: false,
        };

        console.log(deactivateObj, "deactivateObj");
        const deactivateEmail = await helper.sendEmail(deactivateObj);
      }

      res.json({
        status: 200,
        message: "Action Updated",
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

USER.updateUser = async (req, res) => {
  try {
    console.log(req.body, "body ");
    const userTokenId = req.decodedToken.uid;

    if (req.body?.first_step) {
      admin
        .firestore()
        .collection("users")
        .doc(req.body?.first_step?.userId)
        .update({
          firstname: req?.body?.first_step?.firstname,
          lastname: req?.body?.first_step?.lastname,
          email: req?.body?.first_step?.email,
          password: req?.body?.first_step?.password,
          phone_number: req?.body?.first_step?.mobile,
          roles: req?.body?.first_step?.roles,
          company_name: req?.body?.first_step?.company_name,
          position: req?.body?.first_step?.position,
          home_city: req?.body?.first_step?.home_city,
          is_completed: false,
        });
      res.status(200).json({
        message: "User Profile Updated Successfully",
      });
    } else if (req?.body?.bussiness_update) {
      const businessUpdate = {
        financial_position: req?.body?.bussiness_update?.financial_position,
        sales_position: req?.body?.bussiness_update?.sales_position,
        accomplishments: req?.body?.bussiness_update?.accomplishments,
        hr_position: req?.body?.bussiness_update?.hr_position,
        current_challenges: req?.body?.bussiness_update?.current_challenges,
        craftsmen_support: req?.body?.bussiness_update?.craftsmen_support,
        is_completed: false,
      };

      console.log(businessUpdate, "business update");
      console.log(req?.body?.bussiness_update?.userId, "userId");
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.bussiness_update?.userId)
        .update(businessUpdate);

      res.status(200).json({
        message: "Business Updated",
      });
    } else if (req?.body?.goals) {
      const goals = {
        goal_last_meeting: req?.body?.goals?.goal_last_meeting,
        goal_next_meeting: req?.body?.goals?.goal_next_meeting,
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.goals?.userId)
        .update(goals);
      res.status(200).json({
        message: "Goals Updated",
      });
    } else if (req?.body?.craftsmen_toolbox) {
      const craftsmenToalBox = {
        technology: req?.body?.craftsmen_toolbox?.technology,
        products: req?.body?.craftsmen_toolbox?.products,
        project: req?.body?.craftsmen_toolbox?.project,
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.craftsmen_toolbox?.userId)
        .update(craftsmenToalBox);
      res.status(200).json({
        message: "Update Crafsmen",
      });
    } else if (req?.body?.craftsmen_checkup) {
      const crafstMenCheckup = {
        commitment: req?.body?.craftsmen_checkup?.commitment,
        contribute: req?.body?.craftsmen_checkup?.contribute,
        wellbeing: req?.body?.craftsmen_checkup?.wellbeing,
        contact_info: req?.body?.craftsmen_checkup?.contact_info,
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.craftsmen_checkup?.userId)
        .update(crafstMenCheckup);
      res.status(200).json({
        userId: req?.body?.craftsmen_checkup?.userId,
        message: "Update craftsmen checkup",
      });
    } else if (req?.body?.fall_meeting_review) {
      const metingReview = {
        fall_meeting: req?.body?.fall_meeting_review?.fall_meeting,
        personal_finances: req?.body?.fall_meeting_review?.personal_finances,
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.fall_meeting_review?.userId)
        .update(metingReview);
      res.status(200).json({
        message: "Update fall meeting review",
      });
    } else if (req?.body?.spring_meeting) {
      const springMeting = {
        estimating: req?.body?.spring_meeting?.estimating,
        accountability: req?.body?.spring_meeting?.accountability,
        productivity: req?.body?.spring_meeting?.productivity,
        is_completed: false,
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.spring_meeting.userId)
        .update(springMeting);
      res.status(200).json({
        message: "Update metingReview",
      });
    } else if (req?.body?.photo_section) {
      const photoSection = {
        photo_comment: req?.body?.photo_section?.photo_comment,
        is_completed: true,
        is_draft:
          req?.body?.photo_section.is_action == "completed"
            ? "completed"
            : "Draft",
      };
      admin
        .firestore()
        .collection("users")
        .doc(req?.body?.photo_section?.userId)
        .update(photoSection);
      res.status(200).json({
        message: "Update Photo Section",
      });
    }
  } catch (error) {
    console.log(error.message, "message is here");
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

USER.resetPassword = async (req, res) => {
  try {
    req.body.template = "resetpassword_template.ejs";
    req.body.email_subject = "Reset Password";
    req.body.attachmentObj = false;
    const sendEmail = await helper.sendEmail(req.body);
    console.log(sendEmail, "sendEmail");
    if (sendEmail) {
      res.json({
        status: 200,
        message: "Email Sent Successfully",
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

USER.archiveUserListing = async (req, res) => {
  try {
    const archivelist = await admin
      .firestore()
      .collection("users")
      .where("is_archive", "==", true)
      .get();

    archivelist.forEach((doc) => {
      res.json({
        status: 200,
        data: doc.data(),
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

USER.pdfEmail = async (req, res) => {
  try {
    const name = saltedMd5(req.file?.originalname, "SUPER-S@LT!");
    const fileName = name + path.extname(req.file?.originalname);
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file?.mimetype,
      },
    });

    stream.on("error", (error) => {
      console.error(error);
      res.status(400).json({
        status: 400,
        message: "Something went wrong",
      });
    });

    stream.on("finish", async () => {
      try {
        // Make the file public if needed
        await fileUpload.makePublic();
        const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        console.log(fileUrl, "fileUrl");

        res.json({
          status: 200,
          message: "File Uploaded Successfully",
          fileUrl: fileUrl,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 500,
          message: error.message,
        });
      }
    });

    stream.end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

USER.singleUserFormStatus = async (req, res) => {
  try {
    const { user_id } = req.decodedToken;
    const formaStatus = admin.firestore().collection("users").doc(user_id);

    const userFormStatus = await formaStatus.get();

    let detail = userFormStatus.data();

    detail.uid = user_id;
    detail.password = false;

    if (!userFormStatus.exists) {
      res.json({
        status: 500,
        message: "No Record Exist",
      });
      return null;
    } else {
      res.json({
        status: 200,
        data: [detail],
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

USER.totalMemberCount = async (req, res) => {
  try {
    const totalMemberCount = await admin
      .firestore()
      .collection("users")
      .where("is_admin", "==", false)
      .get();

    let result = [];
    totalMemberCount.forEach((doc) => {
      result.push(doc.data());
    });

    if (result != undefined) {
      res.status(200).json({
        status: 200,
        data: result.length,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "No Data is Avaiable",
      });
    }
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

USER.removeImge = async (req, res) => {
  try {
    const { imageUrl, commentId, comment } = req.body;

    const commentData = await admin
      .firestore()
      .collection("comments")
      .doc(commentId);

    const result = await commentData.get();

    const detailResult = result.data();

    const { fileUrls } = detailResult;

    if (!fileUrls || !fileUrls[comment]) {
      res.status(404).send("Comment key not found in fileUrls");
      return;
    }

    const commentKey = fileUrls[comment];

    const updatedImages = commentKey.images.filter((url) => url !== imageUrl);
    const updateInDb = await commentData.update({
      [`fileUrls.${comment}.images`]: updatedImages,
    });

    if (updateInDb) {
      await helper.deleteImages(imageUrl);

      res.json({
        status: 200,
        message: "Image removed successfully",
      });
    } else {
      res.json({
        status: 500,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

USER.completedFormDescending = async (req, res) => {
  const completedFormList = await admin
    .firestore()
    .collection("users")
    .orderBy("updatedAt");

  try {
    completedFormList.get().then((snapshot) => {
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
        let userList = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].is_archive == false && data[i].is_completed == true) {
            userList.push(data[i]);
          }
        }
        return res.status(201).json(userList);
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

module.exports = USER;
