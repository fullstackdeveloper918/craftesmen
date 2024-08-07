const express = require("express");
const Router = express.Router();
const User = require("../controller/User");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 },
});
const Meeting = require("../controller/Meeting");
const Question = require("../controller/Question");
const Admin = require("../controller/Admin");
const Answer = require("../controller/Answer");
const { verifyToken } = require("../middleware/verifytoken");

Router.get("/testing", (req, res) => {
  res.send("Testing is here");
});
Router.post("/register", User.register);

// Router.post("/uploadFile", upload.array("files"), User.uploadFile);

Router.use(verifyToken);
Router.get("/list", User.userLists);
Router.get("/single-user", User.singleUserList);
Router.get("/single-user-form-status", User.singleUserFormStatus);
Router.post("/single-user-detail", User.singleUserDetail);
Router.post("/activte-deactivate-archive", User.activateDetactivateArchive);
Router.get("/archive-user-listing", User.archiveUserListing);
Router.post("/update-user", User.updateUser);
Router.get("/total-member-count", User.totalMemberCount);

Router.post("/uploadFile", upload.any(), User.uploadFile);
Router.post("/update-photo-section", upload.any(), User.updatePhotoSection);
Router.post("/photo-section", User.photoSection);
Router.post("/remove-photo-section", User.removeImge);
Router.get("/descending-completed-form", User.completedFormDescending);

Router.post(
  "/send-completeform-mail-to-superadmin",
  upload.single("file"),
  User.sendCompleteFormEmailMailtoSuperAdmin
);

// Pdf
// Router.post("/send-pdf", User.pdfEmail);
Router.post("/save-pdf", upload.single("file"), User.pdfEmail);

// Forgot password and Reset password

Router.post("/forgot-password", User.forgotPassword);
Router.post("/reset-password", User.resetPassword);
Router.put("/update-password", User.updatePassword);

// Meeting Api

Router.post("/add-meeting", Meeting.add);
Router.post("/meeting-detail", Meeting.detail);
Router.get("/meeting-list", Meeting.list);
Router.put("/meeting-update", Meeting.update);
Router.post("/delete-meeting", Meeting.delete);
Router.get("/meeting-archive", Meeting.archive);
Router.get("/upcoming-meeting", Meeting.userUpcomingMeeting);
Router.get("/complete-uncomplete-form", Meeting.completeUncompleteForm);
Router.get("/spring-fall-meeting-count", Meeting.springFallMeetingCount);
Router.get("/past-meetings", Meeting.pastMeetings);
Router.post("/past-meetings-user", Meeting.pastMeetingsUsers);
Router.get(
  "/five-day-beforemeeting-countdown",
  Meeting.fiveDayMeetingCountDown
);
// Router.get(
//   "/remains-userfor-fill-meeting",
//   Meeting.remainsUserForComingMeeting
// );
// Router.get("/next-meetings", Meeting.nextTwoMeeting);

// Questions Api

Router.post("/question-add", Question.add);
Router.get("/question-list", Question.list);
Router.get("/question-answer-pdf", Question.quesitonAnswerPdf);
Router.post("/question-delete", Question.delete);
Router.put("/question-update", Question.update);
Router.post("/single-question", Question.detail);

// Answer Api
Router.post("/add-answer", Answer.add);
Router.get("/answer-list", Answer.list);
Router.post("/answer-detail", Answer.detail);
// Admin Api
Router.post("/admin/add", Admin.add);
Router.post("/admin/detail", Admin.detail);
Router.put("/admin/update", Admin.update);
Router.get("/admin/list", Admin.list);
Router.post("/admin/delete", Admin.delete);

module.exports = Router;
