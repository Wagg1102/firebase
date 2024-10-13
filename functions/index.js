const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { app } = require("./config/firebase");
const { getFirestore } = require("firebase-admin/firestore");
const cryptoJS = require("crypto-js"); // 引入MD5加密库
const sgMail = require('@sendgrid/mail')
const { createReadStream } = require('fs');
const fastCSV = require('fast-csv');

const firestore = getFirestore(app);
sgMail.setApiKey('SG.V9_y8yvBSaKOUEufQ5p_Bw.PtUuiVuGgC78YOURe3g4cHFp9BOZup5Trui9p7Ub2bA')

// 注册功能
exports.register = onRequest({ cors: true }, async (request, response) => {
  try {
    const { email, password, role } = request.body; // 假设前端发送POST请求包含email和password字段
    if (!email || !password) {
      return response.status(400).send("Email and password are required.");
    }

    // 检查邮箱是否已存在
    const existingUser = await firestore.collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return response.status(409).send("Email already exists.");
    }

    const encryptedPassword = cryptoJS.MD5(password).toString(); // MD5加密密码
    const mRes = await firestore.collection('users').add({
      email: email,
      password: encryptedPassword,
      role: role || 'user'
    });

    response.send(mRes);
  } catch (error) {
    logger.error(error);
    response.status(500).send("Failed to register user.");
  }
});

// 登录功能
exports.login = onRequest({ cors: true }, async (request, response) => {
  try {
    const { email, password, role } = request.body; // 假设前端发送POST请求包含email和password字段
    if (!email || !password || !role) {
      return response.status(400).send("Email and password are required.");
    }

    const encryptedPassword = cryptoJS.MD5(password).toString(); // MD5加密密码
    const querySnapshot = await firestore
      .collection('users')
      .where('email', '==', email)
      .where('role', '==', role)
      .get();

    if (querySnapshot.empty) {
      return response.status(404).send("User not found.");
    }

    const userDoc = querySnapshot.docs[0];
    const storedPassword = userDoc.data().password;

    if (storedPassword === encryptedPassword) {
      response.send({
        ...userDoc.data(),
        id: userDoc.id
      });
    } else {
      response.status(401).send("Incorrect password.");
    }
  } catch (error) {
    logger.error(error);
    response.status(500).send("Failed to login.");
  }
});
exports.users = onRequest({ cors: true }, async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          // 获取指定用户信息
          const userDoc = await firestore.collection('users').doc(req.query.id).get();
          if (!userDoc.exists) {
            return res.status(404).send("User not found.");
          }
          res.send(userDoc.data());
        } else {
          // 获取所有用户列表，并支持搜索、排序与分页
          let query = firestore.collection('users');

          // 搜索功能
          if (req.query.search) {
            const searchField = req.query.search_field || 'email';
            query = query.where(searchField, '==', req.query.search);
          }

          // 排序功能
          if (req.query.sortBy) {
            const direction = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            query = query.orderBy(req.query.sortBy, direction);
          }

          // 分页功能
          const pageSize = parseInt(req.query.pageSize) || 10;
          const page = parseInt(req.query.page) || 1;
          const startAfter = (page - 1) * pageSize;
          query = query.limit(pageSize).offset(startAfter);

          const usersSnapshot = await query.get();
          const users = usersSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          res.send({
            data: users,
            total: (await firestore.collection('users').get()).size,
            pageSize,
            page
          });
        }
        break;
      case "POST":
        const newUser = req.body;
        if (!newUser.email || !newUser.password || !newUser.role) {
          return res.status(400).send("Params is required.");
        }
        const newUserRef = await firestore.collection('users').add(newUser);
        res.send({ id: newUserRef.id });
        break;
      case "PUT":
        const { id, ...updateUserData } = req.body;
        if (!id) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('users').doc(id).update(updateUserData);
        res.send("User updated successfully.");
        break;
      case "DELETE":
        const userId = req.query.id;
        if (!userId) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('users').doc(userId).delete();
        res.send("User deleted successfully.");
        break;
      default:
        res.status(405).send("Method not allowed.");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("An error occurred.");
  }
});

