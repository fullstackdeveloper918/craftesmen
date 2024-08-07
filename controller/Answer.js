const ANSWER = {};
const { admin } = require("../firebase/firebase_auth");
const quesiton = require("../controller/Question");
ANSWER.add = async (req, res) => {
  try {
    const { user_id } = req.decodedToken;
    const { question_id, answer } = req.body;
    const answerObj = {
      user_id: user_id,
      question_id: question_id,
      answer: answer,
      created: admin.firestore.Timestamp.now(),
    };
    const isAnswerAdded = await admin
      .firestore()
      .collection("answer")
      .doc()
      .set(answerObj);

    if (isAnswerAdded) {
      res.status(200).json({
        status: 200,
        message: "Answer added successfully",
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "Something went wrong while adding quesiton",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

ANSWER.list = async (req, res) => {
  try {
    const { user_id } = req.decodedToken;
    const answerList = await admin
      .firestore()
      .collection("answer")
      .where("user_id", "==", user_id)
      .get();

    let result = [];
    answerList.forEach((doc) => {
      result.push(doc.data());
    });

    for (let i = 0; i < result.length; i++) {
      const question = await quesiton.questionById(result[i].question_id);
      result[i].question = question.question;
    }

    if (result.length > 0) {
      res.status(200).json({
        status: 200,
        message: result,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "No data avialable",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

ANSWER.detail = async (req, res) => {
  try {
    const { question_id } = req.body;
    const questions = await quesiton.questionById(question_id);
    const quesitonName = questions?.question;
    const answerDetail = await admin
      .firestore()
      .collection("answer")
      .where("question_id", "==", question_id)
      .get();

    let result = [];
    answerDetail.forEach((doc) => {
      result.push(doc.data());
    });

    if (result != undefined) {
      result[0].question = quesitonName;
      res.status(200).json({
        status: 200,
        data: result,
      });
    } else {
      res.status(500).json({
        status: 500,
        message: "No Data is Avaiable",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = ANSWER;
