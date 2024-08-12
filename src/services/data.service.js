import throwError from "../helpers/throw-error.js";
import { errors } from "../lang.js";

class DataService {
  model;
  include;
  constructor(model, include = []) {
    this.model = model;
    this.include = include;
  }
  async list(where = {}, page = 1, limit = 10, order = [["id", "desc"]]) {
    try {
      const { rows, count } = await this.model.findAndCountAll({
        where,
        include: this.include,
        limit: limit !== "inf" ? limit : null,
        offset: limit !== "inf" ? (page - 1) * limit : null,
        order: order,
      });
      return { rows, count };
    } catch (error) {
      throwError(error);
    }
  }
  async get(where = {}) {
    try {
      const result = await this.model.findOne({
        where,
        include: this.include,
      });
      return result;
    } catch (error) {
      throwError(error);
    }
  }
  async create(body) {
    try {
      return await this.model.create(body);
    } catch (error) {
      throwError(error);
    }
  }
  async bulkCreate(body) {
    try {
      return await this.model.bulkCreate(body);
    } catch (error) {
      throwError(error);
    }
  }
  async update(where, body) {
    try {
      const result = await this.model.findOne({ where });
      if (result) {
        Object.assign(result, body);
        const res = await result.save(body);
        return res;
      } else {
        throwError(errors.ID_NOT_FOUND, 404);
      }
    } catch (error) {
      throwError(error);
    }
  }
  async delete(where) {
    try {
      const result = await this.model.findOne({ where });
      if (result) {
        return await this.model.destroy({ where });
      } else {
        throwError(errors.ID_NOT_FOUND, 404);
      }
    } catch (error) {
      throwError(error);
    }
  }
}

export default DataService;
