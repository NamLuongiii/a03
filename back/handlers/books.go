package handlers

import (
	"archive/zip"
	"bytes"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"quickstart/dto"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/services"
	"quickstart/types"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gosimple/slug"
)

type BooksHandler struct {
	bookRepository          models.BookRepositoryInterface
	categoryRepository      models.CategoryRepositoryInterface
	authorRepository        models.AuthorRepositoryInterface
	commentRepository       models.CommentRepositoryInterface
	featuredGroupRepository models.FeaturedBookGroupRepositoryInterface
	digitalBookRepository   models.DigitalBookRepositoryInterface
	bookSeriesRepository    models.BookSeriesRepositoryInterface
	bookRatingRepository    models.BookRatingRepositoryInterface
	fileStorage             FileStorageInterface
	imageProcessor          ImageProcessorInterface
	imageRepository         models.ImageRepositoryInterface
	epubService             services.EpubServiceInterface
}

type BookParams struct {
	BookRepository          models.BookRepositoryInterface
	CategoryRepository      models.CategoryRepositoryInterface
	AuthorRepository        models.AuthorRepositoryInterface
	CommentRepository       models.CommentRepositoryInterface
	FeaturedGroupRepository models.FeaturedBookGroupRepositoryInterface
	DigitalBookRepository   models.DigitalBookRepositoryInterface
	BookSeriesRepository    models.BookSeriesRepositoryInterface
	BookRatingRepository    models.BookRatingRepositoryInterface
	FileStorage             FileStorageInterface
	ImageProcessor          ImageProcessorInterface
	ImageRepository         models.ImageRepositoryInterface
	EpubService             services.EpubServiceInterface
}

func NewBooksHandler(params BookParams) *BooksHandler {
	return &BooksHandler{
		bookRepository:          params.BookRepository,
		categoryRepository:      params.CategoryRepository,
		authorRepository:        params.AuthorRepository,
		commentRepository:       params.CommentRepository,
		featuredGroupRepository: params.FeaturedGroupRepository,
		digitalBookRepository:   params.DigitalBookRepository,
		bookSeriesRepository:    params.BookSeriesRepository,
		bookRatingRepository:    params.BookRatingRepository,
		fileStorage:             params.FileStorage,
		imageProcessor:          params.ImageProcessor,
		imageRepository:         params.ImageRepository,
		epubService:             params.EpubService,
	}
}

// @Summary	Get books
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		size		query		int																		false	"Number of books per page"
// @Param		page		query		int																		false	"Page number"
// @Param		category	query		string																	false	"Category name"
// @Param		search		query		string																	false	"Search term"
// @Success	200			{object}	types.CommonResponse{data=types.PaginationData{items=[]models.Book}}	"OK"
// @Router		/books [get]
func (h *BooksHandler) GetBooks(c *gin.Context) {
	size, e := strconv.Atoi(c.Query("size"))
	page, e := strconv.Atoi(c.Query("page"))
	if e != nil {
		size = 10
		page = 1
	}

	params := types.PaginationParams{
		Size:     size,
		Page:     page,
		Category: c.Query("category"),
		Search:   c.Query("search"),
	}

	pd, e := h.bookRepository.GetAll(params)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    pd,
	})
}

// @Summary	Get featured books
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		recommender	query		string										false	"recommender"
// @Success	200			{object}	types.CommonResponse{data=[]models.Book}	"OK"
// @Router		/books/featured [get]
func (h *BooksHandler) GetFeaturedBooks(c *gin.Context) {
	recommender := c.Query("recommender")

	if recommender == "new-books" {
		bs, e := h.bookRepository.GetNewestBooks(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "popular-books" {
		bs, e := h.bookRepository.GetPopularBooks(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "books-other-users-liked" {
		bs, e := h.bookRepository.GetBooksOtherUserRead(10)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	}

}

// @Summary	Get book by ID
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		id	path		string									true	"Book ID"
// @Success	200	{object}	types.CommonResponse{data=models.Book}	"OK"
// @Router		/books/{id} [get]
func (h *BooksHandler) GetBookByID(c *gin.Context) {
	id := c.Param("id")

	b, e := h.bookRepository.GetByID(id)

	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    b,
	})

}

// @Summary	Get book categories
// @Tags		books
// @Accept		json
// @Produce	json
// @Success	200	{object}	types.CommonResponse{data=[]models.Category}	"OK"
// @Router		/books/categories [get]
func (h *BooksHandler) GetCategories(c *gin.Context) {
	cs, e := h.categoryRepository.GetAll()
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    cs,
	})
}

