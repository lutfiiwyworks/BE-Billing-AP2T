import detilAnomaliHaribacaAp2tService from "./detil_anomali_haribaca_ap2t.service.js";

const getDetilAnomaliHaribacaAp2t = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, page, limit, sortField, sortOrder, search } =
      req.query;

    const result =
      await detilAnomaliHaribacaAp2tService.getDetilAnomaliHaribacaAp2t({
        thblrek,
        unitupi,
        idpel,
        page,
        limit,
        sortField,
        sortOrder,
        search,
      });

    return res.status(200).json({
      success: true,
      page: result.page,
      limit: result.limit,
      total: result.total,
      data: result.data,
    });
  } catch (error) {
    console.error("Controller Error getDetilAnomaliHaribacaAp2t:", error);

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const exportDetilAnomaliHaribacaAp2t = async (req, res) => {
  try {
    const { thblrek, unitupi, idpel, sortField, sortOrder, search } = req.query;
    const filename = `detil-anomali-haribaca-ap2t-${thblrek || "export"}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    await detilAnomaliHaribacaAp2tService.exportDetilAnomaliHaribacaAp2t({
      thblrek,
      unitupi,
      idpel,
      sortField,
      sortOrder,
      search,
      stream: res,
    });
  } catch (error) {
    console.error("Controller Error exportDetilAnomaliHaribacaAp2t:", error);

    if (res.headersSent) {
      res.destroy(error);
      return;
    }

    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getDetilAnomaliHaribacaAp2t,
  exportDetilAnomaliHaribacaAp2t,
};
