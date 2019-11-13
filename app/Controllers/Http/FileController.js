"use strict";

const File = use("App/Models/File");
const Entity = use("App/Models/Entity");
const Organization = use("App/Models/Organization");

const Helpers = use("Helpers");

class FileController {
  async show({ params }) {
    const file = await File.findOrFail(params.id);

    return file;
  }

  async showImage({ params, response }) {
    const file = await File.findOrFail(params.id);

    return response.download(Helpers.tmpPath(`uploads/${file.file}`));
  }

  async store({ request, response, params }) {
    try {
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });

      const fileName = `${Date.now()}_${upload.clientName}`;

      await upload.move(Helpers.tmpPath("uploads"), {
        name: fileName
      });

      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      });

      if (params.type === "entity") {
        const entity = await Entity.findOrFail(params.user_id);

        entity.file_id = file.id || entity.file_id;

        await entity.save();
      } else {
        const organization = await Organization.findOrFail(params.user_id);

        organization.file_id = file.id || organization.file_id;

        await organization.save();
      }

      return file;
    } catch (err) {
      return response.status(err.status).send({
        error: { title: "Falha!", message: "Erro no upload do arquivo!" }
      });
    }
  }

  async destroy({ params }) {
    const file = await File.findOrFail(params.id);

    const fs = Helpers.promisify(require("fs"));
    fs.unlink(Helpers.tmpPath(`uploads/${file.file}`));

    await file.delete();
  }
}

module.exports = FileController;
