const provincesData = [
  {
    name: "Hà Nội",
    districts: [
      {
        name: "Quận Ba Đình",
        communes: ["Phường Phúc Xá", "Phường Trúc Bạch", "Phường Vĩnh Phúc"],
      },
      {
        name: "Quận Hoàn Kiếm",
        communes: ["Phường Chương Dương", "Phường Hàng Bài"],
      },
    ],
  },
  {
    name: "Hồ Chí Minh",
    districts: [
      {
        name: "Quận 1",
        communes: ["Phường Bến Nghé", "Phường Bến Thành"],
      },
      {
        name: "Quận 3",
        communes: ["Phường Võ Thị Sáu", "Phường Phạm Ngũ Lão"],
      },
    ],
  },
  {
    name: "Đà Nẵng",
    districts: [
      {
        name: "Quận Hải Châu",
        communes: ["Phường Bình Thuận", "Phường Hòa Thuận Đông"],
      },
      {
        name: "Quận Thanh Khê",
        communes: ["Phường Thạc Gián", "Phường Tân Chính"],
      },
    ],
  },
  // Thêm các tỉnh/thành khác theo cấu trúc tương tự
];

export default provincesData;