// @Summary	Get author by ID
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		authorID	path		string										true	"Author ID"
// @Success	200			{object}	types.CommonResponse{data=models.Author}	"OK"
// @Router		/books/authors/{authorID} [get]
func (h *BooksHandler) GetAuthors(c *gin.Context) {
	id := c.Param("authorID")
	author, e := h.authorRepository.GetByID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    author,
	})
}

// @Summary	Add comment
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		id		path		string										true	"Book ID"
// @Param		body	body		dto.CommentDto								true	"Comment body"
// @Success	200		{object}	types.CommonResponse{data=models.Comment}	"OK"
// @Router		/books/{id}/comments [post]
func (h *BooksHandler) AddComment(c *gin.Context) {
	bID := c.Param("id")
	uID := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims).ID

	var body dto.CommentDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}

	comment := &models.Comment{
		BookID:    bID,
		AccountID: uID,
		Content:   body.Text,
		Title:     body.Title,
	}
	er := h.commentRepository.Create(comment)
	if er != nil {
		c.Error(middleware.NewServerInternalError(er.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    comment,
	})
}

// @Summary	Add rating
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		id	path		string											true	"Book ID"
// @Success	200	{object}	types.CommonResponse{data=models.BookRating}	"OK"
// @Router		/books/{id}/ratings [post]
func (h *BooksHandler) AddRating(c *gin.Context) {
	bID := c.Param("id")

	b, e := h.bookRepository.GetByID(bID)
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	var body dto.RatingDto
	if err := c.ShouldBindJSON(&body); err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}
	uID := c.MustGet(types.ContextKeyTokenClaims).(*types.AuthClaims).ID

	br := &models.BookRating{
		AccountID: uID,
		BookID:    bID,
		Rating:    body.Rating,
	}

	er := h.bookRatingRepository.Create(br)
	if er != nil {
		c.Error(middleware.NewServerInternalError(er.Error()))
		return
	}

	// update book rating
	b.RatingAvg = (float64(b.RatingCount)*b.RatingAvg + float64(br.Rating)) / float64(b.RatingCount)
	b.RatingCount += 1
	e = h.bookRepository.Update(b)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    br,
	})

}

// @Summary	Get book comments
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		id	path		string										true	"Book ID"
// @Success	200	{object}	types.CommonResponse{data=[]models.Comment}	"OK"
// @Router		/books/{id}/comments [get]
func (h *BooksHandler) GetComments(c *gin.Context) {
	id := c.Param("id")

	cms, e := h.commentRepository.GetByBookID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    cms,
	})

}

