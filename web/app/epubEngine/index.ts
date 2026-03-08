import ePub, {Book, NavItem, Rendition} from 'epubjs';

export class EpubEngine {
    public rendition: Rendition | null = null; // Lưu lại để điều khiển sau này
    private book: Book;
    private baseUrl: string;
    private currentSpineIndex: number = 0;

    constructor(unzipRootURL: string) {
        this.baseUrl = unzipRootURL.endsWith('/') ? unzipRootURL : `${unzipRootURL}/`;
        this.book = ePub(this.baseUrl);
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
            flow: "scrolled", // Dạng cuộn (scrolled) hoặc lật trang (paginated)
            manager: "default",
            allowScriptedContent: true,
        });

        // Bạn có thể thiết lập style mặc định cho font chữ tiếng Việt ở đây
        this.rendition.themes.default({
            body: {
                "font-family": "system-ui, -apple-system, sans-serif !important",
                "font-size": "18px !important",
                "line-height": "1.7 !important",
                "max-width": "1000px !important",
                "margin": "0 auto !important",
            }
        });

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
}