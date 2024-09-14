const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Model cho xã/phường
const CommuneSchema = new Schema({
  name: { type: String, required: true },
});

// Model cho quận/huyện
const DistrictSchema = new Schema({
  name: { type: String, required: true },
  communes: [CommuneSchema], // Danh sách các xã/phường thuộc quận/huyện
});

// Model cho tỉnh/thành
const ProvinceSchema = new Schema({
  name: { type: String, required: true },
  districts: [DistrictSchema], // Danh sách các quận/huyện thuộc tỉnh/thành
});

// Tạo models
const Province = mongoose.model("Province", ProvinceSchema);

export default Province;
