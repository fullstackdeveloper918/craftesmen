const ADMIN = {};
const { admin } = require("../firebase/firebase_auth");
ADMIN.add = async (req, res) => {
  try {
    admin
      .auth()
      .createUser({
        displayName: req?.body?.firstname + req?.body?.lastname,
        email: req?.body?.email,
        password: req?.body?.password,
      })
      .then(async (userRecord) => {
        const added = await admin
          .firestore()
          .collection("users")
          .doc(userRecord.uid)
          .set({
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            password: req?.body?.password,
            permission: req?.body?.permission,
            phone_number: req?.body?.phone_number,
            is_admin: true,
            is_archive: false,
            created: admin.firestore.Timestamp.now(),
          });

        console.log(added, "addmed");
        if (added) {
          res.status(200).json({
            status: 200,
            message: "Admin is created",
          });
        } else {
          res.status(500).json({
            status: 400,
            message: "Something went wrong",
          });
        }
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

ADMIN.update = async (req, res) => {
  try {
    const { admin_uuid } = req.body;
    console.log(req.body, "body");
    const update = await admin
      .firestore()
      .collection("users")
      .doc(admin_uuid)
      .update({
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        password: req?.body?.password,
        permission: req?.body?.permission,
        phone_number: req?.body?.phone_number,
      });
    if (update) {
      res.status(200).json({
        status: 200,
        message: "Admin is updated",
      });
    } else {
      res.status(400).json({
        status: 400,
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

ADMIN.detail = async (req, res) => {
  try {
    const { admin_uuid } = req.body;
    const detail = await admin
      .firestore()
      .collection("users")
      .doc(admin_uuid)
      .get();

    if (!detail.exists) {
      res.status(404).json({
        status: 404,
        message: "No record found",
      });
    } else {
      res.status(200).json({
        status: 200,
        data: detail.data(),
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "No record found",
    });
  }
};
ADMIN.list = async (req, res) => {
  const listingAdmin = await admin
    .firestore()
    .collection("users")
    .where("is_admin", "==", true)
    .where("is_archive", "==", false);
  try {
    listingAdmin.get().then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (data.length < 1) {
        res.status(500).json({
          status: 500,
          message: "No Record Exist",
        });
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

ADMIN.delete = async (req, res) => {
  try {
    const { admin_uuid } = req.body;
    const isDeleted = await admin
      .firestore()
      .collection("users")
      .doc(admin_uuid)
      .update({
        is_archive: true,
      });

    if (isDeleted) {
      res.status(200).json({
        status: 200,
        message: "Meeting Deleted",
      });
    } else {
      res.status(500).json({
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

module.exports = ADMIN;
