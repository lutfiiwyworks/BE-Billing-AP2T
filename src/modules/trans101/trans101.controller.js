import service from "./trans101.service.js";

const getAll = async (req, res) => {
  try {
    const data = await service.getAllTrans101();

    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export default { getAll };