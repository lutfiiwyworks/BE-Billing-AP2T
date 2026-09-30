import model from "./trans101.model.js";

const getAllTrans101 = async () => {
  return await model.getAllTrans101();
};

export default { getAllTrans101 };