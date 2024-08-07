const Question = {};
const { admin } = require("../firebase/firebase_auth");

Question.add = async (req, res) => {
  try {
    const { question, question_type } = req.body;

    const questionObj = {
      question: question,
      question_type: question_type,
      is_archive: false,
      created: admin.firestore.Timestamp.now(),
    };
    const addQuesiton = await admin
      .firestore()
      .collection("question")
      .doc()
      .set(questionObj);

    if (addQuesiton) {
      res.status(200).json({
        status: 200,
        message: "Question Created",
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

Question.quesitonAnswerPdf = async (req, res) => {
  try {
    const db = admin.firestore();

    // Fetch all users
    const questionData = await db.collection("question").get();
    const questionDetail = questionData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const answerData = await db.collection("answer").get();
    const answerDetail = answerData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const qusMap = new Map(questionDetail.map((qus) => [qus.id, qus]));

    questionDetail.forEach((question) => {
      question.answerDetail = answerDetail.filter(
        (answ) => answ.question_id === question.id
      );
    });

    res.status(200).json({
      status: 200,
      data: questionDetail,
    });
  } catch (error) {
    console.log(error.message);
  }
};
Question.list = async (req, res) => {
  try {
    const { searchFilter } = req.query;
    // let questionList;
    // if (searchFilter) {
    let questionList = await admin
      .firestore()
      .collection("question")
      .orderBy("created");
    // .where("question_type", "==", searchFilter);
    // } else {
    //   questionList = await admin.firestore().collection("question");
    // }
    questionList.get().then((snapshot) => {
      let data = [];
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (data != undefined) {
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
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

Question.delete = async (req, res) => {
  try {
    const { question_id } = req.body;
    const isQuestionDeleted = await admin
      .firestore()
      .collection("question")
      .doc(question_id)
      .update({
        is_archive: true,
      });

    if (isQuestionDeleted) {
      res.json({
        status: 200,
        message: "Question Deleted",
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

Question.update = async (req, res) => {
  try {
    const { question, question_type, question_id } = req.body;

    const quesitonUptObj = {
      question: question,
      question_type: question_type,
      is_archive: false,
      created: admin.firestore.Timestamp.now(),
    };

    const isQuesitonDeleted = await admin
      .firestore()
      .collection("question")
      .doc(question_id)
      .update(quesitonUptObj);

    if (isQuesitonDeleted) {
      res.json({
        status: 200,
        message: "Question Updated",
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

Question.detail = async (req, res) => {
  try {
    const { question_id } = req.body;

    const detail = await admin
      .firestore()
      .collection("question")
      .doc(question_id)
      .get();

    if (!detail.exists) {
      console.log("No document");
    } else {
      res.json({
        status: 200,
        data: detail.data(),
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

Question.questionById = async (quesitonId) => {
  return new Promise(async function (resolve, reject) {
    const questionRef = await admin
      .firestore()
      .collection("question")
      .doc(quesitonId);

    const quesitondata = await questionRef.get();

    if (!quesitondata.exists) {
      reject(false);
    } else {
      resolve(quesitondata.data());
    }
  });
};
module.exports = Question;
