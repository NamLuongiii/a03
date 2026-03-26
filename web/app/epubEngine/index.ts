import ePub, {Book, Location, NavItem, Rendition} from 'epubjs';
import {getFullUrl} from "@/app/helpers";

export class EpubEngine {
    public rendition: Rendition | null = null; // Lưu lại để điều khiển sau này
    private readonly book: Book;
    private readonly baseUrl: string;
    private currentSpineIndex: number = 0;
    private ID: string

    constructor(ID: string, unzipRootURL: string) {
        this.baseUrl = unzipRootURL.endsWith('/') ? unzipRootURL : `${unzipRootURL}/`;
        this.book = ePub(getFullUrl(this.baseUrl));
        this.ID = ID
    }

    async init() {
        await this.book.opened;
        return this.book;
    }

    /**
     * Render sách vào một DOM element bằng engine của epubjs
     * @param elementRef - Phần tử HTML (thường là div) để chứa iframe
     */
    async render(elementRef: HTMLElement) {
        await this.book.opened;
        this.rendition = this.book.renderTo(elementRef, {
            width: "100%",
            height: "100%",
            flow: "paginated",
            manager: "default",
            spread: "none",
            allowScriptedContent: true,
        });

        // Bạn có thể thiết lập style mặc định cho font chữ tiếng Việt ở đây
        // const googleFontUrl = "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
        // this.rendition.hooks.content.register((contents: Contents) => {
        //     contents.addStylesheet(googleFontUrl);
        // });

        // this.rendition.themes.font("Be Vietnam Pro");

        this.rendition.themes.font('system-ui')
        this.rendition.themes.fontSize('20px')

        // Tự động lưu vị trí mỗi khi người dùng cuộn hoặc chuyển trang
        this.rendition.on("relocated", (location: Location) => {
            this.saveProgress(location.start.cfi);

            // Cập nhật spine index hiện tại
            const spineItem = this.book.spine.get(location.start.href);
            if (spineItem) {
                this.currentSpineIndex = spineItem.index;
            }
        });

        const storedCfi = this.getStoredLocation()
        if (storedCfi) {
            return this.rendition.display(storedCfi);
        }
        return this.rendition.display();
    }

    /**
     * Nhảy đến một chương dựa trên index sử dụng rendition
     */
    async goToChapter(index: number) {
        if (!this.rendition) return;

        // @ts-expect-error - Truy cập items từ spine
        const spineItems = this.book.spine.items;
        if (index >= 0 && index < spineItems.length) {
            const item = spineItems[index];
            this.currentSpineIndex = index;
            return await this.rendition.display(item.href);
        }
    }

    getChapterUrl(index: number): string | null {
        const item = this.book.spine.get(index);
        if (!item) return null;
        this.currentSpineIndex = index;
        return item.url;
    }

    start() {
        if (this.rendition) {
            return this.rendition.display(); // Nếu dùng render()
        }
        return this.getChapterUrl(0); // Nếu dùng iframe tự quản
    }

    next() {
        // Nếu bạn đang dùng Rendition của epubjs
        if (this.rendition) {
            return this.rendition.next();
        }

        // Nếu bạn đang tự quản lý Iframe src
        // @ts-expect-error - Truy cập items từ spine
        const spineItems = this.book.spine.items;
        if (this.currentSpineIndex < spineItems.length - 1) {
            return this.getChapterUrl(this.currentSpineIndex + 1);
        }
        return null;
    }

    previous() {
        if (this.rendition) {
            return this.rendition.prev();
        }

        if (this.currentSpineIndex > 0) {
            return this.getChapterUrl(this.currentSpineIndex - 1);
        }
        return null;
    }

    async getNavigation() {
        const nav = await this.book.loaded.navigation;
        return nav.toc;
    }

    getCurrentIndex() {
        return this.currentSpineIndex;
    }

    async jumpToChapter(item: NavItem) {
        if (!this.rendition) {
            console.warn("Rendition chưa sẵn sàng");
            return;
        }

        try {
            // 1. Dùng rendition để hiển thị chương theo href của NavItem
            // rendition.display xử lý tốt cả link có anchor (#)
            await this.rendition.display(item.href);

            // 2. Cập nhật currentSpineIndex để đồng bộ nút Next/Previous
            // Chúng ta lấy ID thực tế từ href (bỏ phần anchor sau dấu # nếu có)
            const hrefWithoutAnchor = item.href.split('#')[0];
            const spineItem = this.book.spine.get(hrefWithoutAnchor);

            if (spineItem) {
                this.currentSpineIndex = spineItem.index;
            }

            console.log(`Đã chuyển tới: ${item.label}`);
        } catch (error) {
            console.error("Không thể nhảy tới chương:", error);
        }
    }

    destroy() {
        if (this.rendition) {
            this.rendition.destroy();
        }
        this.book.destroy();
    }

    /**
     * LẤY LỊCH SỬ: Trả về CFI đã lưu
     */
    getStoredLocation(): string | null {
        return localStorage.getItem(this.ID);
    }

    /**
     * ĐI TỚI LỊCH SỬ: Nhảy đến vị trí cũ nếu có
     */
    async goToStoredLocation() {
        if (!this.rendition) return;

        const storedCfi = this.getStoredLocation();
        if (storedCfi) {
            console.log("Đang quay lại vị trí cũ:", storedCfi);
            return await this.rendition.display(storedCfi);
        }

        // Nếu không có lịch sử, bắt đầu từ đầu
        return await this.start();
    }

    private saveProgress(cfi: string) {
        localStorage.setItem(this.ID, cfi);
    }
}