// @Summary	Delete book
// @Tags		books
// @Accept		json
// @Produce	json
// @Param		id	path		string					true	"Book ID"
// @Success	200	{object}	types.CommonResponse	"OK"
// @Router		/books/{id} [delete]
func (h *BooksHandler) DeleteBook(c *gin.Context) {
	id := c.Param("id")

	er := h.bookRepository.Delete(id)
	if er != nil {
		c.Error(middleware.NewServerInternalError(er.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
	})
}

// CreateBook godoc
//
//	@Summary	Create a new book
//	@Tags		books
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		name				formData	string									true	"Book name"
//	@Param		cover				formData	file									false	"Book cover"
//	@Param		files				formData	[]file									false	"Book files"
//	@Param		description			formData	string									false	"Book description"
//	@Param		summary				formData	string									false	"Book summary"
//	@Param		category_id			formData	string									false	"Book category"
//	@Param		author_id			formData	string									false	"Book authors"
//	@Param		readingFile			formData	file									false	"file to unzip services"
//	@Param		autoFindReadingFile	formData	string									false	"Auto find services file in file list: 1 / 0"
//	@Success	200					{object}	types.CommonResponse{data=models.Book}	"OK"
//	@Router		/books [post]
func (h *BooksHandler) CreateBook(c *gin.Context) {
	name := c.PostForm("name")
	categoryID := c.PostForm("category_id")
	authorID := c.PostForm("author_id")
	description := c.PostForm("description")
	summary := c.PostForm("summary")

	if name == "" {
		c.Error(middleware.NewBadRequestError("name is required"))
		return
	}
	slug := slug.Make(name)

	b, _ := h.bookRepository.GetByIDSimple(slug)
	if b.ID != "" {
		c.Error(middleware.NewBadRequestError("Book already exists"))
		return
	}

	// create a book
	book := &models.Book{
		ID:          slug,
		Name:        name,
		Description: description,
		Summary:     summary,
		CategoryID:  &categoryID,
		AuthorID:    &authorID,
	}

	cover, e := c.FormFile("cover")
	if e != nil {
		if errors.Is(e, http.ErrMissingFile) {
			cover = nil
		} else {
			c.Error(middleware.NewBadRequestError(e.Error()))
			return
		}
	}

	if cover != nil {
		dbImg, e := h.createCoverImage(cover, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		book.CoverID = &dbImg.ID
	}

	e = h.bookRepository.Create(book)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	// Get multipart form
	mf, e := c.MultipartForm()
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	// Get digital book files
	files, _ := mf.File["files"]
	for _, f := range files {
		_, e := h.createDigitalBook(f, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
	}

	// If the reading file is provided, process the file for reading online feature
	readingFile, e := c.FormFile("readingFile")
	if e != nil && !errors.Is(e, http.ErrMissingFile) {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	if readingFile != nil {
		unzipRootUrl, e := h.setupOnlineReadingMode(readingFile, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}

		book.UnzipRootURL = unzipRootUrl

		e = h.bookRepository.Update(book)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Data:    book,
		Success: true,
		Message: "Book created",
	})

}

// UpdateBook godoc
//
//	@Summary	Update book
//	@Tags		books
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		id					path		string									true	"Book ID"
//	@Param		name				formData	string									false	"Book name"
//	@Param		cover				formData	file									false	"Book cover"
//	@Param		files				formData	[]file									false	"Book files"
//	@Param		category_id			formData	string									false	"Book category"
//	@Param		author_id			formData	string									false	"Book authors"
//	@Param		remove_file_ids		formData	[]integer								false	"File IDs to remove"
//	@Param		description			formData	string									false	"Book description"
//	@Param		summary				formData	string									false	"Book summary"
//	@Param		readingFile			formData	file									false	"file to unzip services"
//	@Param		autoFindReadingFile	formData	string									false	"Auto find services file in file list: 1 / 0"
//	@Success	200					{object}	types.CommonResponse{data=models.Book}	"OK"
//	@Router		/books/{id} [put]
func (h *BooksHandler) UpdateBook(c *gin.Context) {
	id := c.Param("id")
	name := c.PostForm("name")
	categoryID := c.PostForm("category_id")
	authorID := c.PostForm("author_id")
	description := c.PostForm("description")
	summary := c.PostForm("summary")
	removeFileIDs := c.PostFormArray("remove_file_ids")

	if id == "" {
		c.Error(middleware.NewBadRequestError("Book ID is required"))
		return
	}

	book, e := h.bookRepository.GetByIDSimple(id)
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	book.Name = name
	book.Description = description
	book.Summary = summary
	if categoryID != "" {
		book.CategoryID = &categoryID
	} else {
		book.CategoryID = nil
	}
	if authorID != "" {
		book.AuthorID = &authorID
	} else {
		book.AuthorID = nil
	}

	// if cover is provided, update cover
	cover, e := c.FormFile("cover")
	if e != nil {
		fmt.Println(e)
		if errors.Is(e, http.ErrMissingFile) {
			cover = nil
		} else {
			c.Error(middleware.NewBadRequestError(e.Error()))
			return
		}
	}

	if cover != nil {
		// delete old cover
		if book.CoverID != nil {
			e := h.deleteImage(*book.CoverID)
			if e != nil {
				c.Error(middleware.NewServerInternalError(e.Error()))
				return
			}
		}

		dbImg, e := h.createCoverImage(cover, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		book.CoverID = &dbImg.ID
	}

	// if files are provided, create new digital books
	if files, e := c.MultipartForm(); e == nil {
		for _, f := range files.File["files"] {
			_, e := h.createDigitalBook(f, book.ID)
			if e != nil {
				c.Error(middleware.NewServerInternalError(e.Error()))
				return
			}
		}
	}

	// if file ids are provided, delete digital books
	for _, id := range removeFileIDs {
		// convert id to int
		idInt, err := strconv.Atoi(id)
		if err != nil {
			c.Error(middleware.NewServerInternalError(err.Error()))
			return
		}
		e := h.deleteDigitalBook(idInt, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
	}

	// If the reading file is provided, process the file for reading online feature
	readingFile, e := c.FormFile("readingFile")
	if e != nil && !errors.Is(e, http.ErrMissingFile) {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	if readingFile != nil {
		unzipRootUrl, e := h.setupOnlineReadingMode(readingFile, book.ID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		book.UnzipRootURL = unzipRootUrl
	}

	e = h.bookRepository.Update(&book)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Data:    book,
		Success: true,
		Message: "Book updated",
	})
}

func (h *BooksHandler) createCoverImage(f *multipart.FileHeader, bookID string) (*models.Image, error) {
	xs, sm, md, xsn, smn, mdn, e := h.imageProcessor.ProcessImage(f)
	if e != nil {
		return nil, e
	}
	xsUrl, e := h.fileStorage.UploadFileNoUUID(xs, fmt.Sprintf("%s/%s", bookID, xsn), FolderBookCovers)
	smUrl, e1 := h.fileStorage.UploadFileNoUUID(sm, fmt.Sprintf("%s/%s", bookID, smn), FolderBookCovers)
	mdUrl, e2 := h.fileStorage.UploadFileNoUUID(md, fmt.Sprintf("%s/%s", bookID, mdn), FolderBookCovers)
	if e != nil {
		return nil, e
	}
	if e1 != nil {
		return nil, e1
	}
	if e2 != nil {
		return nil, e2
	}

	dbImg := &models.Image{
		XS: xsUrl,
		SM: smUrl,
		MD: mdUrl,
	}
	e3 := h.imageRepository.Create(dbImg)
	if e3 != nil {
		return nil, e3
	}

	return dbImg, nil
}

func (h *BooksHandler) createDigitalBook(f *multipart.FileHeader, bookID string) (*models.DigitalBook, error) {
	file, err := f.Open()
	if err != nil {
		return nil, err
	}
	url, e := h.fileStorage.UploadFileNoUUID(file, fmt.Sprintf("%s/%s", bookID, f.Filename), FolderBookFiles)
	if e != nil {
		return nil, e
	}

	db := models.DigitalBook{
		Name:     f.Filename,
		FileType: f.Header["Content-Type"][0],
		FileSize: f.Size,
		BookID:   bookID,
		URL:      url,
	}

	er := h.digitalBookRepository.Create(&db)
	if er != nil {
		return nil, er
	}

	return &db, nil
}

func (h *BooksHandler) deleteImage(id int) error {
	img, e := h.imageRepository.GetByID(id)
	if e != nil {
		return e
	}

	e = h.fileStorage.DeleteFile(img.SM, FolderBookCovers)
	e = h.fileStorage.DeleteFile(img.MD, FolderBookCovers)
	e = h.fileStorage.DeleteFile(img.XS, FolderBookCovers)
	e = h.imageRepository.DeleteByID(id)
	return e
}

func (h *BooksHandler) deleteDigitalBook(id int, bookID string) error {
	db, e := h.digitalBookRepository.GetByIDAndBookID(id, bookID)
	if e != nil {
		return e
	}
	e = h.fileStorage.DeleteFile(db.URL, FolderBookFiles)
	e = h.digitalBookRepository.DeleteByID(id)
	return e
}

// UnzipBook godoc
//
//	@Summary	Unzip a book
//	@Tags		books
//	@Accept		multipart/form-data
//	@Param		file	formData	file					false	"Book file"
//	@Param		id		formData	string					false	"Book ID"
//	@Success	200		{object}	types.CommonResponse	"OK"
//	@Router		/books/unzip [post]
func (h *BooksHandler) UnzipBook(c *gin.Context) {
	file, e := c.FormFile("file")
	id := c.PostForm("id")

	if id == "" {
		c.Error(middleware.NewBadRequestError("Book ID is required"))
		return
	}

	if e != nil {
		c.Error(middleware.NewBadRequestError("File is required"))
		return
	}

	// 1. Mở file ZIP
	src, err := file.Open()
	if err != nil {
		c.Error(middleware.NewServerInternalError(err.Error()))
		return
	}
	defer src.Close()

	// zip.NewReader cần ReaderAt, nên ta đọc vào buffer
	body, err := io.ReadAll(src)
	if err != nil {
		c.Error(middleware.NewServerInternalError(err.Error()))
		return
	}

	zipReader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		c.Error(middleware.NewBadRequestError("Invalid EPUB/ZIP format"))
		return
	}

	var uploadedFiles []string

	// 2. Duyệt từng file bên trong EPUB
	for _, f := range zipReader.File {
		// Bỏ qua nếu là thư mục
		if f.FileInfo().IsDir() {
			continue
		}

		// Mở file con bên trong zip
		rc, err := f.Open()
		if err != nil {
			continue
		}

		// Đọc dữ liệu file con vào bytes.Reader (để thỏa mãn giao diện io.ReadSeeker)
		content, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			continue
		}
		reader := bytes.NewReader(content)

		// 3. Định nghĩa đường dẫn lưu trên Object Storage
		// Ví dụ: UnzipBooks/123/OEBPS/content.opf
		remotePath := fmt.Sprintf("UnzipBooks/%s/%s", id, f.Name)

		// Gọi hàm UploadFile của bạn
		// Lưu ý: folder truyền vào tùy thuộc vào cách bạn định nghĩa StorageFolder (ở đây giả sử là "books" hoặc tương đương)
		_, err = h.fileStorage.UploadFileNoUUID(reader, remotePath, "books")
		if err != nil {
			fmt.Printf("Failed to upload %s: %v\n", f.Name, err)
			continue
		}

		uploadedFiles = append(uploadedFiles, f.Name)
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    uploadedFiles,
		Message: fmt.Sprintf("Unzipped and uploaded %d files to Object Storage", len(uploadedFiles)),
	})
}
func (h *BooksHandler) unzipEPUB(file *multipart.FileHeader, destDir string) ([]string, error) {
	var filenames []string

	// Mở file multipart
	src, err := file.Open()
	if err != nil {
		return nil, err
	}
	defer src.Close()

	// Đọc nội dung vào Buffer để zip.NewReader có thể sử dụng (vì zip cần ReaderAt)
	// Hoặc lưu tạm ra file nếu file quá lớn
	body, err := io.ReadAll(src)
	if err != nil {
		return nil, err
	}

	r, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		return nil, err
	}

	for _, f := range r.File {
		// Bảo mật: Kiểm tra ZipSlip (tránh file có tên ../../../etc/passwd)
		fpath := filepath.Join(destDir, f.Name)
		if !strings.HasPrefix(fpath, filepath.Clean(destDir)+string(os.PathSeparator)) {
			continue
		}

		filenames = append(filenames, f.Name)

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if err = os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return nil, err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return nil, err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return nil, err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return nil, err
		}
	}

	return filenames, nil
}

