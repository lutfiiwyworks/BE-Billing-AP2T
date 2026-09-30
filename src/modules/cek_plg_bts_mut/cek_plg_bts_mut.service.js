import getPlgBtsMutModel from "./cek_plg_bts_mut.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getPlgBtsMut = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getPlgBtsMutModel.getPlgBtsMut({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getPlgBtsMut };
