import getCekPecahTdlModel from "./cek_pecah_tdl.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekPecahTdl = async ({ thblrek, idpel, unitupi }) => {
  if (!thblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  const rows = await getCekPecahTdlModel.getCekPecahTdl({
    thblrek,
    idpel,
    unitupi,
  });

  return rows;
};

export default { getCekPecahTdl };