// setupOnlineReadingMode thiết lập chế độ đọc trực tuyến cho sách
func (h *BooksHandler) setupOnlineReadingMode(f *multipart.FileHeader, bookID string) (string, error) {
	// 0. Validate file is services
	e := h.epubService.Confirm(f)

	// 1. If current unzip book exists delete it
	e = h.fileStorage.DeleteFolder(fmt.Sprintf("%s/%s", FolderUnzippedBook, bookID))

	// 2. Unzip current file
	file, e := f.Open()
	defer file.Close()
	body, e := io.ReadAll(file)
	zipReader, e := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	files := zipReader.File

	// 3. Upload unzip folder to Object Storage
	for _, f := range files {
		if f.FileInfo().IsDir() {
			continue
		}

		// Mở file con bên trong zip
		rc, err := f.Open()
		if err != nil {
			continue
		}

		// Đọc dữ liệu file con vào bytes.Reader (để thỏa mãn giao diện io.ReadSeeker)
		content, err := io.ReadAll(rc)
		rc.Close()
		if err != nil {
			continue
		}
		reader := bytes.NewReader(content)

		// 3. Định nghĩa đường dẫn lưu trên Object Storage
		// Ví dụ: UnzippedBooks/123/OEBPS/content.opf
		remotePath := fmt.Sprintf("%s/%s", bookID, f.Name)

		// Gọi hàm UploadFile của bạn
		// Lưu ý: folder truyền vào tùy thuộc vào cách bạn định nghĩa StorageFolder (ở đây giả sử là "books" hoặc tương đương)
		_, err = h.fileStorage.UploadFileNoUUID(reader, remotePath, FolderUnzippedBook)
		if err != nil {
			fmt.Printf("Failed to upload %s: %v\n", f.Name, err)
			continue
		}
	}

	// 5. Update book with unzip folder url
	if e != nil {
		return "", e
	}

	return h.fileStorage.GetBaseUrl(FolderUnzippedBook), e
}