exports.activities = onRequest({ cors: true }, async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          // 获取指定活动信息
          const activityDoc = await firestore.collection('activities').doc(req.query.id).get();
          if (!activityDoc.exists) {
            return res.status(404).send("Activity not found.");
          }
          res.send(activityDoc.data());
        } else {
          // 获取所有活动列表，并支持搜索、排序与分页
          let query = firestore.collection('activities');

          // 搜索功能
          if (req.query.search) {
            const searchField = req.query.search_field || 'title';
            query = query.where(searchField, '==', req.query.search);
          }

          // 排序功能
          if (req.query.sortBy) {
            const direction = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            query = query.orderBy(req.query.sortBy, direction);
          }

          // 分页功能
          const pageSize = parseInt(req.query.pageSize) || 10;
          const page = parseInt(req.query.page) || 1;
          const startAfter = (page - 1) * pageSize;
          query = query.limit(pageSize).offset(startAfter);

          const activitiesSnapshot = await query.get();
          const activities = activitiesSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          res.send({
            data: activities,
            total: (await firestore.collection('activities').get()).size,
            pageSize,
            page
          });
        }
        break;
      case "POST":
        const newActivity = req.body;
        if (!newActivity.title) {
          return res.status(400).send("Title is required.");
        }
        const newActivityRef = await firestore.collection('activities').add(newActivity);
        res.send({ id: newActivityRef.id });
        break;
      case "PUT":
        const { id, ...updateActivityData } = req.body;
        if (!id) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('activities').doc(id).update(updateActivityData);
        res.send("Activity updated successfully.");
        break;
      case "DELETE":
        const activityId = req.query.id;
        if (!activityId) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('activities').doc(activityId).delete();
        res.send("Activity deleted successfully.");
        break;
      default:
        res.status(405).send("Method not allowed.");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("An error occurred.");
  }
});

exports.getAllActivities = onRequest({ cors: true }, async (req, res) => {
  const mRow = (await firestore.collection('activities').get()).docs.map(doc => {
    return {
      ...doc.data(),
      id: doc.id
    }
  })
  res.send(mRow)
})

// 定义处理申请的路由
exports.applies = onRequest({ cors: true }, async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id) {
          // 获取指定申请信息
          const applyDoc = await firestore.collection('applies').doc(req.query.id).get();
          if (!applyDoc.exists) {
            return res.status(404).send("Apply not found.");
          }
          res.send(applyDoc.data());
        } else {
          // 获取所有申请列表，并支持搜索、排序与分页
          let query = firestore.collection('applies');

          // 搜索功能
          if (req.query.search) {
            const searchField = req.query.search_field || 'title';
            query = query.where(searchField, '==', req.query.search);
          }

          // 排序功能
          if (req.query.sortBy) {
            const direction = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
            query = query.orderBy(req.query.sortBy, direction);
          }

          // 分页功能
          const pageSize = parseInt(req.query.pageSize) || 10;
          const page = parseInt(req.query.page) || 1;
          const startAfter = (page - 1) * pageSize;
          query = query.limit(pageSize).offset(startAfter);

          const appliesSnapshot = await query.get();
          const applies = appliesSnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          res.send({
            data: applies,
            total: (await firestore.collection('applies').get()).size,
            pageSize,
            page
          });
        }
        break;
      case "POST":
        const newApply = req.body;
        // 验证必填字段
        if (!newApply.userId || !newApply.title || !newApply.startTime || !newApply.endTime || !newApply.detail) {
          return res.status(400).send("All fields are required.");
        }
        const mUser = (await firestore.collection('users').doc(newApply.userId).get()).data()
        await sgMail.send({
          from: 'hhwagg0211@gmail.com',
          to: mUser.email,
          subject: 'Activity application successful',
          html: `
            <div>
              <p>title: ${newApply.title}</p>
              <p>startTime: ${newApply.startTime}</p>
              <p>endTime: ${newApply.endTime}</p>
              <p>detail: ${newApply.detail}</p>
            </div>
          `
        })

        const newApplyRef = await firestore.collection('applies').add(newApply);
        res.send({ id: newApplyRef.id });
        break;
      case "PUT":
        const { id, ...updateApplyData } = req.body;
        if (!id) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('applies').doc(id).update(updateApplyData);
        res.send("Apply updated successfully.");
        break;
      case "DELETE":
        const applyId = req.query.id;
        if (!applyId) {
          return res.status(400).send("ID is required.");
        }
        await firestore.collection('applies').doc(applyId).delete();
        res.send("Apply deleted successfully.");
        break;
      default:
        res.status(405).send("Method not allowed.");
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send("An error occurred.");
  }
});

exports.getAllApplys = onRequest({ cors: true }, async (req, res) => {
  const query = firestore.collection('applies')
  if (req.query.userId) {
    query.where('userId', '==', req.query.userId)
  }
  const mRow = (await query.get()).docs.map(doc => {
    return {
      ...doc.data(),
      id: doc.id
    }
  })
  res.send(mRow)
})

exports.exportUsers = onRequest({ cors: true }, async (req, res) => {
  // 设置响应头为 CSV 类型，并提示浏览器下载文件
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users.csv');

  try {
    const users = (await firestore.collection('users').get()).docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    fastCSV
      .write(users, { headers: true })
      .pipe(res);

  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).send("An error occurred while exporting the users.");
  }
});

exports.exportActivities = onRequest({ cors: true }, async (req, res) => {
  // 设置响应头为 CSV 类型，并提示浏览器下载文件
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=activities.csv');

  try {
    const activities = (await firestore.collection('activities').get()).docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    fastCSV
      .write(activities, { headers: true })
      .pipe(res);

  } catch (error) {
    console.error("Error exporting activities:", error);
    res.status(500).send("An error occurred while exporting the activities.");
  }
});
