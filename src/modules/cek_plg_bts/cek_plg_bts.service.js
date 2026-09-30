import getPlgBtsModel from "./cek_plg_bts.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getPlgBts = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getPlgBtsModel.getPlgBts({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getPlgBts };
