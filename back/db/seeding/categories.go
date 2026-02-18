package seeding

import (
	"fmt"
	"quickstart/models"

	"gorm.io/gorm"
)

func CategoriesSeeding(db *gorm.DB) error {
	var count int64
	db.Model(&models.Category{}).Count(&count)

	if count > 0 {
		return nil
	}

	categories := []models.Category{
		{ID: "tieu_thuyet", Name: "Tiểu thuyết"},
		{ID: "phi_hu_cau", Name: "Phi hư cấu"},
		{ID: "khoa_hoc", Name: "Khoa học"},
		{ID: "cong_nghe", Name: "Công nghệ"},
		{ID: "lich_su", Name: "Lịch sử"},
		{ID: "tieu_su", Name: "Tiểu sử"},
		{ID: "phat_trien_ban_than", Name: "Phát triển bản thân"},
		{ID: "kinh_doanh", Name: "Kinh doanh"},
		{ID: "tam_ly_hoc", Name: "Tâm lý học"},
		{ID: "triet_hoc", Name: "Triết học"},
		{ID: "suc_khoe_the_chat", Name: "Sức khỏe & Thể chất"},
		{ID: "gia_tuong", Name: "Giả tưởng"},
		{ID: "khoa_hoc_vien_tuong", Name: "Khoa học viễn tưởng"},
		{ID: "trinh_tham_kinh_di", Name: "Trinh thám & Kinh dị"},
		{ID: "lang_man", Name: "Lãng mạn"},
		{ID: "kinh_di", Name: "Kinh dị"},
		{ID: "phieu_luu", Name: "Phiêu lưu"},
		{ID: "thieu_nhi", Name: "Thiếu nhi"},
		{ID: "tuoi_teen", Name: "Tuổi teen"},
		{ID: "giao_duc", Name: "Giáo dục"},
	}

	db.Create(&categories)

	fmt.Printf("%d categories seeding...\n", count)

	return nil
}
