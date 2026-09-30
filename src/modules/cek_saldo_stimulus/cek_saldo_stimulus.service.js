import cekSaldoStimulusModel from "./cek_saldo_stimulus.model.js";

const createBadRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getCekSaldoStimulus = async ({ thblrek, idpel }) => {
  if (!thblrek) {
    throw createBadRequest("Parameter thblrek wajib diisi");
  }

  const rows = await cekSaldoStimulusModel.getCekSaldoStimulus({
    thblrek,
    idpel,
  });

  return rows;
};

export default { getCekSaldoStimulus };
