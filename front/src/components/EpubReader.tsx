import React, {useEffect, useRef, useState} from 'react';
import ePub, {Book, Rendition} from 'epubjs';
import styled from 'styled-components';

interface EpubReaderProps {
    folderUrl: string;
}

// --- Styled Components ---

const ReaderContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Sidebar = styled.aside`
  width: 288px;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  
  h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
`;

const NavList = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
`;

const TocButton = styled.button`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  margin-bottom: 4px;
  font-size: 0.875rem;
  color: #475569;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #f8fafc;
    color: #0f172a;
  }
`;

const MainView = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FloatingHeader = styled.header`
  position: absolute;
  top: 16px;
  right: 32px;
  z-index: 10;
  display: flex;
  gap: 8px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;

  &:hover {
    background-color: #ffffff;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BookContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding-top: 40px;
  padding-bottom: 80px;
`;

const BookPaper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 850px;
  background-color: #ffffff;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-height: 100%;
`;

const ViewerTarget = styled.div`
  width: 100%;
  height: 100%;
`;

// --- Component Logic ---

export const EpubReader: React.FC<EpubReaderProps> = ({ folderUrl }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const renditionRef = useRef<Rendition | null>(null);
    const bookRef = useRef<Book | null>(null);
    const [toc, setToc] = useState<any[]>([]);

    useEffect(() => {
        if (!viewerRef.current || !folderUrl) return;

        const validUrl = folderUrl.endsWith('/') ? folderUrl : `${folderUrl}/`;
        const book = ePub(validUrl);
        bookRef.current = book;

        book.loaded.navigation.then((nav) => {
            setToc(nav.toc);
        });

        const rendition = book.renderTo(viewerRef.current, {
            width: "100%",
            height: "100%",
            flow: "scrolled",
            manager: "default",
        });

        renditionRef.current = rendition;

        rendition.themes.default({
            body: { "padding": "40px !important" }
        });

        rendition.display();

        return () => {
            if (bookRef.current) {
                bookRef.current.destroy();
                bookRef.current = null;
            }
        };
    }, [folderUrl]);

    const goToLocation = (href: string) => {
        renditionRef.current?.display(href);
    };

    const nextPage = () => renditionRef.current?.next();
    const prevPage = () => renditionRef.current?.prev();

    return (
        <ReaderContainer>
            <Sidebar>
                <SidebarHeader>
                    <h2>Mục lục</h2>
                </SidebarHeader>
                <NavList>
                    {toc.map((item, index) => (
                        <TocButton
                            key={index}
                            onClick={() => goToLocation(item.href)}
                            title={item.label.trim()}
                        >
                            {item.label.trim()}
                        </TocButton>
                    ))}
                    {toc.length === 0 && (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '12px', fontStyle: 'italic' }}>
                            Đang tải mục lục...
                        </p>
                    )}
                </NavList>
            </Sidebar>

            <MainView>
                <FloatingHeader>
                    <IconButton onClick={prevPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </IconButton>
                    <IconButton onClick={nextPage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </IconButton>
                </FloatingHeader>

                <BookContent>
                    <BookPaper>
                        <ViewerTarget ref={viewerRef} />
                    </BookPaper>
                </BookContent>
            </MainView>
        </ReaderContainer>
    );
};