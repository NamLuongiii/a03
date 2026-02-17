package handlers

import (
	"net/http"
	"quickstart/middleware"
	"quickstart/models"
	"quickstart/types"

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
	}
}

// GetBooks godoc
//
//	@Summary	Get all books
//	@Tags		books
//	@Router		/books [get]
//	@Success	200	{array}	models.Book	"OK"
func (h *BooksHandler) GetBooks(c *gin.Context) {
	books := make([]*models.Book, 0)
	c.JSON(200, books)
}

// GetFeaturedBooks godoc
//
//	@Summary	Get featured books
//	@Tags		books
//	@Router		/books/featured [get]
func (h *BooksHandler) GetFeaturedBooks(c *gin.Context) {
	return
}

// GetBookByID godoc
//
//	@Summary	Get a book by ID
//	@Tags		books
//	@Router		/books/{id} [get]
//	@Param		id	path	int	true	"Book ID"
func (h *BooksHandler) GetBookByID(c *gin.Context) {
	return
}

// GetCategories godoc
//
//	@Summary	Get all categories
//	@Tags		books
//	@Router		/books/categories [get]
func (h *BooksHandler) GetCategories(c *gin.Context) {
	return
}

// GetPopularBooks godoc
//
//	@Summary	Get popular books
//	@Tags		books
//	@Router		/books/popular [get]
func (h *BooksHandler) GetPopularBooks(c *gin.Context) {
	return
}

// GetAuthors godoc
//
//	@Summary	Get all authors
//	@Tags		books
//	@Router		/books/authors/{authorID} [get]
func (h *BooksHandler) GetAuthors(c *gin.Context) {
	return
}

// AddComment godoc
//
//	@Summary	Add a comment to a book
//	@Tags		books
//	@Router		/books/{bookID}/comments [post]
func (h *BooksHandler) AddComment(c *gin.Context) {
	return
}

// AddRating godoc
//
//	@Summary	Add a rating to a book
//	@Tags		books
//	@Router		/books/{bookID}/ratings [post]
func (h *BooksHandler) AddRating(c *gin.Context) {
	return
}

// GetBooksInSeries godoc
//
//	@Summary	Get books in a series
//	@Tags		books
//	@Router		/books/{bookId}/get-by-series [get]
func (h *BooksHandler) GetBooksInSeries(c *gin.Context) {
	return
}

// CreateBook godoc
//
//	@Summary	Create a new book
//	@Tags		books
//	@Router		/books [post]
//	@Accept		multipart/form-data
//	@Param		name		formData	string	true	"Book name"
//	@Param		description	formData	string	false	"Description"
//	@Param		summary		formData	string	false	"Summary"
//	@Param		category_id	formData	string	false	"Category ID"
//	@Param		author_id	formData	string	false	"Author ID"
//	@Param		cover		formData	file	false	"Cover image"
//	@Param		files		formData	[]file	false	"Digital book files"
//	@Success	200			{object}	types.CommonResponse{data=models.Book}
//	@Security	BearerAuth
func (h *BooksHandler) CreateBook(c *gin.Context) {
	name := c.PostForm("name")

	// create a book
	book := &models.Book{
		ID:   slug.Make(name),
		Name: name,
	}

	e := h.bookRepository.Create(book)
	if e != nil {
		c.Error(middleware.NewServerInternalError(e.Error()))
		return
	}

	//cover, e := c.FormFile("cover")
	//if e != nil {
	//	c.Error(middleware.NewBadRequestError(e.Error()))
	//	return
	//}

	// Get multipart form
	mf, e := c.MultipartForm()
	if e != nil {
		c.Error(middleware.NewBadRequestError(e.Error()))
		return
	}

	// Get digital book files
	files, _ := mf.File["files"]
	for _, file := range files {
		url, e := h.fileStorage.UploadFile(file, FolderBookFiles)
		if e != nil {
			c.Error(middleware.NewServerInternalError(e.Error()))
			return
		}

		db := models.DigitalBook{
			Name:     file.Filename,
			FileType: file.Header["Content-Type"][0],
			FileSize: file.Size,
			BookID:   book.ID,
			URL:      url,
		}

		er := h.digitalBookRepository.Create(&db)
		if er != nil {
			c.Error(middleware.NewServerInternalError(er.Error()))
			return
		}
	}

	c.JSON(http.StatusOK, types.CommonResponse{
		Data:    book,
		Success: true,
		Message: "Book created",
	})

}
