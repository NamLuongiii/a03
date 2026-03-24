package handlers

import (
	"archive/zip"
	"bytes"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"quickstart/db"
	"quickstart/dto"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/services"
	"quickstart/types"
	"strconv"
	"strings"
	"time"

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
// @Param		author		query		string																	false	"Author name"
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
		Author:   c.Query("author"),
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
		bs, e := h.bookRepository.GetNewestBooks(16)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "popular-books" {
		bs, e := h.bookRepository.GetPopularBooks(16)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
		c.JSON(http.StatusOK, types.CommonResponse{
			Success: true,
			Data:    bs,
		})
	} else if recommender == "books-other-users-liked" {
		bs, e := h.bookRepository.GetBooksOtherUserRead(16)
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

// @Summary	Get most viewed books
// @Tags		books
// @Accept		json
// @Produce	json
// @Success	200	{object}	types.CommonResponse{data=[]models.Book}	"OK"
// @Router		/books/most-viewed [get]
func (h *BooksHandler) GetMostViewedBooks(c *gin.Context) {
	books, err := h.bookRepository.GetMostViewedBooks(24)
	if err != nil {
		c.Error(middleware.NewServerInternalError(err.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    books,
	})
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
// @Param		authorID	path		string																							true	"Author ID"
// @Success	200			{object}	types.CommonResponse{data=dto.AuthorDetailResponse{author=models.Author, books=models.Book[}}	"OK"
// @Router		/books/authors/{authorID} [get]
func (h *BooksHandler) GetAuthors(c *gin.Context) {
	id := c.Param("authorID")
	author, e := h.authorRepository.GetByID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	books, e := h.bookRepository.GetByAuthorID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data: dto.AuthorDetailResponse{
			Author: author,
			Books:  books,
		},
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
//
// @Security	BearerAuth
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
//
// @Security	BearerAuth
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
//
// @Security	BearerAuth
func (h *BooksHandler) DeleteBook(c *gin.Context) {
	id := c.Param("id")

	// delete file on s3
	book, e := h.bookRepository.GetByID(id)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}
	if book.CoverID != nil {
		e := h.deleteImage(*book.CoverID)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
	}

	for _, db := range book.DigitalBooks {
		e := h.deleteDigitalBook(db.ID, id)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}
	}

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
//	@Security	BearerAuth
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
//	@Security	BearerAuth
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

// CreateBookForTool godoc
//
//	@Summary	Create a new book for a tool
//	@Tags		books
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		name		formData	string									false	"Book name"
//	@Param		cover		formData	file									false	"Book cover"
//	@Param		files		formData	[]file									false	"Book files"
//	@Param		author_name	formData	string									false	"Book authors"
//	@Param		readingFile	formData	file									false	"file to unzip services"
//	@Success	200			{object}	types.CommonResponse{data=models.Book}	"OK
//	@Router		/books/create-tool [post]
//	@Security	BearerAuth
func (h *BooksHandler) CreateBookForTool(c *gin.Context) {
	name := c.PostForm("name")
	authorName := c.PostForm("author_name")

	// 1. Validate Cover (Ảnh bìa)
	cover, err := c.FormFile("cover")
	if err != nil {
		// Trường hợp không gửi file cover
		c.Error(middleware.NewBadRequestError("Missing cover image"))
		return
	}

	if err := h.validateCover(cover); err != nil {
		c.Error(err) // Trả về lỗi từ hàm validate (đã là BadRequestError)
		return
	}

	// 2. Validate Digital Files (Danh sách file sách)
	files := c.Request.MultipartForm.File["files"]
	if len(files) == 0 {
		c.Error(middleware.NewBadRequestError("At least one digital file is required"))
		return
	}

	for _, f := range files {
		if err := h.validateDigitalFile(f); err != nil {
			c.Error(err)
			return
		}
	}

	// Nếu chạy đến đây là mọi thứ đã sạch sẽ, sẵn sàng xử lý tiếp
	book := &models.Book{
		ID:   slug.Make(name),
		Name: name,
	}
	e := h.bookRepository.Create(book)
	if e != nil {
		c.Error(middleware.NewBadRequestError("Create book failed: " + e.Error()))
		return
	}

	// cover
	coverImg, e := h.createCoverImage(cover, book.ID)
	if e != nil {
		c.Error(middleware.NewBadRequestError("Create cover image failed: " + e.Error()))
		return
	}
	book.CoverID = &coverImg.ID

	// book files
	for _, f := range files {
		_, e := h.createDigitalBook(f, book.ID)
		if e != nil {
			c.Error(middleware.NewBadRequestError("Create digital book failed: " + e.Error()))
			return
		}
	}

	// unzip epub
	readingFile, e := c.FormFile("readingFile")
	if readingFile == nil {
		c.Error(middleware.NewBadRequestError("Reading file is required"))
		return
	}
	if h.validateDigitalFile(readingFile) != nil {
		c.Error(middleware.NewBadRequestError("Reading file must be a valid epub file"))
		return
	}

	unzipRootUrl, e := h.setupOnlineReadingMode(readingFile, book.ID)
	if e != nil {
		c.Error(middleware.NewBadRequestError("Setup online reading mode failed: " + e.Error()))
		return
	}

	// autho
	author, e := h.authorRepository.GetOrCreate(authorName)
	if e != nil {
		c.Error(middleware.NewBadRequestError("Create author failed: " + e.Error()))
		return
	}

	// update book
	book.AuthorID = &author.ID
	book.CoverID = &coverImg.ID
	book.UnzipRootURL = unzipRootUrl

	e = h.bookRepository.Update(book)

	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Success: true,
		Data:    book,
		Message: "Book created",
	})
}

func (h *BooksHandler) createCoverImage(f *multipart.FileHeader, bookID string) (*models.Image, error) {
	d, e := h.imageProcessor.CropImage(f)
	if e != nil {
		return nil, e
	}
	fileName := h.imageProcessor.CreateFileNameJPEG(f.Filename)
	mdUrl, e := h.fileStorage.UploadFile(bytes.NewReader(d.Md), "300_480_"+fileName, string(FolderBookCovers), bookID)
	smUrl, e1 := h.fileStorage.UploadFile(bytes.NewReader(d.Sm), "150_240"+fileName, string(FolderBookCovers), bookID)
	xsUrl, e2 := h.fileStorage.UploadFile(bytes.NewReader(d.Xs), "50_80"+fileName, string(FolderBookCovers), bookID)
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
	url, e := h.fileStorage.UploadFile(file, f.Filename, string(FolderBookFiles), bookID)
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

// Delete image by id
func (h *BooksHandler) deleteImage(id int) error {
	img, e := h.imageRepository.GetByID(id)
	if e != nil {
		return e
	}

	e = h.fileStorage.DeleteFile(img.SM)
	e = h.fileStorage.DeleteFile(img.MD)
	e = h.fileStorage.DeleteFile(img.XS)
	e = h.imageRepository.DeleteByID(id)
	return e
}

func (h *BooksHandler) deleteDigitalBook(id int, bookID string) error {
	db, e := h.digitalBookRepository.GetByIDAndBookID(id, bookID)
	if e != nil {
		return e
	}
	e = h.fileStorage.DeleteFile(db.URL)
	e = h.digitalBookRepository.DeleteByID(id)
	return e
}

// setupOnlineReadingMode thiết lập chế độ đọc trực tuyến cho sách
func (h *BooksHandler) setupOnlineReadingMode(f *multipart.FileHeader, bookID string) (string, error) {
	// 0. Validate file is services
	e := h.epubService.Confirm(f)
	if e != nil {
		return "", e
	}

	// 1. If current unzip book exists delete it
	e = h.fileStorage.DeleteFolder(string(FolderUnzippedBook), bookID)
	if e != nil {
		return "", e
	}

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
		// Gọi hàm UploadFile của bạn
		// Lưu ý: folder truyền vào tùy thuộc vào cách bạn định nghĩa StorageFolder (ở đây giả sử là "books" hoặc tương đương)
		_, err = h.fileStorage.UploadFile(reader, f.Name, string(FolderUnzippedBook), bookID)
		if err != nil {
			fmt.Printf("Failed to upload %s: %v\n", f.Name, err)
			continue
		}
	}

	// 5. Update book with unzip folder uploadKey
	if e != nil {
		return "", e
	}
	// Ví dụ: /UnzippedBooks/123/
	return fmt.Sprintf("/%s/%s/", string(FolderUnzippedBook), bookID), e
}

func (h *BooksHandler) validateCover(f *multipart.FileHeader) error {
	// 1. Kiểm tra dung lượng (Tối đa 10MB)
	if f.Size > 10*1024*1024 {
		return middleware.NewBadRequestError("Kích thước ảnh vượt quá giới hạn (Tối đa 10MB)")
	}

	// 2. Kiểm tra Content-Type từ Header
	// Một số loại phổ biến: image/jpeg, image/png, image/webp, image/gif
	contentType := f.Header.Get("Content-Type")
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/webp": true,
	}

	if !allowedTypes[contentType] {
		return middleware.NewBadRequestError("Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP")
	}

	// 3. (Nâng cao) Kiểm tra đuôi file thực tế
	ext := strings.ToLower(filepath.Ext(f.Filename))
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !allowedExts[ext] {
		return middleware.NewBadRequestError("Đuôi file không hợp lệ")
	}

	return nil
}

func (h *BooksHandler) validateDigitalFile(f *multipart.FileHeader) error {
	// 1. Kiểm tra dung lượng (Sách thường nặng hơn ảnh, ví dụ cho phép tối đa 50MB)
	const maxFileSize = 50 * 1024 * 1024 // 50MB
	if f.Size > maxFileSize {
		return middleware.NewBadRequestError("File sách vượt quá giới hạn cho phép (Tối đa 50MB)")
	}

	// 2. Danh sách các định dạng sách được phép
	// Content-Type của các loại file sách đôi khi khá phức tạp
	allowedContentTypes := map[string]bool{
		"application/pdf":                    true, // .pdf
		"application/epub+zip":               true, // .epub
		"application/x-mobipocket-ebook":     true, // .mobi hoặc .azw
		"application/vnd.amazon.mobi8-ebook": true, // .azw3
		"application/octet-stream":           true, // Đôi khi trình duyệt nhận nhầm file lạ là stream
		"application/vnd.amazon.ebook":       true,
	}

	// 3. Danh sách đuôi file được phép (Double check cho chắc chắn)
	allowedExtensions := map[string]bool{
		".pdf":  true,
		".epub": true,
		".mobi": true,
		".azw":  true,
		".azw3": true,
	}

	// Kiểm tra Content-Type
	contentType := f.Header.Get("Content-Type")
	// Kiểm tra đuôi file
	ext := strings.ToLower(filepath.Ext(f.Filename))

	if !allowedExtensions[ext] {
		return middleware.NewBadRequestError("Định dạng file ." + ext + " không được hỗ trợ. Chỉ nhận PDF, EPUB, MOBI, AZW3")
	}

	// Lưu ý: application/octet-stream là kiểu chung chung,
	// nếu là kiểu này thì ta tin tưởng vào Extension hơn.
	if contentType != "application/octet-stream" && !allowedContentTypes[contentType] {
		return middleware.NewBadRequestError("Kiểu nội dung file (MIME) không hợp lệ")
	}

	return nil
}

// TestUpload godoc
//
//	@Summary	Test upload file
//	@Tags		books
//	@Accept		multipart/form-data
//	@Produce	json
//	@Param		file	formData	file								true	"File to upload"
//	@Success	200		{object}	types.CommonResponse{data=string}	"OK"
//	@Router		/books/test-upload [post]
//	@Security	BearerAuth
func (h *BooksHandler) TestUpload(c *gin.Context) {
	file, e := c.FormFile("file")
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}
	f, e := file.Open()
	defer f.Close()
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}
	path, e := h.fileStorage.UploadFile(f, file.Filename, "test")
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{Success: true, Data: path})
}

// TestDelete godoc
//
//	@Summary		Test delete file
//	@Description	Xóa một file dựa trên đường dẫn cung cấp
//	@Tags			books
//
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			filePath	formData	string	true	"File to delete"
//
//	@Success		200			{object}	types.CommonResponse{data=string}
//	@Router			/books/test-delete [post]
//
//	@Security		BearerAuth
func (h *BooksHandler) TestDelete(c *gin.Context) {
	filePath := c.PostForm("filePath")
	if filePath == "" {
		c.Error(middleware.NewBadRequestError("File path cannot be empty"))
		return
	}
	err := h.fileStorage.DeleteFile(filePath)
	if err != nil {
		c.Error(middleware.NewBadRequestError(err.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{Success: true, Data: filePath})
}

// TestDeleteFolder godoc
//
//	@Summary		Delete folder on R1
//	@Description	Delete folder on R1
//	@Tags			books
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			folderName	formData	string	false	"Folder name"
//	@Param			fileName	formData	string	false	"File name"
//	@Success		200			{object}	types.CommonResponse{data=string}
//	@Router			/books/test-delete-folder [delete]
//
//	@Security		BearerAuth
func (h *BooksHandler) TestDeleteFolder(c *gin.Context) {
	folderName := c.PostForm("folderName")
	fileName := c.PostForm("fileName")

	e := h.fileStorage.DeleteFolder(folderName, fileName)
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}
	c.JSON(http.StatusOK, types.CommonResponse{Success: true})
}

// View godoc
//
//	@Summary		View book
//	@Description	View book
//	@Tags			books
//	@Accept			multipart/form-data
//	@Produce		json
//	@Param			id	path		string	true	"Book ID"
//	@Success		200	{object}	types.CommonResponse{data=string}
//	@Router			/books/{id}/view [post]
func (h *BooksHandler) View(c *gin.Context) {
	// get IP from request
	ip := c.ClientIP()

	if ip == "" {
		c.Error(middleware.NewBadRequestError("IP is empty"))
		return
	}

	// get book ID
	ID := c.Param("id")
	ctx := c.Request.Context()

	// lock to redis
	lockKey := fmt.Sprintf("lock:book:%s", ID)
	val, e := db.RedisClient.Exists(ctx, lockKey).Result()
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}
	if val > 0 {
		// lock exists
		c.JSON(http.StatusOK, types.CommonResponse{Success: false, Message: "Book is being viewed by another user"})
		return
	} else {
		// lock not exists each 30 minutes
		// exp: 3h 10800*time.Second
		// exp 1minute 60*time.Second
		e = db.RedisClient.Set(ctx, lockKey, "1", 3600*time.Second).Err()
		if e != nil {
			c.Error(middleware.NewBadRequestError(e.Error()))
			return
		}
		// increase view count
		countKey := fmt.Sprintf("viewNums:book:%s", ID)
		e = db.RedisClient.Incr(ctx, countKey).Err()
		if e != nil {
			c.Error(middleware.NewBadRequestError(e.Error()))
			return
		}

		c.JSON(http.StatusOK, types.CommonResponse{Success: true, Data: ip + ID})
	}
}
