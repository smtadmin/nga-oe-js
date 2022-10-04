/**
 * File is responsible for managing the apect like interactions around logging.
 */
 const Producer = require("@siliconmtn/spacelibs-js/core/io/Messaging/Producer");
 const schema = require("./vo/machine_feedback_schema.json");
 require("dotenv").config();
 const MachineLog = require("./vo/MachineLog");
 const { parseRequest } = require("./reqParser");
 const { v4: uuidv4 } = require("uuid");
 const { validate: uuidValidate } = require("uuid");
 
 /**
  * Wraps the given callback with the before and after middleware
  * methods.
  */
 const wrapCall = function (callback) {
   return [beforeMiddleware, callback, afterMiddleware];
 };
 
 const beforeMiddleware = async function (_req, _res, next) {
   await sendLog("EVENT_START", "Request Start Processing", parseRequest(_req));
   next();
 };
 
 const afterMiddleware = async function (_req, _res, next) {
   await sendLog("EVENT_END", "Request Finished Processing", parseRequest(_req));
   next();
 };
 
 const sendLog = async function (eventTypeCd, log, data) {
   try {
     let config = {};
     config.path = process.env.PULSAR_CLIENT_URL;
     config.jwtToken = process.env.PULSAR_ADMIN_JWT_TOKEN;
     config.tlsAllowsInsecureConnection = process.env.PULSAR_TLS_ALLOW_INSECURE_CONNECTIONS;
     let p = new Producer(config);
     let ml = buildMachineLogMessage(eventTypeCd, log, data);
     let props = {
       "uiTransactionId": data.transactionId,
       "userId": data.userId,
       "sessionId": data.sessionId
     }
     console.log(props);
     await p.sendMessage(
       process.env.NODE_SERVER_MFDB_TOPIC,
       ml,
       props
     );
   } catch (e) {}
 };
 
 const buildMachineLogMessage = function (eventTypeCd, log, data) {
   let ml = new MachineLog();
   ml.populate({
     eventTypeCd: eventTypeCd,
     logLevel: "SYSTEM",
     serviceId: process.env.NODE_SERVER_SERVICE_ID,
     classificationLevel: process.env.NODE_SERVER_CLASSIFICATION_LEVEL,
     environment: process.env.NODE_SERVER_ENVIRONMENT_CD,
     eventName: "Human Feedback UI Log",
     sessionId: uuidv4(),
     microServiceId: process.env.NODE_SERVER_MICRO_SERVICE_ID,
     payload: data,
     eventSummary: log,
   });
 
   if (data && data.userId && uuidValidate(data.userId)) {
     ml.context.userId = data.userId;
   }
 
   if (data && data.sessionId && uuidValidate(data.sessionId)) {
     ml.context.sessionId = data.sessionId;
   }
 
   if (data && data.transactionId && uuidValidate(data.transactionId)) {
     ml.context.uiTransactionId = data.transactionId;
   }
 
   return {
     data: ml.toJSON(),
     schema: schema,
   };
 };
 
 module.exports = {
   wrapCall,
   beforeMiddleware,
   afterMiddleware,
   sendLog,
   buildMachineLogMessage,
 };
 