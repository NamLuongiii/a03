export const BOOK_CATEGORIES = {
    TON_GIAO: {id: 'ton-giao', label: 'Tôn giáo'},
    TRIET_HOC: {id: 'triet-hoc', label: 'Triết học'},
    VAN_HOC: {id: 'van-hoc', label: 'Văn học'},
    TIEU_THUYET: {id: 'tieu-thuyet', label: 'Tiểu thuyết'},
    TRINH_THAM: {id: 'trinh-tham-hinh-su', label: 'Trinh thám - Hình sự'},
    KINH_DI: {id: 'kinh-di-giat-gan', label: 'Kinh dị - Giật gân'},
    THO_CA: {id: 'tho-ca', label: 'Thơ ca'},
    TRUYEN_CUOI: {id: 'truyen-cuoi', label: 'Truyện cười'},
    CO_TICH: {id: 'co-tich-thieu-nhi', label: 'Cổ tích - Thiếu nhi'},
    KIEM_HIEP: {id: 'kiem-hiep', label: 'Kiếm hiệp'},
    TRUYEN_NGAN: {id: 'truyen-ngan-tan-van', label: 'Truyện ngắn - Tản văn'},
    LICH_SU: {id: 'lich-su-dia-ly-chinh-tri', label: 'Lịch sử - Địa lý - Chính trị'},
    KH_XA_HOI: {id: 'khoa-hoc-xa-hoi', label: 'Khoa học xã hội'},
    KH_CONG_NGHE: {id: 'khoa-hoc-cong-nghe', label: 'Khoa học - Công nghệ'},
    PHAP_LUAT: {id: 'phap-luat', label: 'Pháp luật'},
    PHAT_TRIEN_BT: {id: 'phat-trien-ban-than', label: 'Phát triển bản thân'},
    GIAO_DUC: {id: 'giao-duc-hoc-tap', label: 'Giáo dục - Học tập'},
    MARKETING: {id: 'ban-hang-marketing', label: 'Bán hàng - Marketing'},
    KINH_DOANH: {id: 'kinh-doanh-quan-tri', label: 'Kinh doanh - Quản trị'},
    KHOI_NGHIEP: {id: 'khoi-nghiep', label: 'Khởi nghiệp'},
    HOI_KI: {id: 'tu-truyen-hoi-ki', label: 'Tự truyện - Hồi kí'},
    TIEU_SU: {id: 'tieu-su', label: 'Tiểu sử'},
    KHAC: {id: 'khac', label: 'Khác'},
} as const;

// Tạo Type từ Object để dùng trong Props
export type CategoryKey = keyof typeof BOOK_CATEGORIES;

export const FileTypes = {
    'application/epub+zip': 'epub',
    'application/pdf': 'pdf',
    'application/x-mobipocket-ebook': 'mobi',
    'application/x-rar-compressed': 'rar',
    'application/x-zip-compressed': 'zip',
    'application/vnd.amazon.ebook': 'azw3',
    'application/vnd.apple.installer+xml': 'mpkg',
    'application/vnd.oasis.opendocument.text': 'odt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/x-7z-compressed': '7z',
    'application/x-gtar': 'gtar',
    'application/x-gzip': 'gzip',
}

export type FileTypeKey = keyof typeof FileTypes;