import Navbar from "@/app/components/layout/Navbar";
import SavedBook from "@/app/(views)/homepage/SavedBooks";
import {Blockquote} from "@/app/components/ui/Blockquote";
import {Center} from "@/app/components/ui/Center";

export default function ViewsLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col min-h-screen">
            <Navbar/>

            {/* Main Container: Flex row trên màn hình lớn (lg), mặc định là flex-col */}
            <main className="grow container mx-auto max-page-width px-4 py-4 lg:py-12 flex flex-col lg:flex-row gap-12">

                {/* Content chính: Chiếm hết chỗ trống */}
                <section className="flex-1 min-w-0">
                    {children}
                </section>

                {/* Sidebar bên phải */}
                <aside className="w-full lg:w-80 space-y-6 self-start hidden lg:block sticky top-20">
                    {/* Widget 1: Ví dụ Sách đang đọc */}
                    <SavedBook/>

                    <Blockquote cite='Dagestan Của Tôi'>
                        Chúng ta là những hòn đá ít nữa sẽ gắn thành tường
                        <br/>
                        Làm lâu đài, nhà kho, đền chùa hay là nhà tù.
                        <br/>
                        Lời ghi trên đá
                        <br/>
                        Đá quý phải xem trong khung, nhìn người phải nhìn trong nhà.
                        <br/>
                        Khi đám cưới đã xong - Cần phải dựng nhà.
                        <br/>
                    </Blockquote>
                </aside>
            </main>

            <footer>
                <Center>
                    <small>Toàn bộ sách được sưu tập trên mạng</small>
                    <small>Mọi vấn đề về bản quyền vui lòng liên hệ với chúng tôi qua email</small>
                    <small><i>docluonbook@gmail.com</i></small>
                    <small className="text-small text-default-400 text-center">
                        © 2026
                    </small>
                </Center>
            </footer>
        </div>
    );
}