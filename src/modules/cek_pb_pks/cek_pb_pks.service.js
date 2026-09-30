import getCekPbPksModel from "./cek_pb_pks.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekPbPks = async ({ thblrek, idpel, unitupi, limit }) => {
  if (!thblrek && !idpel && !unitupi) {
    throw createBadRequest(
      "Minimal isi salah satu parameter: thblrek / idpel / unitupi"
    );
  }

  const rows = await getCekPbPksModel.getCekPbPks({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekPbPks };
